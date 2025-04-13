import axios from 'axios';
import API_CONFIG from '../config/api.config';

// 创建axios实例
const axiosInstance = axios.create(API_CONFIG);

// 请求拦截器
axiosInstance.interceptors.request.use(
  config => {
    // 使用环境变量中配置的存储键名
    const tokenKey = process.env.REACT_APP_AUTH_STORAGE_KEY || 'token';
    const token = localStorage.getItem(tokenKey);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // 处理特定状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          break;
        // 移除其他状态码的具体错误处理
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
