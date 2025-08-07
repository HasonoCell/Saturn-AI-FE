import { useState } from "react";
import { Outlet } from "react-router";
import { UserAvatar, ConversationSidebar, AILogo } from "../index";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const AILayout = () => {
  const [isCollapse, setIsCollapse] = useState(false);

  return (
    <div className="flex bg-white h-screen">
      <div
        className={`${
          isCollapse ? "w-12" : "w-64"
        } flex flex-col bg-gray-50 border-r border-gray-200 transition-all duration-300`}
      >
        <div className="flex justify-between items-center p-2 border-b border-gray-200">
          {!isCollapse && <AILogo />}
          <div className="flex justify-center items-center">
            {isCollapse ? (
              <MenuUnfoldOutlined
                onClick={() => setIsCollapse(false)}
                className="text-gray-600 cursor-pointer"
              />
            ) : (
              <MenuFoldOutlined
                onClick={() => setIsCollapse(true)}
                className="text-gray-600 cursor-pointer"
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
    </div>
  );
};

export default AILayout;
