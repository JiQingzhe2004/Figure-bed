/**
 * CORS配置文件
 * 此文件配置后端API的跨域资源共享(CORS)策略
 */

// 处理多个来源的情况
const parseOrigin = (originString) => {
  if (!originString || originString === '*') {
    return '*';
  }
  
  const origins = originString.split(',').map(origin => origin.trim());
  
  // 如果只有一个来源，直接返回
  if (origins.length === 1) {
    return origins[0];
  }
  
  // 多个来源时，返回函数进行动态判断
  return function(origin, callback) {
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
const corsConfig = {
  // 处理允许的来源
  origin: parseOrigin(process.env.CORS_ALLOW_ORIGIN),
  
  // 是否允许携带凭证(cookies, HTTP认证)
  credentials: process.env.CORS_ALLOW_CREDENTIALS === 'true',
  
  // 允许的HTTP请求方法
  methods: process.env.CORS_ALLOW_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
  
  // 允许的HTTP请求头
  allowedHeaders: process.env.CORS_ALLOW_HEADERS || 'Content-Type,Authorization,X-Requested-With',
  
  // 公开的响应头（默认情况下，只有Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma可以被客户端访问）
  exposedHeaders: process.env.CORS_EXPOSED_HEADERS || 'Content-Range,X-Total-Count',
  
  // 预检请求的缓存时间（秒）
  maxAge: parseInt(process.env.CORS_MAX_AGE || '86400'), // 默认24小时
};

module.exports = corsConfig;
