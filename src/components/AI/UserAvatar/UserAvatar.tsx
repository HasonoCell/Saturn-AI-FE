import {
  UserOutlined,
  AndroidOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Dropdown, Avatar, Modal, message as Message } from "antd";
import type { MenuProps } from "antd";
import { useUserStore } from "../../../stores";
import { useState } from "react";
import { userService } from "../../../services";

const UserAvatar = () => {
  const { user } = useUserStore();
  const [isModelOpen, setIsModelOpen] = useState(false);

  const handleLogout = () => {
    setIsModelOpen(true);
  };

  const handleModelOk = () => {
    setIsModelOpen(false);
    Message.success("退出成功!");
    userService.logout();
  };

  const handleModelCancel = () => {
    setIsModelOpen(false);
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "个人中心",
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: "通用设置",
      icon: <SettingOutlined />,
    },
    {
      key: "logout",
      label: "退出登录",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="absolute top-0 right-0 py-2 px-4">
      <Dropdown menu={{ items: menuItems }} arrow>
        <Avatar
          src={user?.avatar}
          icon={!user?.avatar ? <AndroidOutlined /> : null}
          className="bg-white text-black"
          size="large"
        />
      </Dropdown>

      <Modal
        open={isModelOpen}
        title="温馨提示"
        onOk={handleModelOk}
        onCancel={handleModelCancel}
        okText="确定"
        cancelText="取消"
      >
        <p>你确定要退出登录?</p>
      </Modal>
    </div>
  );
};

export default UserAvatar;
