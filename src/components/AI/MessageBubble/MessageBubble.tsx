import { Bubble } from "@ant-design/x";
import { useRef } from "react";
import { DesktopOutlined, UserOutlined } from "@ant-design/icons";
import { useMessageStore } from "../../../stores";
import type { BubbleListRef, BubbleListRoles } from "./types";
import "./index.css";

const roles: BubbleListRoles = {
  ai: {
    placement: "start",
    avatar: {
      icon: <DesktopOutlined />,
      style: { background: "#fde3cf" },
    },
    style: { maxWidth: 700 },
    typing: { step: 5, interval: 20 },
  },
  user: {
    placement: "end",
    avatar: {
      icon: <UserOutlined />,
      style: { background: "#87d068" },
    },
  },
};

const MessageBubble = () => {
  const { messages } = useMessageStore();
  const bubbleRef = useRef<BubbleListRef>(null);

  return (
    <Bubble.List
      ref={bubbleRef}
      roles={roles}
      items={messages}
      className="message-bubble-list"
    />
  );
};

export default MessageBubble;
