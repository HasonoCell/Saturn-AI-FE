import { Sender } from "@ant-design/x";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { messageService } from "../../../services";
import { useMessageStore, useConversationStore } from "../../../stores";
import { message as Message } from "antd";
import type { MessageSenderProps } from "./types";
import type { ConversationType, MessageType } from "../../../types";

const MessageSender: React.FC<MessageSenderProps> = ({ isNewConv = false }) => {
  const [value, setValue] = useState("");
  const eventSourceRef = useRef<EventSource | null>(null);
  const navigate = useNavigate();

  const { sending, addMessage, updateMessage, removeMessage, setSending } =
    useMessageStore();
  const { currentConv, setCurrentConv, addConv } = useConversationStore();

  const handleChange = (v: string) => {
    setValue(v);
  };

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

  const handleSubmit = async () => {
    if (!value.trim()) {
      Message.warning("请输入消息内容");
      return;
    }

    // 关闭之前的连接
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const userContent = value.trim();
    setValue("");
    setSending(true);

    try {
      if (isNewConv) {
        // 新对话模式
        const result = await messageService.autoCreateAndSendFirstMessage(
          userContent
        );

        if (result) {
          const { conversationId, title, aiResponse } = result;

          // 添加到对话列表并设置为当前对话
          const newConv = createConv(conversationId, title);
          addConv(newConv);
          setCurrentConv(newConv);

          // 添加用户消息到UI
          const userMessage = createMessage(conversationId, userContent);
          addMessage(userMessage);

          // 添加AI回复到UI
          const aiMessage = createMessage(conversationId, aiResponse, false);
          addMessage(aiMessage);

          // 跳转到对话页面
          navigate(`/conversation/${result.conversationId}`);
        }
      } else {
        // 已有对话模式
        if (!currentConv) {
          Message.error("请先选择对话");
          return;
        }

        // 添加用户消息到UI
        const userMessage = createMessage(currentConv.id, userContent);
        addMessage(userMessage);

        // 添加AI回复到UI
        const aiMessage = createMessage(currentConv.id, "", false);
        addMessage(aiMessage);

        // 开始流式处理
        const eventSource = await messageService.createSSEWithUserMessage(
          currentConv.id,
          userContent,
          (chunk) => {
            // 更新AI消息内容
            updateMessage(aiMessage.id, (prev) => ({
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
            removeMessage(aiMessage.id);
            setValue(userContent);
            setSending(false);
          }
        );

        eventSourceRef.current = eventSource;
      }
    } catch {
      Message.error("发送消息失败");
      setValue(userContent);
    } finally {
      if (isNewConv) {
        setSending(false);
      }
    }
  };

  return (
    <div className={isNewConv ? "w-full" : "w-2/3"}>
      <Sender
        loading={sending}
        value={value}
        onChange={(v) => handleChange(v)}
        onSubmit={handleSubmit}
        placeholder={isNewConv ? "输入消息开始新对话..." : "输入消息..."}
        disabled={!isNewConv && !currentConv}
      />
    </div>
  );
};

export default MessageSender;
