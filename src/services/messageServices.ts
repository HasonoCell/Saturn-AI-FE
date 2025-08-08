import { useMessageStore } from "../stores";
import { messageAPI } from "../apis/message";
import type { MessageType } from "../types";
import { message as Message } from "antd";

export const messageService = {
  async sendMessages(messages: MessageType[]) {
    try {
      const response = await messageAPI.sendMessages(messages);

      if (response.code === 200) {
        const aiMessage: MessageType = {
          role: "system",
          content: response.data?.choices?.[0]?.message?.content || "无回复",
        };

        useMessageStore.getState().addMessage(aiMessage);

        Message.success("操作成功！");
        return;
      }
    } catch {
      Message.error("操作失败！");
    }
  },
};
