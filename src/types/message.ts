export type MessageRole = "user" | "ai";

// 单条消息的数据类型，比如你向AI发送出一条消息"你好"
export interface MessageType {
  role: MessageRole;
  content: string;
}
