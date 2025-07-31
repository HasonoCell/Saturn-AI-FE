import { useUserStore } from "../stores";
import { authAPI } from "../apis/user";
import type { LoginParams, RegisterParams } from "../types/user";

const resetError = () => {
  useUserStore.getState().setError(null);
};

export const userService = {
  async login(params: LoginParams) {
    try {
      resetError();

      const response = await authAPI.login(params);

      if (response.code === 1) {
        useUserStore.setState({
          isAuthenticated: true,
          token: response.data.token,
          error: null,
          user: { nickname: response.data.nickname },
        });
        return;
      }

      throw new Error(response.message || "账号或密码出错，登录失败");
    } catch (error) {
      useUserStore.setState({
        error: error instanceof Error ? error.message : "网络出错，登录失败",
      });
      throw error;
    }
  },

  async register(params: RegisterParams) {
    try {
      resetError();

      const response = await authAPI.register(params);

      // ! 如果注册成功，自动登录
      if (response.code === 1) {
        await this.login({
          username: params.username,
          password: params.password,
        });
        return;
      }

      throw new Error(response.message || "账号或密码出错，注册失败");
    } catch (error) {
      useUserStore.setState({
        error: error instanceof Error ? error.message : "网络出错，注册失败",
      });
      throw error;
    }
  },

  logout() {
    useUserStore.setState({
      isAuthenticated: false,
      user: null,
      token: null,
      error: null,
    });
  },
};
