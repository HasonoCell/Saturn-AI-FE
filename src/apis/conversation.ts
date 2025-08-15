import { request, type ResponseData } from "../utils/request";
import type { ConversationType } from "../types/conversation";

export const conversationAPI = {
  /**
   * 获取用户所有对话
   */
  getAllConvs: (): Promise<ResponseData<ConversationType[]>> => {
    return request<ConversationType[], null>("conversations", "GET");
  },

  /**
   * 获取单个对话详情（仅基本信息，不包含消息）
   */
  getSingleConv: (
    conversationId: string
  ): Promise<ResponseData<ConversationType>> => {
    return request<ConversationType, null>(
      `conversations/${conversationId}`,
      "GET"
    );
  },

  /**
   * 删除对话
   */
  deleteConv: (conversationId: string): Promise<ResponseData<null>> => {
    return request<null, null>(`conversations/${conversationId}`, "DELETE");
  },
};
