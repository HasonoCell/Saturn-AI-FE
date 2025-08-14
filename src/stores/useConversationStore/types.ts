import type { ConversationType } from "../../types/conversation";

export interface ConversationStoreProps {
  convs: ConversationType[];
  currentConv: ConversationType | null;
  loading: boolean;

  setConvs: (conversations: ConversationType[]) => void;
  addConv: (conversation: ConversationType) => void;
  setCurrentConv: (conversation: ConversationType | null) => void;
  removeConv: (conversationId: string) => void;
  setLoading: (loading: boolean) => void;
  clearAll: () => void;
}
