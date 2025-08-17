import { request, type ResponseData } from "../utils/request";
import type {
  SendUserMessageRequest,
  MessageType,
  FirstMessageRequest,
  FirstMessageResponse,
} from "../types/message";
import { useUserStore } from "../stores";

export const messageAPI = {
  /**
   * 发送用户消息
   */
  sendUserMessage: (
    params: SendUserMessageRequest
  ): Promise<ResponseData<null>> => {
    return request<null, SendUserMessageRequest>(
      `conversations/${params.conversationId}/messages`,
      "POST",
      params
    );
  },

  /**
   * 自动创建对话并发送第一条消息（组合API）
   */
  // 这里不复用上面的 sendUserMessage 是因为还拿不到 conversationId
  autoCreateAndSendFirstMessage: (
    params: FirstMessageRequest
  ): Promise<ResponseData<FirstMessageResponse>> => {
    return request<FirstMessageResponse, FirstMessageRequest>(
      "conversations/auto-create-and-send",
      "POST",
      params
    );
  },

  /**
   * 创建SSE连接，流式获取AI回复
   */
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
  getMessages: (
    conversationId: string
  ): Promise<ResponseData<MessageType[]>> => {
    return request<MessageType[], undefined>(
      `conversations/${conversationId}/messages`,
      "GET"
    );
  },
};
