// 用户信息类型
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  avatar_url?: string; // 添加了头像URL字段
}

// 登录请求数据类型
export interface LoginData {
  username: string;
  password: string;
}

// 注册请求数据类型
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// 认证响应类型
export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// 将 UserInfo 设置为 User 的别名，以便兼容现有代码
export type UserInfo = User;
