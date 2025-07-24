import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type Method,
} from "axios";
import { useUserStore } from "../stores";
import { message as Message } from "antd";

interface ResponseData<T> {
  data: T;
  message: string | null;
  code: string | number;
}

const whiteList = ["/users/login", "/users/register"];

const instance = axios.create({
  baseURL: "http://example.com",
  timeout: 30000,
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isWhiteListed = whiteList.some((url) => config.url?.includes(url));
    if (isWhiteListed) return config;

    const { token } = useUserStore.getState();
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message } = response.data;

    if (code === 400 || code === 401 || code === 404) {
      Message.error(message || "登录失败!");
    }

    return response.data;
  },
  (error: AxiosError) => {
    const { status } = error;
    if (status === 401) {
      Message.warning("当前登录状态有误，请重新登录");
      // 需要添加路由跳转回登录页面
    }
    return Promise.reject(error);
  }
);

export const request = <T>(
  url: string,
  method: Method = "GET",
  submitData?: Record<string, unknown>
) => {
  return instance.request<unknown, ResponseData<T>>({
    url,
    method,
    [method.toUpperCase() === "GET" ? "params" : "data"]: submitData,
  });
};
