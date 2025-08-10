import { request, type ResponseData } from "../utils/request";
import type { SendMessageRequest, MessageType } from "../types/message";

export const messageAPI = {
  // 发送消息并获取AI回复
  sendMessage: (
    params: SendMessageRequest
  ): Promise<ResponseData<MessageType>> => {
    return request<MessageType, SendMessageRequest>(
      `conversations/${params.conversationId}/messages`,
      "POST",
      params
    );
  },

  // 获取对话中的所有消息
  getMessagesByConversationId: (
    conversationId: string
  ): Promise<ResponseData<MessageType[]>> => {
    return request<MessageType[], undefined>(
      `conversations/${conversationId}/messages`,
      "GET"
    );
  },
};
