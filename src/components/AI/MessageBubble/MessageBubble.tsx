import { Bubble } from "@ant-design/x";
import { Typography } from "antd";
import { useRef } from "react";
import { DesktopOutlined, UserOutlined } from "@ant-design/icons";
import { useMessageStore } from "../../../stores";
import type { BubbleListRef, BubbleListRoles, MarkdownRender } from "./types";
import markdown_it from "markdown-it";
import "./index.css";

const md = markdown_it({ html: true, breaks: true });

const markdownRender: MarkdownRender = (content) => {
  return (
    <Typography>
      <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
    </Typography>
  );
};

const roles: BubbleListRoles = {
  ai: {
    placement: "start",
    avatar: {
      icon: <DesktopOutlined />,
      style: { background: "#fde3cf" },
    },
    style: { maxWidth: 700 },
    typing: { step: 5, interval: 20 },
    messageRender: markdownRender,
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
