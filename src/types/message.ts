export type MessageRole = "user" | "system";

// 单条消息的数据类型，比如你向AI发送出一条消息"你好"
export interface MessageType {
  role: MessageRole;
  content: string;
}

// 发送消息的请求体类型
export interface SendMessagesRequest {
  messages: MessageType[];
}

// OpenAI API 响应的消息格式
export interface AIResponseMessage {
  role: string;
  content: string;
}

// OpenAI API 响应的选择项格式
export interface AIResponseChoice {
  message: AIResponseMessage;
  finish_reason?: string;
  index: number;
}

// OpenAI API 完整响应格式
export interface AIResponse {
  choices: AIResponseChoice[];
  created: number;
  id: string;
  model: string;
  object: string;
}
