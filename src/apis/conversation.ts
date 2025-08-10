import { request, type ResponseData } from "../utils/request";
import type {
  ConversationType,
  CreateConversationRequest,
} from "../types/conversation";

export const conversationAPI = {
  // 创建新对话
  createConversation: (
    params: CreateConversationRequest
  ): Promise<ResponseData<ConversationType>> => {
    return request<ConversationType, CreateConversationRequest>(
      "conversations",
      "POST",
      params
    );
  },

  // 获取用户所有对话
  getAllConversations: (): Promise<ResponseData<ConversationType[]>> => {
    return request<ConversationType[], null>("conversations", "GET");
  },

  // 获取单个对话详情（仅基本信息，不包含消息）
  getConversationById: (
    conversationId: string
  ): Promise<ResponseData<ConversationType>> => {
    return request<ConversationType, null>(
      `conversations/${conversationId}`,
      "GET"
    );
  },

  // 删除对话
  deleteConversation: (conversationId: string): Promise<ResponseData<null>> => {
    return request<null, null>(`conversations/${conversationId}`, "DELETE");
  },
};
