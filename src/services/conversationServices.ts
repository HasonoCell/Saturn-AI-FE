import { conversationAPI } from "../apis/conversation";
import { useConversationStore } from "../stores";
import { messageService } from "./messageServices";
import { message as Message } from "antd";

export const conversationService = {
  /**
   * 获取所有对话
   */
  async getAllConvs() {
    try {
      useConversationStore.getState().setLoading(true);
      const response = await conversationAPI.getAllConvs();

      if (response.code === 200) {
        const conversations = response.data;
        useConversationStore.getState().setConvs(conversations);
        return conversations;
      } else {
        Message.error(response.message || "获取对话列表失败");
        return [];
      }
    } catch {
      Message.error("获取对话列表失败");
      return [];
    } finally {
      useConversationStore.getState().setLoading(false);
    }
  },

  /**
   * 获取单个对话详情（仅基本信息，不包含消息）
   */
  async getSingleConv(conversationId: string) {
    try {
      useConversationStore.getState().setLoading(true);
      const response = await conversationAPI.getSingleConv(conversationId);

      if (response.code === 200) {
        const conversation = response.data;
        useConversationStore.getState().setCurrentConv(conversation);
        return conversation;
      } else {
        Message.error(response.message || "获取对话详情失败");
        return null;
      }
    } catch {
      Message.error("获取对话详情失败");
      return null;
    } finally {
      useConversationStore.getState().setLoading(false);
    }
  },

  /**
   * 删除对话
   */
  async deleteConv(conversationId: string) {
    try {
      const response = await conversationAPI.deleteConv(conversationId);

      if (response.code === 200) {
        useConversationStore.getState().removeConv(conversationId);
        Message.success("对话删除成功");
        return true;
      } else {
        Message.error(response.message || "删除对话失败");
        return false;
      }
    } catch {
      Message.error("删除对话失败");
      return false;
    }
  },

  /**
   * 切换到指定对话
   */
  async switchToConv(conversationId: string) {
    try {
      useConversationStore.getState().setLoading(true);

      // 分别获取 Conversation 基本信息和 Messages
      await Promise.all([
        // 这里只获取对话的基本信息，不包含对应的消息
        this.getSingleConv(conversationId),
        // 获取 Messages 是通过 MessageService 暴露的 API 去操作的
        messageService.switchConvMessages(conversationId),
      ]);
    } catch {
      Message.error("切换对话失败");
      return null;
    } finally {
      useConversationStore.getState().setLoading(false);
    }
  },

  // 清空所有数据
  clearAll() {
    useConversationStore.getState().clearAll();
    messageService.clearMessages();
  },
};
