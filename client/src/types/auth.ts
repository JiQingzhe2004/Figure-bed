// 用户信息类型
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at?: string; // 添加创建时间字段，设为可选
  last_login?: string; // 也可能需要最后登录时间
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
  message: string;
  user: UserInfo;
  token: string;
}
