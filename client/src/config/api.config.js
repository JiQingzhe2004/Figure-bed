import { getApiBaseUrl, logApiConfig, cleanupUrl } from '../utils/apiUtils';

// 记录API配置信息到控制台
logApiConfig();

// 获取基础URL并确保格式正确
const baseURL = cleanupUrl(getApiBaseUrl());

// API基础配置
const API_CONFIG = {
  // 基本URL配置 - 使用我们的API地址选择逻辑
  baseURL,
  
  // 请求超时时间(毫秒)
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '15000'),
  
  // 跨域请求相关配置
  withCredentials: process.env.REACT_APP_API_WITH_CREDENTIALS === 'true',
  
  // 请求头配置 - 移除可能引起问题的X-Requested-With
  headers: {
    'Content-Type': process.env.REACT_APP_API_CONTENT_TYPE || 'application/json',
    'Accept': process.env.REACT_APP_API_ACCEPT || 'application/json'
  }
};

// 开发环境打印配置信息
if (process.env.NODE_ENV === 'development') {
  console.log('API配置:', {
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    withCredentials: API_CONFIG.withCredentials
  });
}

export default API_CONFIG;
