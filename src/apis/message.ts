/* eslint-disable @typescript-eslint/no-explicit-any */
import { request, type ResponseData } from "../utils/request";
import type { MessageType } from "../types";

export const messageAPI = {
  sendMessages: (messages: MessageType[]): Promise<ResponseData<any>> => {
    return request<any, { messages: MessageType[] }>("ai/message", "POST", { messages });
  },
};
