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
    
    console.log('发送请求:', config.url, config.headers);
    return config;
  },
  error => {
    console.error('请求配置错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  response => {
    // 请求成功
    return response;
  },
  error => {
    if (error.response) {
      // 服务器返回了错误
      console.error(`API错误 ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      
      // 处理401未授权错误
      if (error.response.status === 401) {
        console.log('未授权，清除本地令牌');
        localStorage.removeItem('authToken');
        // 可以在这里添加重定向到登录页面
      }
      
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('API请求无响应:', error.message);
      console.error('网络错误，请检查您的互联网连接或API服务器状态');
    } else {
      // 设置请求时发生了错误
      console.error('API请求配置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
