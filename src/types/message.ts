/**
 * OpenAI SDK 中
 * user：表示用户输入，通常是人类提问或发起对话的内容。
 * assistant：表示 AI 助手的回复内容。
 * system：用于设定对话的系统指令或背景，比如“你是一个有礼貌的助手”。
 * function：用于函数调用相关场景，表示 AI 触发了某个函数（如插件、工具调用），内容通常为函数调用的参数或结果。
 */

export type MessageRole = "user" | "assistant" | "system" | "function";

// 单条消息的数据类型
export interface MessageType {
  id: string;
  content: string;
  role: MessageRole;
  conversationId: string;
  createdAt: Date;
}

// 发送用户消息的请求体类型
export interface SendUserMessageRequest {
  conversationId: string;
  content: string;
}

export interface SendUserMessageResponse {
  success: boolean;
}

// 自动创建对话并发送第一条消息的请求体类型
export interface FirstMessageRequest {
  content: string;
}

// 自动创建对话并发送第一条消息的返回类型
export interface FirstMessageResponse {
  conversationId: string;
  title: string;
}
