import { create } from "zustand";
import type { MessageStoreProps } from "./types";

export const useMessageStore = create<MessageStoreProps>((set) => ({
  messages: [
    {
      role: "user",
      content: "你好！你是谁?",
    },
    {
      role: "system",
      content: `你好！很高兴认识你，我是**通义千问**！`,
    },
  ],

  addMessage(message) {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
}));
