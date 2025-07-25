import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type Method,
} from "axios";
import { useUserStore } from "../stores";
import { message as Message } from "antd";
import router from "../router";
import { userService } from "../services/userServices";

/*
  interface AxiosResponse<T = any> {
    data: T;           // 服务器返回的实际数据（比如ResponseData<T>）
    status: number;    // HTTP 状态码（如 200、404）
    statusText: string;// 状态文本（如 "OK"）
    headers: any;      // 响应头
    config: any;       // 请求配置
    request?: any;     // 请求对象（浏览器环境下可能有）
  }
*/

// 后端返回的实际数据结构
export interface ResponseData<T> {
  data: T;
  message: string | null;
  code: number | string;
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
    // ! 这里的 code 是业务状态码而不是网络状态码
    const { code, message } = response.data;

    if (code === 400 || code === 401 || code === 404) {
      Message.error(message || "登录失败!");
    }

    // 返回的 ResponseData<T>
    return response.data;
  },
  (error: AxiosError) => {
    const { status } = error;
    if (status === 401) {
      Message.warning("当前登录状态有误，请重新登录");
      // 情况状态并跳转回登录页
      userService.logout();
      router.navigate("/login", {
        replace: true,
      });
    }
    return Promise.reject(error);
  }
);

export const request = <T, P>(
  url: string,
  method: Method = "GET",
  submitData?: P
): Promise<ResponseData<T>> => {
  return instance
    .request<ResponseData<T>>({
      url,
      method,
      [method.toUpperCase() === "GET" ? "params" : "data"]: submitData,
    })
    .then((res) => res as unknown as ResponseData<T>);
};
