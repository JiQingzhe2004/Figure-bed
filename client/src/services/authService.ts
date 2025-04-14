import axiosInstance from './axiosInstance';
import { RegisterData, LoginData, AuthResponse } from '../types/auth';
import { User } from '../types/user';

export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.post<AuthResponse>('/api/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '注册失败');
    }
};

export const loginUser = async (credentials: LoginData): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.post<AuthResponse>('/api/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '登录失败');
    }
};

export const getCurrentUser = async (): Promise<User> => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('未找到认证令牌');
        }
        
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get<{ user: User }>('/api/auth/me');
        return response.data.user;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取用户信息失败');
    }
};

export const logoutUser = (): void => {
    localStorage.removeItem('authToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
};
