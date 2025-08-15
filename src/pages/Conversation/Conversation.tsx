import { useEffect } from "react";
import { useParams, Navigate } from "react-router";
import { MessageBubble, MessageSender } from "../../components";
import { conversationService } from "../../services";

const Conversation = () => {
  // 拿到 URL 中的对话ID
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      // 切换到指定对话
      conversationService.switchToConv(id);
    }
  }, [id]);

  // 如果没有对话ID，重定向到首页
  if (!id) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="px-10 py-4 h-full flex flex-col items-center">
      <MessageBubble />
      <MessageSender />
    </div>
  );
};

export default Conversation;
