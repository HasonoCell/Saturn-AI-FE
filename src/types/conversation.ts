// 对话基础信息
export interface ConversationType {
  id: string;
  title: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// 创建对话的请求参数
export interface CreateConversationRequest {
  title: string;
  description?: string;
}
