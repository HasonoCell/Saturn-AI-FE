import { Sender } from "@ant-design/x";
import { useState } from "react";
import { messageService } from "../../../services";
import { useMessageStore, useConversationStore } from "../../../stores";
import { message as Message } from "antd";

const MessageSender = () => {
  const [value, setValue] = useState("");
  const { sending, addMessage, messages, setMessages } = useMessageStore();
  const { currentConv: currentConversation } = useConversationStore();

  const handleChange = (v: string) => {
    setValue(v);
  };

  const handleSubmit = async () => {
    if (!value.trim()) {
      Message.warning("请输入消息内容");
      return;
    }

    const content = value;
    const tempId = `temp-${Date.now()}`;

    try {
      // 清空输入框
      setValue("");

      const userMessage = {
        id: tempId,
        content,
        role: "user" as const,
        conversationId: currentConversation!.id,
        createdAt: new Date(),
      };

      addMessage(userMessage);

      // 发送消息到后端
      await messageService.sendMessage(currentConversation!.id, content);
    } catch {
      // 发送失败时移除没有发送出去的消息
      const filteredMessages = messages.filter((msg) => msg.id !== tempId);
      setMessages(filteredMessages);

      // 恢复输入框内容
      setValue(content);
    }
  };

  return (
    <div className="w-2/3">
      <Sender
        loading={sending}
        value={value}
        onChange={(v) => handleChange(v)}
        onSubmit={handleSubmit}
        placeholder={currentConversation ? "输入消息..." : "请先选择对话"}
        disabled={!currentConversation}
      />
    </div>
  );
};

export default MessageSender;
