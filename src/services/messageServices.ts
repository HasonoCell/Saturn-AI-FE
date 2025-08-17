import { messageAPI } from "../apis/message";
import { useMessageStore } from "../stores";
import type {
  SendUserMessageRequest,
  FirstMessageRequest,
  FirstMessageResponse,
  SendUserMessageResponse,
} from "../types/message";
import type { ResponseData } from "../utils/request";
import { message as Message } from "antd";

export const messageService = {
  /**
   * 已存在对话的情况下发送用户消息
   */
  async sendUserMessage(
    conversationId: string,
    content: string
  ): Promise<SendUserMessageResponse | null> {
    try {
      const params: SendUserMessageRequest = {
        conversationId,
        content,
      };
      const response = await messageAPI.sendUserMessage(params);

      if (response.code === 200) {
        return { success: true };
      } else {
        return { success: false };
      }
    } catch {
      return null;
    }
  },

  /**
   * 自动创建对话并发送第一条消息
   */
  async autoCreateAndSendFirstMessage(
    content: string
  ): Promise<FirstMessageResponse | null> {
    try {
      const params: FirstMessageRequest = {
        content,
      };

      const response = await messageAPI.autoCreateAndSendFirstMessage(params);

      if (response.code === 200) {
        return response.data;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  },

  /**
   * 建立SSE连接获取AI流式回复
   */
  async createSSE(
    conversationId: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<EventSource | null> {
    try {
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

      // 添加错误处理
      eventSource.onerror = (error) => {
        console.error("SSE连接错误:", error);
        onError("连接错误");
        eventSource.close();
      };

      return eventSource;
    } catch {
      onError("创建连接失败");
      useMessageStore.getState().setSending(false);
      return null;
    }
  },

  /**
   * 获取对话中的所有消息
   */
  async getMessages(conversationId: string) {
    try {
      const response = await messageAPI.getMessages(conversationId);

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

  /**
   * 切换对话时加载对应的消息
   */
  async switchConvMessages(conversationId: string) {
    try {
      // 检查当前消息是否已经属于目标对话
      const currentMessages = useMessageStore.getState().messages;
      const isCurrentConv =
        currentMessages.length > 0 &&
        currentMessages[0].conversationId === conversationId;

      // 如果不是当前对话的消息，才清空并重新加载
      if (!isCurrentConv) {
        this.clearMessages();
        const messages = await this.getMessages(conversationId);
        return messages;
      }

      // 如果已经是当前对话的消息，直接返回
      return currentMessages;
    } catch {
      return [];
    }
  },

  /**
   * 清空消息
   */
  clearMessages() {
    useMessageStore.getState().clearMessages();
  },
};
