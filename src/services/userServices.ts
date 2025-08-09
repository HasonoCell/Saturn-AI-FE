import { useUserStore } from "../stores";
import { authAPI } from "../apis/user";
import { conversationService } from "./conversationServices";
import type { LoginParams, RegisterParams } from "../types/user";
import { getErrorMessage, createEnhancedError } from "../utils/errorHandler";
import { message as Message } from "antd";

const resetError = () => {
  useUserStore.getState().setError(null);
};

export const userService = {
  async login(params: LoginParams) {
    try {
      resetError();

      const response = await authAPI.login(params);

      if (response.code === 200) {
        useUserStore.setState({
          isAuthenticated: true,
          token: response.data.token,
          error: null,
          user: null,
        });
        Message.success("登录成功!");
        return;
      }

      throw new Error(response.message || "账号或密码出错，登录失败");
    } catch (error) {
      const errorMessage = getErrorMessage(error, "login");

      useUserStore.setState({
        error: errorMessage,
      });

      throw createEnhancedError(error, "login");
    }
  },

  async register(params: RegisterParams) {
    try {
      resetError();

      const response = await authAPI.register(params);

      if (response.code === 200) {
        useUserStore.setState({
          isAuthenticated: true,
          token: response.data.token,
          error: null,
          user: null,
        });
        Message.success("注册成功!");
        return;
      }

      throw new Error(response.message || "账号或密码出错，注册失败");
    } catch (error) {
      const errorMessage = getErrorMessage(error, "register");

      useUserStore.setState({
        error: errorMessage,
      });

      throw createEnhancedError(error, "register");
    }
  },

  logout() {
    useUserStore.setState({
      isAuthenticated: false,
      user: null,
      token: null,
      error: null,
    });
    // 清空对话和消息数据
    conversationService.clearAll();
  },
};
