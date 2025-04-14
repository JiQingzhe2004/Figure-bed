import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { LoginData, RegisterData, AuthResponse } from '../types/auth';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../services/authService';
import axiosInstance from '../services/axiosInstance';

// 认证上下文类型定义
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean; // 添加别名属性，与isAuthenticated保持一致
  isAdmin: boolean;
  loading: boolean;
  login: (credentials: LoginData) => Promise<AuthResponse>; // 修改返回类型为Promise<AuthResponse>而非void
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateCurrentUser?: (updatedUser: User) => void; // 添加更新用户信息的方法
  error: string | null;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
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
        // 确保userData符合User类型
        const typedUser: User = userData as User;
        setUser(typedUser);
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
      const typedUser: User = response.user as User;
      setUser(typedUser);
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
      const typedUser: User = newUser as User;
      setUser(typedUser);
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

  // 添加更新用户信息的方法
  const updateCurrentUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoggedIn: !!user, // 添加别名属性，与isAuthenticated保持一致
    isAdmin: !!user && user.role === 'admin',
    loading,
    login,
    register,
    logout,
    updateCurrentUser,
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
