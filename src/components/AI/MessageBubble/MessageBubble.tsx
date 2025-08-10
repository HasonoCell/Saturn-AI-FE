import { Bubble } from "@ant-design/x";
import { Typography, Empty } from "antd";
import { useRef } from "react";
import { DesktopOutlined, UserOutlined } from "@ant-design/icons";
import { useMessageStore, useConversationStore } from "../../../stores";
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
  const { currentConv: currentConversation } = useConversationStore();
  const bubbleRef = useRef<BubbleListRef>(null);

  // 如果没有选择对话，显示提示
  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Empty
          description="请选择一个对话开始聊天，或创建新的对话"
          className="text-gray-500"
        />
      </div>
    );
  }

  // 如果有对话但没有消息，显示欢迎信息
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Empty
          description={`开始与AI对话：${currentConversation.title}`}
          className="text-gray-500"
        />
      </div>
    );
  }

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
