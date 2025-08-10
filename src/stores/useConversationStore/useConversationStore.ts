import { create } from "zustand";
import type { ConversationStoreProps } from "./types";
import type { ConversationType } from "../../types";

const ensureIsArray = (conversations: ConversationType[]) => {
  return Array.isArray(conversations) ? conversations : [];
};

export const useConversationStore = create<ConversationStoreProps>((set) => ({
  convs: [],
  currentConv: null,
  loading: false,

  setConvs: (convs) =>
    set({
      convs: ensureIsArray(convs),
    }),

  addConv: (conv) =>
    set((state) => ({
      convs: [conv, ...ensureIsArray(state.convs)],
    })),

  setCurrentConv: (currentConv) => set({ currentConv }),

  removeConv: (conversationId) =>
    set((state) => ({
      convs: ensureIsArray(state.convs).filter(
        (conv) => conv.id !== conversationId
      ),
      currentConv:
        state.currentConv?.id === conversationId ? null : state.currentConv,
    })),

  setLoading: (loading) => set({ loading }),

  clearAll: () =>
    set({
      convs: [],
      currentConv: null,
      loading: false,
    }),
}));
