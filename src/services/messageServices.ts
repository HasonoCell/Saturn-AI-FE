import { messageAPI } from "../apis/message";
import { useMessageStore } from "../stores";
import type { SendUserMessageRequest } from "../types/message";
import type { ResponseData } from "../utils/request";
import { message as Message } from "antd";

export const messageService = {
  // 建立SSE连接前先发送用户消息
  async sendUserMessage(conversationId: string, content: string) {
    try {
      const params: SendUserMessageRequest = {
        conversationId,
        content,
      };
      const response = await messageAPI.sendUserMessage(params);

      if (response.code === 200) {
        return { success: true, message: "发送消息成功" };
      } else {
        Message.error(response.message || "发送消息失败");
        return { success: false, message: response.message || "发送消息失败" };
      }
    } catch (error) {
      console.error("Frontend - Error sending user message:", error);
      Message.error("网络错误，发送消息失败");
      return { success: false, message: "网络错误" };
    }
  },

  // 处理完整的流式消息发送流程
  async createSSEWithUserMessage(
    conversationId: string,
    content: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<EventSource | null> {
    try {
      // 1. 发送用户消息
      const result = await this.sendUserMessage(conversationId, content);
      if (!result.success) {
        onError(result.message);
        return null;
      }

      // 2. 建立SSE连接
      const eventSource = messageAPI.createSSE(conversationId);

      eventSource.onmessage = (event: MessageEvent) => {
        try {
          const response: ResponseData<string> = JSON.parse(event.data);

          if (response.message === "chunk" && response.code === 200) {
            onChunk(response.data);
          } else if (response.message === "end") {
            onComplete();
            eventSource.close();
          }
        } catch {
          onError("解析消息失败");
          eventSource.close();
        }
      };

      return eventSource;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "发送消息失败";
      onError(errorMessage);
      useMessageStore.getState().setSending(false);
      return null;
    }
  },

  // 获取对话中的所有消息
  async getMessagesByConversationId(conversationId: string) {
    try {
      const response = await messageAPI.getMessagesByConversationId(
        conversationId
      );

      if (response.code === 200) {
        const messages = response.data;
        useMessageStore.getState().setMessages(messages);
        return messages;
      } else {
        Message.error(response.message || "获取消息失败");
        return [];
      }
    } catch {
      Message.error("获取消息失败");
      return [];
    }
  },

  // 切换对话时加载对应的消息
  async switchConversationMessages(conversationId: string) {
    try {
      // 先清空当前消息
      this.clearMessages();
      // 加载新对话的消息
      const messages = await this.getMessagesByConversationId(conversationId);
      return messages;
    } catch {
      return [];
    }
  },

  // 清空消息
  clearMessages() {
    useMessageStore.getState().clearMessages();
  },
};
