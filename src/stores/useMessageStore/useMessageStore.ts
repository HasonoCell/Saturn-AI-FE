import { create } from "zustand";
import type { MessageStoreProps } from "./types";

export const useMessageStore = create<MessageStoreProps>((set) => ({
  messages: [],
  sending: false,

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  addMessages: (messages) =>
    set((state) => ({
      messages: [...state.messages, ...messages],
    })),

  setSending: (sending) => set({ sending }),

  clearMessages: () => set({ messages: [] }),
}));
