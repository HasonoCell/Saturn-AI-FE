import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router";
import { UserAvatar, ConversationSidebar, AILogo, MessageSearcher } from "../index";
import { MenuFoldOutlined, MenuUnfoldOutlined, SearchOutlined } from "@ant-design/icons";

const AILayout = () => {
  const [isCollapse, setIsCollapse] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  // 键盘快捷键支持 (Ctrl+K 或 Cmd+K)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setSearchVisible(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex bg-white h-screen">
      <div
        className={`${
          isCollapse ? "w-10" : "w-64"
        } flex flex-col bg-gray-50 border-r-2 border-gray-200 transition-all duration-300`}
      >
        <div className="flex justify-between items-center p-2 border-b border-gray-200">
          {!isCollapse && <AILogo />}
          {!isCollapse && <p className="font-bold">Saturn AI</p>}
          <div className="flex items-center gap-2">
            {!isCollapse && (
              <SearchOutlined
                onClick={() => setSearchVisible(true)}
                className="text-gray-600 cursor-pointer hover:text-blue-500 transition-colors p-1 rounded hover:bg-gray-100"
                title="搜索消息 (Ctrl+K)"
              />
            )}
            {isCollapse ? (
              <MenuUnfoldOutlined
                onClick={() => setIsCollapse(false)}
                className="text-gray-600 cursor-pointer p-1 rounded hover:bg-gray-100"
              />
            ) : (
              <MenuFoldOutlined
                onClick={() => setIsCollapse(true)}
                className="text-gray-600 cursor-pointer p-1 rounded hover:bg-gray-100"
              />
            )}
          </div>
        </div>
        {!isCollapse && <ConversationSidebar />}
      </div>

      <div className="flex-1 relative">
        <UserAvatar />
        <Outlet />
      </div>

      {/* 搜索浮层 */}
      <MessageSearcher 
        isOpen={searchVisible} 
        onClose={() => setSearchVisible(false)} 
      />
    </div>
  );
};

export default AILayout;
