import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  SearchOutlined,
  UserOutlined,
  RobotOutlined,
  MessageOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { messageService } from "../../../services";
import VirtualList from "../VirtualList/VirtualList";
import type { SearchMessageItem } from "../../../types/message";
import type { MessageSearcherProps } from "./types";
import "./MessageSearcher.css";

const MessageSearcher: React.FC<MessageSearcherProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchMessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // 展示浮层的初始化操作
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // 点击消息跳转
  const handleSelectMessage = useCallback(
    (message: SearchMessageItem) => {
      navigate(`/conversation/${message.conversationId}`);
      onClose();
    },
    [navigate, onClose]
  );

  // 执行搜索
  // 使用 useCallback 让 handleSearch 不会随着组建的重新渲染而改变，保证防抖的稳定
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const searchResults = await messageService.searchMessage(searchQuery);
      setResults(searchResults || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 搜索防抖
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  // 高亮关键词
  const highlightText = useCallback((text: string, keyword: string) => {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <mark
            key={index}
            className="bg-yellow-200 text-yellow-900 rounded px-1"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  }, []);

  // 格式化时间
  const formatTime = useCallback((date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return messageDate.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "昨天";
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return messageDate.toLocaleDateString("zh-CN");
    }
  }, []);

  // 渲染单个搜索结果项
  const renderSearchItem = useCallback(
    (message: SearchMessageItem, index: number) => {
      const isLast = index === results.length - 1;
      return (
        <div
          className={`px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 h-24 flex flex-col justify-center ${
            isLast ? "" : "border-b-2 border-gray-50"
          }`}
          onClick={() => handleSelectMessage(message)}
        >
          {/* 每一条消息的标题部分 */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900 text-sm truncate max-w-xs">
                {message.conversationTitle}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  message.role === "user"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {message.role === "user" ? (
                  <>
                    <UserOutlined className="mr-1" />
                    <span>用户</span>
                  </>
                ) : (
                  <>
                    <RobotOutlined className="mr-1" />
                    <span>AI</span>
                  </>
                )}
              </span>
            </div>

            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
              {formatTime(message.createdAt)}
            </span>
          </div>
          {/* 消息主体部分 */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {highlightText(message.content, query)}
          </p>
        </div>
      );
    },
    [handleSelectMessage, formatTime, highlightText, query, results.length]
  );

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 搜索浮层 */}
      <div className="fixed top-[10vh] left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* 搜索输入框 */}
          <div className="flex items-center px-4 py-3 border-b border-gray-100">
            <div className="flex items-center flex-1">
              <SearchOutlined className="text-gray-400 mr-3 text-lg" />
              <input
                ref={inputRef}
                type="text"
                placeholder="搜索消息内容..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 outline-none text-gray-900 placeholder-gray-400 text-lg"
              />
            </div>
            {loading && <LoadingOutlined className="text-blue-500" />}
          </div>

          {/* 搜索结果 */}
          <div className="max-h-96">
            {/* 未找到消息的提示 */}
            {query && results.length === 0 && !loading && (
              <div className="px-4 py-8 text-center text-gray-500">
                <MessageOutlined className="text-gray-300 text-5xl mx-auto mb-3" />
                <p>未找到相关消息</p>
              </div>
            )}

            {/* 虚拟列表 */}
            {results.length > 0 && (
              <VirtualList
                items={results}
                itemHeight={96}
                containerHeight={384} // max-h-96 = 384px
                renderItem={(item: SearchMessageItem, index: number) =>
                  renderSearchItem(item, index)
                }
                className="custom-scrollbar"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageSearcher;
