import type { ConversationType } from "../../types/conversation";

export interface ConversationStoreProps {
  // 对话列表
  convs: ConversationType[];
  // 当前选中的对话（仅基本信息）
  currentConv: ConversationType | null;
  // 加载状态
  loading: boolean;

  // 设置对话列表
  setConvs: (conversations: ConversationType[]) => void;
  // 添加新对话
  addConv: (conversation: ConversationType) => void;
  // 设置当前对话
  setCurrentConv: (conversation: ConversationType | null) => void;
  // 删除对话
  removeConv: (conversationId: string) => void;
  // 设置加载状态
  setLoading: (loading: boolean) => void;
  // 清空所有数据
  clearAll: () => void;
}
