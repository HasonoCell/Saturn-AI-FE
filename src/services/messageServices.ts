import { messageAPI } from "../apis/message";
import { useMessageStore } from "../stores";
import type { SendMessageRequest } from "../types/message";
import { message as Message } from "antd";

export const messageService = {
  // 发送消息并获取AI回复
  async sendMessage(conversationId: string, content: string) {
    try {
      const messageStore = useMessageStore.getState();
      messageStore.setSending(true);

      const params: SendMessageRequest = { content };
      const response = await messageAPI.sendMessage(conversationId, params);

      if (response.code === 200) {
        const { userMessage, aiMessage } = response.data;

        // 添加用户消息和AI回复
        messageStore.addMessages([userMessage, aiMessage]);

        return { userMessage, aiMessage };
      } else {
        Message.error(response.message || "发送消息失败");
        return null;
      }
    } catch {
      Message.error("发送消息失败");
      return null;
    } finally {
      useMessageStore.getState().setSending(false);
    }
  },

  // 获取对话中的所有消息
  async getMessagesByConversationId(conversationId: string) {
    try {
      const response = await messageAPI.getMessagesByConversationId(
        conversationId
      );

      if (response.code === 200) {
        const { messages } = response.data;
        useMessageStore.getState().setMessages(messages);
        return messages;
      } else {
        Message.error(response.message || "获取消息失败");
        return [];
      }
    } catch {
      Message.error("获取消息失败");
      return [];
    }
  },

  // 切换对话时加载对应的消息
  async switchConversationMessages(conversationId: string) {
    try {
      // 先清空当前消息
      this.clearMessages();
      // 加载新对话的消息
      const messages = await this.getMessagesByConversationId(conversationId);
      return messages;
    } catch {
      return [];
    }
  },

  // 清空消息
  clearMessages() {
    useMessageStore.getState().clearMessages();
  },
};
