import { Sender } from "@ant-design/x";
import { useState } from "react";
import { messageService } from "../../../services";
import { useMessageStore } from "../../../stores";
import type { MessageType } from "../../../types";

const MessageSender = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { messages, addMessage } = useMessageStore();

  const handleChange = (v: string) => {
    setValue(v);
  };

  const handleSubmit = async () => {
    if (!value.trim()) return;
    setLoading(true);

    try {
      const userMessage: MessageType = {
        role: "user",
        content: value,
      };

      addMessage(userMessage);

      // 创建包含新用户消息的完整消息数组
      const updatedMessages = [...messages, userMessage];
      
      // 清空输入框
      setValue("");

      await messageService.sendMessages(updatedMessages);
    } catch {
      throw new Error("操作失败！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sender
      loading={loading}
      value={value}
      onChange={(v) => handleChange(v)}
      onSubmit={handleSubmit}
    />
  );
};

export default MessageSender;
