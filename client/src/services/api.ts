import axios from 'axios';
import { getAuthToken } from './authStorage';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

export default apiClient;
