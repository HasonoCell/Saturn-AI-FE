import { useState, useEffect } from "react";
import {
  List,
  Button,
  Modal,
  Input,
  message as Message,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  MessageOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useConversationStore } from "../../../stores";
import { conversationService } from "../../../services";
import type { ConversationType } from "../../../types/conversation";

const ConversationSidebar = () => {
  const { convs: conversations, currentConv: currentConversation, loading } =
    useConversationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [convTitle, setConvTitle] = useState("");

  // 组件挂载时加载对话列表
  useEffect(() => {
    conversationService.getAllConvs();
  }, []);

  const handleCreateConversation = async () => {
    if (!convTitle.trim()) {
      Message.warning("请输入对话标题");
      return;
    }

    const conversation = await conversationService.createConv({
      title: convTitle.trim(),
    });

    if (conversation) {
      setIsModalOpen(false);
      setConvTitle("");
      // 自动切换到新创建的对话
      await conversationService.switchToConv(conversation.id);
    }
  };

  const handleSelectConversation = async (conversation: ConversationType) => {
    if (currentConversation?.id === conversation.id) return;
    await conversationService.switchToConv(conversation.id);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    await conversationService.deleteConv(conversationId);
  };

  return (
    <div className="h-full flex flex-col max-h-screen overflow-hidden">
      {/* 创建新对话按钮 */}
      <div className="p-4 border-b flex-shrink-0">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="w-full"
        >
          新建对话
        </Button>
      </div>

      {/* 对话列表 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <List
          loading={loading}
          dataSource={conversations}
          renderItem={(conversation) => (
            <List.Item
              className={`cursor-pointer hover:bg-gray-100 px-4 py-2 ${
                currentConversation?.id === conversation.id ? "bg-blue-50" : ""
              }`}
              onClick={() => handleSelectConversation(conversation)}
              actions={[
                <Popconfirm
                  key="delete"
                  title="确认删除"
                  description="确定要删除这个对话吗？"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    handleDeleteConversation(conversation.id);
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
                title={conversation.title}
                description={
                  conversation.description ||
                  new Date(conversation.createdAt).toLocaleDateString()
                }
              />
            </List.Item>
          )}
        />
      </div>

      {/* 创建对话模态框 */}
      <Modal
        title="创建新对话"
        open={isModalOpen}
        onOk={handleCreateConversation}
        onCancel={() => {
          setIsModalOpen(false);
          setConvTitle("");
        }}
        okText="创建"
        cancelText="取消"
      >
        <Input
          placeholder="请输入对话标题"
          value={convTitle}
          onChange={(e) => setConvTitle(e.target.value)}
          onPressEnter={handleCreateConversation}
          maxLength={50}
        />
      </Modal>
    </div>
  );
};

export default ConversationSidebar;
