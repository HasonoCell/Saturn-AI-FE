import { request, type ResponseData } from "../utils/request";
import type {
  CreateConversationRequest,
  CreateConversationResponse,
  GetAllConversationsResponse,
  GetSingleConversationResponse,
} from "../types/conversation";

export const conversationAPI = {
  // 创建新对话
  createConversation: (
    params: CreateConversationRequest
  ): Promise<ResponseData<CreateConversationResponse>> => {
    return request<CreateConversationResponse, CreateConversationRequest>(
      "conversations",
      "POST",
      params
    );
  },

  // 获取用户所有对话
  getAllConversations: (): Promise<
    ResponseData<GetAllConversationsResponse>
  > => {
    return request<GetAllConversationsResponse, null>("conversations", "GET");
  },

  // 获取单个对话详情（包含消息）
  getConversationById: (
    conversationId: string
  ): Promise<ResponseData<GetSingleConversationResponse>> => {
    return request<GetSingleConversationResponse, null>(
      `conversations/${conversationId}`,
      "GET"
    );
  },

  // 删除对话
  deleteConversation: (conversationId: string): Promise<ResponseData<null>> => {
    return request<null, null>(`conversations/${conversationId}`, "DELETE");
  },
};
