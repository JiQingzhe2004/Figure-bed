/**
 * URL辅助工具 - 用于根据请求来源生成正确的资源链接
 */
import { Request } from 'express';
import os from 'os';

/**
 * 获取本机所有网络接口IP地址的实现
 */
const getLocalIPsImpl = (): string[] => {
  const networkInterfaces = os.networkInterfaces();
  const addresses: string[] = [];
  
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    if (interfaces) {
      for (const iface of interfaces) {
        // 只获取IPv4地址且非内部地址
        if (iface.family === 'IPv4' && !iface.internal) {
          addresses.push(iface.address);
        }
      }
    }
  }
  
  return addresses;
};

// 导出函数，这样不会和声明文件冲突
export const getLocalIPs = getLocalIPsImpl;

// 本地IP地址缓存
const localIPs = getLocalIPs();
console.log('本机IP地址:', localIPs);

/**
 * 获取基础URL - 根据请求来源或配置选择
 * @param req - Express请求对象 (可选)
 * @returns 基础URL
 */
export const getBaseUrl = (req: Request | null = null): string => {
  // 1. 如果禁用了自动检测，则使用远程地址
  if (process.env.AUTO_DETECT_SERVER_URL !== 'true') {
    return process.env.REMOTE_SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  }
  
  // 2. 如果没有请求对象，使用远程地址
  if (!req) {
    return process.env.REMOTE_SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  }
  
  // 3. 获取请求主机
  const host = req.get('host') || '';
  
  // 4. 检查是否为本地访问
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return process.env.LOCAL_SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  }
  
  // 5. 检查是否为IP访问
  const clientIP = req.ip || 
                  req.connection.remoteAddress || 
                  req.socket.remoteAddress;
                  
  if (localIPs.includes(clientIP || '')) {
    return process.env.LOCAL_SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  }
  
  // 6. 默认返回远程地址
  return process.env.REMOTE_SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
};

/**
 * 生成资源URL (如图片URL)
 * @param resourcePath - 资源路径 (如 /uploads/image.jpg)
 * @param req - Express请求对象
 * @returns 完整资源URL
 */
export const getResourceUrl = (resourcePath: string, req: Request | null = null): string => {
  const baseUrl = getBaseUrl(req);
  // 确保路径以/开头
  const path = resourcePath.startsWith('/') ? resourcePath : `/${resourcePath}`;
  return `${baseUrl}${path}`;
};
