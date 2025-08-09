import { conversationAPI } from "../apis/conversation";
import { useConversationStore } from "../stores";
import { messageService } from "./messageServices";
import type { CreateConversationRequest } from "../types/conversation";
import { message as Message } from "antd";

export const conversationService = {
  // 创建新对话
  async createConv(params: CreateConversationRequest) {
    try {
      useConversationStore.getState().setLoading(true);
      const response = await conversationAPI.createConversation(params);

      if (response.code === 200) {
        const { conversation } = response.data;
        useConversationStore.getState().addConv(conversation);
        Message.success("对话创建成功");
        return conversation;
      } else {
        Message.error(response.message || "创建对话失败");
        return null;
      }
    } catch {
      Message.error("创建对话失败");
      return null;
    } finally {
      useConversationStore.getState().setLoading(false);
    }
  },

  // 获取所有对话
  async getAllConvs() {
    try {
      useConversationStore.getState().setLoading(true);
      const response = await conversationAPI.getAllConversations();

      if (response.code === 200) {
        const { conversations } = response.data;
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

  // 获取对话详情
  async getSingleConvById(conversationId: string) {
    try {
      useConversationStore.getState().setLoading(true);
      const response = await conversationAPI.getConversationById(
        conversationId
      );

      if (response.code === 200) {
        const { conversation } = response.data;
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

  // 删除对话
  async deleteConv(conversationId: string) {
    try {
      const response = await conversationAPI.deleteConversation(conversationId);

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

  // 切换到指定对话（统一的对话切换方法）
  async switchToConv(conversationId: string) {
    try {
      useConversationStore.getState().setLoading(true);

      // 并行获取对话详情和消息
      const [conversation, messages] = await Promise.all([
        this.getSingleConvById(conversationId),
        messageService.switchConversationMessages(conversationId),
      ]);

      if (conversation) {
        return { conversation, messages };
      }
      return null;
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
