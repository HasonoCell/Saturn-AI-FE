import type { LoginParams, RegisterParams } from "../types/user";
import { request, type ResponseData } from "../utils/request";
import type { UserAuth } from "../types/user";

export const authAPI = {
  login: (params: LoginParams): Promise<ResponseData<UserAuth>> => {
    return request<UserAuth, LoginParams>("user/login", "POST", params);
  },
  register: (params: RegisterParams): Promise<ResponseData<UserAuth>> => {
    return request<UserAuth, RegisterParams>("user/register", "POST", params);
  },
};
