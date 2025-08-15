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

  updateMessage: (id, updater) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? updater(msg) : msg
      ),
    })),

  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id),
    })),

  setSending: (sending) => set({ sending }),

  clearMessages: () => set({ messages: [] }),
}));
