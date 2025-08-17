import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { message as Message } from "antd";
import { Attachments, Sender } from "@ant-design/x";
import { fileService, messageService } from "../../../../services";
import { useMessageStore, useConversationStore } from "../../../../stores";
import {
  calculateFileMD5,
  createFileChunks,
  validateFileType,
  validateFileSize,
  formatFileSize,
  createResumeUploadTasks,
  concurrentPool,
} from "../../../../utils/fileUpload";
import type { ConversationType, MessageType } from "../../../../types";
import type {
  UseMessageSenderProps,
  TaskType,
  UploadEventType,
} from "../types";
import type { RcFile } from "antd/es/upload";
import type { GetRef, GetProp } from "antd";
import type { AttachmentsProps } from "@ant-design/x";

export const useMessageSender = ({
  isNewConv = false,
}: UseMessageSenderProps) => {
  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB 每切片
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB 最大文件大小
  const ALLOWED_FILE_TYPES = ["image/*"];

  const [value, setValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<GetProp<AttachmentsProps, "items">>(
    []
  );

  const eventSourceRef = useRef<EventSource | null>(null);
  const attachmentsRef = useRef<GetRef<typeof Attachments>>(null);
  const senderRef = useRef<GetRef<typeof Sender>>(null);
  const currentUploadEventRef = useRef<UploadEventType | null>(null);

  const navigate = useNavigate();

  const { sending, addMessage, updateMessage, removeMessage, setSending } =
    useMessageStore();
  const { currentConv, setCurrentConv, addConv } = useConversationStore();

  // 创建消息
  const createMessage = (
    conversationId: string,
    content: string,
    isUser: boolean = true
  ): MessageType => {
    if (!isUser) {
      const aiMessage = {
        id: `ai-${Date.now()}`,
        content,
        role: "assistant" as const,
        conversationId: conversationId,
        createdAt: new Date(),
      };

      return aiMessage;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      content,
      role: "user" as const,
      conversationId: conversationId,
      createdAt: new Date(),
    };

    return userMessage;
  };

  // 创建对话
  const createConv = (
    conversationId: string,
    title: string
  ): ConversationType => {
    const newCov = {
      id: conversationId,
      title,
      description: null,
      userId: "", // 这个值前端不需要使用
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return newCov;
  };

  // 清理和准备发送消息
  const prepareMessageSending = (userContent: string) => {
    // 关闭之前的连接
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    setValue("");
    setSending(true);
    return userContent;
  };

  // 创建SSE
  const createSSEConnection = async (
    conversationId: string,
    aiMessageId: string,
    userContent: string
  ) => {
    const eventSource = await messageService.createSSE(
      conversationId,
      (chunk) => {
        // 更新AI消息内容
        updateMessage(aiMessageId, (prev) => ({
          ...prev,
          content: prev.content + chunk,
        }));
      },
      () => {
        setSending(false);
      },
      (error) => {
        // 错误处理
        Message.error(error);
        removeMessage(aiMessageId);
        setValue(userContent);
        setSending(false);
      }
    );

    if (eventSource) {
      eventSourceRef.current = eventSource;
    }
  };

  // 处理新对话
  const handleNewConversation = async (userContent: string) => {
    // 发送用户消息并创建对话
    const result = await messageService.autoCreateAndSendFirstMessage(
      userContent
    );

    if (!result) {
      throw new Error("创建对话失败");
    }

    const { conversationId, title } = result;

    // 添加到对话列表并设置为当前对话
    const newConv = createConv(conversationId, title);
    addConv(newConv);
    setCurrentConv(newConv);

    // 添加用户消息和AI回复到UI
    const userMessage = createMessage(conversationId, userContent);
    const aiMessage = createMessage(conversationId, "", false);
    addMessage(userMessage);
    addMessage(aiMessage);

    // 跳转到对话页面
    navigate(`/conversation/${conversationId}`);

    // 开始流式处理
    await createSSEConnection(conversationId, aiMessage.id, userContent);
  };

  // 处理已有对话流程
  const handleExistingConversation = async (userContent: string) => {
    if (!currentConv) {
      throw new Error("请先选择对话");
    }

    const result = await messageService.sendUserMessage(
      currentConv.id,
      userContent
    );

    if (!result?.success) {
      throw new Error("发送消息失败");
    }

    // 添加用户消息和AI回复到UI
    const userMessage = createMessage(currentConv.id, userContent);
    const aiMessage = createMessage(currentConv.id, "", false);
    addMessage(userMessage);
    addMessage(aiMessage);

    // 开始流式处理
    await createSSEConnection(currentConv.id, aiMessage.id, userContent);
  };

  // 处理消息提交
  const handleMessageSubmit = async () => {
    if (!value.trim()) {
      Message.warning("请输入消息内容");
      return;
    }

    const userContent = prepareMessageSending(value.trim());

    try {
      if (isNewConv) {
        await handleNewConversation(userContent);
      } else {
        await handleExistingConversation(userContent);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "发送消息失败";
      Message.error(errorMessage);
      setValue(userContent);
      setSending(false);
    }
  };

  // 拦截并处理文件
  const interceptAndHandleFile = async (file: RcFile): Promise<boolean> => {
    try {
      // 文件类型验证
      if (!validateFileType(file, ALLOWED_FILE_TYPES)) {
        Message.error("不支持的文件类型");
        return false;
      }

      // 文件大小验证
      if (!validateFileSize(file, MAX_FILE_SIZE)) {
        Message.error(`文件大小不能超过 ${formatFileSize(MAX_FILE_SIZE)}`);
        return false;
      }

      setUploading(true);
      Message.loading("正在上传文件...", 0);

      // 1. 计算文件MD5
      const md5Hash = await calculateFileMD5(file, CHUNK_SIZE);

      // 2. 创建切片
      const chunks = createFileChunks(file, CHUNK_SIZE);

      // 3. 初始化上传事件
      const uploadEvent = await fileService.initUpload({
        fileName: file.name,
        fileSize: file.size,
        totalChunks: chunks.length,
        md5Hash,
      });

      if (!uploadEvent) {
        throw new Error("初始化上传事件失败");
      }

      // 检查是否为断点续传
      const uploadedChunks = uploadEvent.uploadedChunks || [];
      const isResume = uploadedChunks.length > 0;

      if (isResume) {
        Message.destroy();
        Message.loading(`检测到未完成上传，继续上传...`, 0);
      }

      // 4. 保存上传事件信息
      currentUploadEventRef.current = {
        uploadId: uploadEvent.uploadId,
        fileName: file.name,
        fileSize: file.size,
        totalChunks: chunks.length,
        md5Hash,
        uploadedChunks: [...uploadedChunks], // 使用服务器返回的已上传列表
        status: "uploading",
      };

      // 5. 创建上传任务 (跳过已上传的切片)
      const uploadTasks: TaskType[] = createResumeUploadTasks(
        uploadEvent.uploadId,
        chunks,
        uploadedChunks,
        // 前端手动更新，维护本地 uploadedChunks 状态
        (chunkIndex: number) => {
          if (currentUploadEventRef.current) {
            // 使用 Set 自动去重，保证并发环境下 chunkIndex 不会重复
            const uploadedSet = new Set(
              currentUploadEventRef.current.uploadedChunks
            );
            uploadedSet.add(chunkIndex);
            currentUploadEventRef.current.uploadedChunks =
              Array.from(uploadedSet);
          }
        }
      );

      await concurrentPool(uploadTasks, 3, 3);

      // 6. 合并切片
      const mergeResult = await fileService.mergeAllChunks({
        uploadId: uploadEvent.uploadId,
      });

      if (!mergeResult || !mergeResult.success) {
        throw new Error("文件合并失败");
      }

      // 7. 更新上传状态
      if (currentUploadEventRef.current) {
        currentUploadEventRef.current.status = "completed";
      }

      Message.destroy();
      Message.success(`文件 "${file.name}" 上传成功`);
    } catch (error) {
      Message.destroy();
      Message.error(
        `文件上传失败: ${error instanceof Error ? error.message : "未知错误"}`
      );

      // 更新失败状态
      if (currentUploadEventRef.current) {
        currentUploadEventRef.current.status = "failed";
      }
    } finally {
      setUploading(false);
    }

    return false;
  };

  return {
    // 状态
    value,
    isOpen,
    fileList,
    sending,
    uploading,
    currentConv,

    // refs
    senderRef,
    attachmentsRef,
    eventSourceRef,

    // 状态更新函数
    setValue,
    setIsOpen,
    setFileList,

    // 业务逻辑函数
    handleMessageSubmit,
    createMessage,
    createConv,
    interceptFile: interceptAndHandleFile,
  };
};
