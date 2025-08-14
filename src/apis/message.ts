import { request, type ResponseData } from "../utils/request";
import type { SendUserMessageRequest, MessageType } from "../types/message";
import { useUserStore } from "../stores";

export const messageAPI = {
  // 只起发送用户消息作用
  sendUserMessage: (
    params: SendUserMessageRequest
  ): Promise<ResponseData<null>> => {
    return request<null, SendUserMessageRequest>(
      `conversations/${params.conversationId}/messages`,
      "POST",
      params
    );
  },

  // 创建SSE连接，流式获取AI回复
  createSSE: (conversationId: string): EventSource => {
    // 获取 token 和 url
    const { token } = useUserStore.getState();
    const url = new URL(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/conversations/${conversationId}/messages/stream`
    );
    if (token) {
      url.searchParams.append("token", token);
    }

    const eventSource = new EventSource(url.toString());
    return eventSource;
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
