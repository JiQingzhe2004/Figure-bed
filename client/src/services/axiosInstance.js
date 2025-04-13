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
    
    // CORS调试信息
    if (process.env.REACT_APP_ENABLE_CORS_DEBUG === 'true') {
      console.log('发送请求:', config.url, config.headers);
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // 处理服务器返回的错误
      console.error('API错误:', error.response.data);
      
      // 处理特定状态码
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          console.error('认证失败，需要重新登录');
          // 可以在这里添加重定向到登录页的逻辑
          break;
        case 403:
          console.error('没有权限执行此操作');
          break;
        case 429:
          console.error('请求过于频繁，请稍后再试');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        case 502:
        case 503:
        case 504:
          console.error('服务器暂时不可用，请稍后再试');
          break;
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      console.error('API请求无响应:', error.message);
      if (error.message.includes('Network Error')) {
        console.error('网络错误，请检查您的互联网连接或API服务器状态');
      }
    } else {
      // 请求设置时出现错误
      console.error('API请求错误:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
