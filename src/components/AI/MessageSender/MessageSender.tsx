import { Sender } from "@ant-design/x";
import { useState, useRef } from "react";
import { messageService } from "../../../services";
import { useMessageStore, useConversationStore } from "../../../stores";
import { message as Message } from "antd";

const MessageSender = () => {
  const [value, setValue] = useState("");
  const eventSourceRef = useRef<EventSource | null>(null);
  const { sending, addMessage, updateMessage, removeMessage, setSending } =
    useMessageStore();
  const { currentConv } = useConversationStore();

  const handleChange = (v: string) => {
    setValue(v);
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

    const content = value.trim();
    setValue("");
    setSending(true);

    // 添加用户消息到UI
    const userMessage = {
      id: `user-${Date.now()}`,
      content,
      role: "user" as const,
      conversationId: currentConv!.id,
      createdAt: new Date(),
    };
    addMessage(userMessage);

    // 创建临时AI消息用于流式更新
    const tempAIMessage = {
      id: `ai-${Date.now()}`,
      content: "",
      role: "assistant" as const,
      conversationId: currentConv!.id,
      createdAt: new Date(),
    };
    addMessage(tempAIMessage);

    // 开始流式处理
    const eventSource = await messageService.createSSEWithUserMessage(
      currentConv!.id,
      content,
      (chunk) => {
        // 更新AI消息内容
        updateMessage(tempAIMessage.id, (prev) => ({
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
        removeMessage(tempAIMessage.id);
        setValue(content); // 恢复输入内容
      }
    );

    eventSourceRef.current = eventSource;
  };

  return (
    <div className="w-2/3">
      <Sender
        loading={sending}
        value={value}
        onChange={(v) => handleChange(v)}
        onSubmit={handleSubmit}
        placeholder={currentConv ? "输入消息..." : "请先选择对话"}
        disabled={!currentConv}
      />
    </div>
  );
};

export default MessageSender;
