import { useEffect } from "react";
import { MessageSender, AILogo } from "../../components";
import { Typography } from "antd";
import { useConversationStore } from "../../stores";

const { Text } = Typography;

const Home = () => {
  const { setCurrentConv } = useConversationStore();

  useEffect(() => {
    setCurrentConv(null);
  }, [setCurrentConv]);

  return (
    <div className="h-full flex flex-col items-center justify-center px-10">
      {/* 欢迎区域 */}
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-center">
          <AILogo larger />
          <h1 className="text-2xl font-bold text-gray-800">
            欢迎使用 Saturn AI
          </h1>
        </div>
        <Text className="text-gray-600 text-lg">
          开始一段全新的对话，我会帮助您解答问题
        </Text>
      </div>

      {/* 消息发送区域 */}
      <div className="w-full max-w-3xl">
        <MessageSender isNewConv={true} />
      </div>
    </div>
  );
};

export default Home;
