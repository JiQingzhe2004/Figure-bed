import axios from 'axios';
import { getApiBaseUrl, cleanupUrl } from '../utils/apiUtils';
import { getAuthToken } from './authStorage';

// 使用配置的API地址
const API_BASE_URL = cleanupUrl(getApiBaseUrl());

// 创建Axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 为每个请求添加认证令牌
apiClient.interceptors.request.use(
  config => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // 可以在这里处理认证错误，例如清除本地令牌或重定向到登录页面
      console.warn('认证失败，请重新登录');
    }
    return Promise.reject(error);
  }
);

// 如果需要确保所有API路径都有前缀，可以添加一个辅助方法
export const getApiPath = (path: string): string => {
  // 确保路径以/api开头
  if (!path.startsWith('/api')) {
    return `/api${path.startsWith('/') ? path : `/${path}`}`;
  }
  return path;
};

// 可以使用该方法包装请求
export const apiGet = async <T>(path: string, config = {}): Promise<T> => {
  return apiClient.get<T>(getApiPath(path), config).then(res => res.data);
};

export const apiPost = async <T>(path: string, data = {}, config = {}): Promise<T> => {
  return apiClient.post<T>(getApiPath(path), data, config).then(res => res.data);
};

export default apiClient;
