// 用户数据类型
export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
}

// 后端返回数据类型
export interface UserAuth {
  nickname: string;
  token: string;
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
