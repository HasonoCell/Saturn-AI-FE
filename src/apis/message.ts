import { request, type ResponseData } from "../utils/request";
import type { MessageType, SendMessagesRequest, AIResponse } from "../types";

export const messageAPI = {
  sendMessages: (messages: MessageType[]): Promise<ResponseData<AIResponse>> => {
    return request<AIResponse, SendMessagesRequest>("ai/message", "POST", { messages });
  },
};
