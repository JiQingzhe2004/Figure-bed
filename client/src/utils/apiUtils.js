/**
 * API工具函数 - 用于选择合适的API基础地址和其他API相关功能
 */

/**
 * 判断当前是否为本地环境
 * @returns {boolean}
 */
export const isLocalEnvironment = () => {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1';
};

/**
 * 判断当前是否为移动设备
 * @returns {boolean}
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * 获取适合当前环境的API基础URL
 * @returns {string}
 */
export const getApiBaseUrl = () => {
  // 如果禁用了自动选择，则直接返回远程地址
  if (process.env.REACT_APP_AUTO_SELECT_API !== 'true') {
    return cleanupUrl(process.env.REACT_APP_REMOTE_API_URL || 'http://localhost:5000');
  }
  
  // 自动选择逻辑
  const isLocal = isLocalEnvironment();
  const isMobile = isMobileDevice();
  
  // 如果是移动设备或非本地访问，使用远程地址
  if (isMobile || !isLocal) {
    return cleanupUrl(process.env.REACT_APP_REMOTE_API_URL || 'http://localhost:5000');
  }
  
  // 本地访问使用本地地址
  return cleanupUrl(process.env.REACT_APP_LOCAL_API_URL || 'http://localhost:5000');
};

/**
 * 清理URL格式，确保没有错误的斜杠或冒号
 * @param {string} url - 输入URL
 * @returns {string} - 清理后的URL
 */
export const cleanupUrl = (url) => {
  if (!url) return 'http://localhost:5000';
  
  // 修复常见的URL格式错误
  // 1. 替换http:/domain:port中的多余斜杠
  url = url.replace(/(http:\/\/)([^\/]+)(\/)(:)/, '$1$2$4');
  // 2. 替换https:/domain:port中的多余斜杠
  url = url.replace(/(https:\/\/)([^\/]+)(\/)(:)/, '$1$2$4');
  
  // 移除末尾的斜杠
  url = url.replace(/\/$/, '');
  
  return url;
};

/**
 * 记录API配置信息 - 空函数，不再输出日志
 */
export const logApiConfig = () => {
  // 已移除所有控制台输出
};
