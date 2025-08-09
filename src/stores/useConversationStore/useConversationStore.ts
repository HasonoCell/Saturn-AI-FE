import { create } from "zustand";
import type { ConversationStoreProps } from "./types";
import type { ConversationType } from "../../types";

const ensureIsArray = (conversations: ConversationType[]) => {
  return Array.isArray(conversations) ? conversations : [];
};

export const useConversationStore = create<ConversationStoreProps>((set) => ({
  conversations: [],
  currentConversation: null,
  loading: false,

  setConvs: (conversations) =>
    set({
      conversations: ensureIsArray(conversations),
    }),

  addConv: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...ensureIsArray(state.conversations)],
    })),

  setCurrentConv: (currentConversation) => set({ currentConversation }),

  removeConv: (conversationId) =>
    set((state) => ({
      conversations: ensureIsArray(state.conversations).filter(
        (conv) => conv.id !== conversationId
      ),
      currentConversation:
        state.currentConversation?.id === conversationId
          ? null
          : state.currentConversation,
    })),

  setLoading: (loading) => set({ loading }),

  clearAll: () =>
    set({
      conversations: [],
      currentConversation: null,
      loading: false,
    }),
}));
