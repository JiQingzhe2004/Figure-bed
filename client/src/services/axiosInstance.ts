import axios from 'axios';
import API_CONFIG from '../config/api.config';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
  withCredentials: API_CONFIG.withCredentials,
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  config => {
    // 获取token
    const token = localStorage.getItem('authToken');
    
    // 如果有token，添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
