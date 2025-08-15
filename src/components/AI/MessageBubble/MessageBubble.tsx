import { Bubble } from "@ant-design/x";
import { Typography } from "antd";
import { useRef } from "react";
import { DesktopOutlined, UserOutlined } from "@ant-design/icons";
import { useMessageStore } from "../../../stores";
import type {
  BubbleListRef,
  BubbleListRoles,
  MarkdownRender,
  BubbleItems,
} from "./types";
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
  assistant: {
    placement: "start",
    avatar: {
      icon: <DesktopOutlined />,
      style: { background: "white", color: "black" },
    },
    style: { maxWidth: 750 },
    messageRender: markdownRender,
  },
  user: {
    placement: "end",
    avatar: {
      icon: <UserOutlined />,
      style: { background: "white", color: "black" },
    },
  },
};

const MessageBubble = () => {
  const { messages } = useMessageStore();
  const bubbleRef = useRef<BubbleListRef>(null);

  // 过滤掉不需要的属性，只保留Bubble.List需要的属性
  const bubbleItems: BubbleItems = messages.map((msg) => ({
    key: msg.id,
    content: msg.content,
    role: msg.role,
  }));

  return (
    <Bubble.List
      ref={bubbleRef}
      roles={roles}
      items={bubbleItems}
      className="message-bubble-list"
    />
  );
};

export default MessageBubble;
