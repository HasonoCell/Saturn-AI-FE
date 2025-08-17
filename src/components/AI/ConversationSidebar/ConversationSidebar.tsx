import { useEffect, useState } from "react";
import { List, Button, Popconfirm } from "antd";
import {
  PlusOutlined,
  MessageOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useConversationStore } from "../../../stores";
import { conversationService, messageService } from "../../../services";
import type { ConversationType } from "../../../types/conversation";
import MessageSearcher from "../MessageSearcher/MessageSearcher";

const ConversationSidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { convs, currentConv, loading } = useConversationStore();
  const navigate = useNavigate();

  // 组件挂载时加载对话列表
  useEffect(() => {
    conversationService.getAllConvs();
  }, []);

  const handleNewConv = () => {
    // 清除当前消息状态
    messageService.clearMessages();
    navigate("/home");
  };

  const handleSelectConv = async (conv: ConversationType) => {
    if (currentConv?.id === conv.id) return;
    navigate(`/conversation/${conv.id}`);
  };

  const handleDeleteConv = async (conversationId: string) => {
    const success = await conversationService.deleteConv(conversationId);

    // 如果删除成功且删除的是当前对话
    if (success && currentConv?.id === conversationId) {
      messageService.clearMessages();
      navigate("/home");
    }
  };

  const handleSearchMessages = async () => {
    setIsOpen(true);
  };

  const handleCloseSearch = () => {
    setIsOpen(false);
  };

  return (
    <div className="h-full flex flex-col max-h-screen overflow-hidden">
      {/* 创建新对话按钮 */}
      <div className="p-4 flex-shrink-0">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleNewConv}
          className="w-full"
        >
          <span>新建对话</span>
        </Button>
      </div>

      {/* 搜索对话按钮 */}
      <div className="p-4 border-b flex-shrink-0">
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearchMessages}
          className="w-full"
        >
          <span>搜索对话</span>
        </Button>
      </div>

      {/* 搜索对话组件 */}
      <MessageSearcher isOpen={isOpen} onClose={handleCloseSearch} />

      {/* 对话列表 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <List
          loading={loading}
          dataSource={convs}
          renderItem={(conv) => (
            <List.Item
              className={`cursor-pointer hover:bg-gray-100 px-4 py-2 ${
                currentConv?.id === conv.id ? "bg-blue-50" : ""
              }`}
              onClick={() => handleSelectConv(conv)}
              actions={[
                <Popconfirm
                  key="delete"
                  title="确认删除"
                  description="确定要删除这个对话吗？"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    handleDeleteConv(conv.id);
                  }}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    className="text-red-500 hover:text-red-700"
                  />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={<MessageOutlined />}
                title={conv.title}
                description={
                  conv.description ||
                  new Date(conv.createdAt).toLocaleDateString()
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ConversationSidebar;
