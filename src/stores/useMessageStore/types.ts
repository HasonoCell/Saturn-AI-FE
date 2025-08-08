import type { MessageType } from "../../types";

export interface MessageStoreProps {
  messages: MessageType[];

  addMessage: (message: MessageType) => void;
}
