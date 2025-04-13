/**
 * CORS配置文件
 * 此文件配置后端API的跨域资源共享(CORS)策略
 */
import { CorsOptions } from 'cors';

/**
 * 处理多个来源的情况
 */
const parseOrigin = (originString: string | undefined): string | string[] | ((origin: string | undefined, callback: (err: Error | null, origin?: boolean) => void) => void) => {
  if (!originString || originString === '*') {
    return '*';
  }
  
  const origins = originString.split(',').map(origin => origin.trim());
  
  // 如果只有一个来源，直接返回
  if (origins.length === 1) {
    return origins[0];
  }
  
  // 多个来源时，返回函数进行动态判断
  return function(origin: string | undefined, callback: (err: Error | null, origin?: boolean) => void): void {
    // 允许请求没有origin（如移动应用）
    if (!origin) return callback(null, true);
    
    if (origins.indexOf(origin) !== -1 || origins.indexOf('*') !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS拒绝来源: ${origin}`); // 添加日志便于调试
      callback(new Error(`来源 ${origin} 不被允许访问`), false);
    }
  };
};

// 从环境变量读取CORS配置
const corsConfig: CorsOptions = {
  // 处理允许的来源 - 设为*确保所有来源都能访问
  origin: '*',
  
  // 是否允许携带凭证(cookies, HTTP认证)
  credentials: false, // 对于使用Authorization header的情况设为false
  
  // 允许的HTTP请求方法
  methods: process.env.CORS_ALLOW_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
  
  // 允许的HTTP请求头
  allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
  
  // 公开的响应头
  exposedHeaders: process.env.CORS_EXPOSED_HEADERS || 'Content-Range,X-Total-Count',
  
  // 预检请求的缓存时间（秒）
  maxAge: parseInt(process.env.CORS_MAX_AGE || '86400', 10), // 默认24小时
  
  // 添加预检请求处理选项
  preflightContinue: false,
  optionsSuccessStatus: 204
};

export default corsConfig;
