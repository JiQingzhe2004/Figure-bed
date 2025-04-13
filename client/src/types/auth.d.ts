// 定义注册时发送的数据结构
export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

// 定义后端返回的用户信息结构 (不含敏感信息)
export interface UserInfo {
    id: number;
    username: string;
    email: string;
    role?: string;
    created_at?: string;
}

// 定义认证 API 的响应结构
export interface AuthResponse {
    message: string;
    token: string;
    user: UserInfo;
}

// 定义登录时发送的数据结构
export interface LoginData {
    email?: string;
    username?: string;
    password: string;
}
