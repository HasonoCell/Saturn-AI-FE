import type { MessageType } from "../../types";

export interface MessageStoreProps {
  messages: MessageType[];
  sending: boolean;

  setMessages: (messages: MessageType[]) => void;
  addMessage: (message: MessageType) => void;
  updateMessage: (id: string, updater: (prev: MessageType) => MessageType) => void;
  removeMessage: (id: string) => void;
  setSending: (sending: boolean) => void;
  clearMessages: () => void;
}
