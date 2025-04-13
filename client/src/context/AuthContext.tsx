import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../services/authService';
import { RegisterData, LoginData, UserInfo } from '../types/auth';
import apiClient from '../services/api';

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  // 初始化时检查已存储的token和用户信息
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      
      if (storedToken) {
        console.log('找到存储的token，尝试恢复登录状态');
        try {
          // 设置请求头
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const userData = await getCurrentUser();
          console.log('成功获取用户信息，用户已登录');
          setUser(userData);
          setToken(storedToken);
        } catch (error: any) {
          console.error('自动登录失败:', error);
          // 清除无效的token
          localStorage.removeItem('authToken');
          delete apiClient.defaults.headers.common['Authorization'];
          setToken(null);
        }
      } else {
        console.log('没有找到存储的token');
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginData) => {
    try {
      setLoading(true);
      const { user: userData, token: authToken } = await loginUser(credentials);
      setUser(userData);
      setToken(authToken);
      setError(null);
      console.log('登录成功，用户信息已保存');
    } catch (error: any) {
      setError(error.message || '登录失败，请稍后再试');
      console.error('登录错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const { user: newUser, token: authToken } = await registerUser(userData);
      setUser(newUser);
      setToken(authToken);
      setError(null);
    } catch (error: any) {
      setError(error.message || '注册失败，请稍后再试');
      console.error('注册错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
