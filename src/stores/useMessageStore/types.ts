import type { MessageType } from "../../types";

export interface MessageStoreProps {
  // 当前对话的消息列表
  messages: MessageType[];
  // 发送消息加载状态
  sending: boolean;

  // 设置消息列表（切换对话时使用）
  setMessages: (messages: MessageType[]) => void;
  // 添加单条消息
  addMessage: (message: MessageType) => void;
  // 添加多条消息（AI回复时一次添加用户消息和AI消息）
  addMessages: (messages: MessageType[]) => void;
  // 设置发送状态
  setSending: (sending: boolean) => void;
  // 清空消息
  clearMessages: () => void;
}
