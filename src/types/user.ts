// 用户信息类型
export interface UserAuth {
  nickname: string;
  token: string;
}

export interface UserInfo {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string;
  nickname: string;
}

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
}

// 注册请求参数
export interface RegisterParams {
  username: string;
  password: string;
  nickname: string;
}
