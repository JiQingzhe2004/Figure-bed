import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserInfo, LoginData, RegisterData, AuthResponse } from '../types/auth';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../services/authService';
import axiosInstance from '../services/axiosInstance';

// 认证上下文类型定义
interface AuthContextType {
  user: UserInfo | null;
  isLoggedIn: boolean;
  isAuthenticated: boolean; // 添加别名属性，与isLoggedIn保持一致
  isAdmin: boolean;
  loading: boolean;
  login: (credentials: LoginData) => Promise<AuthResponse>; // 修改返回类型为Promise<AuthResponse>而非void
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.log('没有找到存储的token');
        setLoading(false);
        return;
      }
      
      try {
        // 在头部设置令牌
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 验证令牌并获取用户信息
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('加载用户信息失败');
        localStorage.removeItem('authToken');
        delete axiosInstance.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // 登录函数
  const login = async (credentials: LoginData): Promise<AuthResponse> => { // 确保返回类型正确
    try {
      setAuthError(null);
      const response = await loginUser(credentials);
      
      // 存储用户信息和令牌
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
      
      // 设置请求头的授权信息
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      
      return response; // 返回完整的响应对象
    } catch (error: any) {
      console.error('登录错误:', error);
      setAuthError(error.message);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const { user: newUser, token: authToken } = await registerUser(userData);
      setUser(newUser);
      setAuthToken(authToken);
      setAuthError(null);
    } catch (error: any) {
      setAuthError(error.message || '注册失败，请稍后再试');
      console.error('注册错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setAuthToken(null);
  };

  const contextValue: AuthContextType = {
    user,
    isLoggedIn: !!user,
    isAuthenticated: !!user, // 添加别名属性，与isLoggedIn保持一致
    isAdmin: !!user && user.role === 'admin',
    loading,
    login,
    register,
    logout,
    error: authError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook，方便使用认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内使用');
  }
  return context;
};
