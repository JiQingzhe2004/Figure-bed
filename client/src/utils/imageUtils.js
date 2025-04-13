import { getApiBaseUrl } from './apiUtils';

// 存储已处理过的URL映射，避免重复处理
const urlCache = new Map();

/**
 * 修复图片URL，确保使用正确的服务器地址
 * @param {string} url - 原始图片URL
 * @returns {string} - 修正后的图片URL
 */
export const fixImageUrl = (url) => {
  if (!url) return '';
  
  // 检查缓存，避免重复处理同一URL
  if (urlCache.has(url)) {
    return urlCache.get(url);
  }
  
  // 获取当前API基础URL
  const apiBaseUrl = getApiBaseUrl();
  const baseUrlWithoutApi = apiBaseUrl.replace(/\/api\/?$/, '');
  
  let fixedUrl = url;
  
  // 如果URL已经是正确的，直接返回
  if (url.startsWith(baseUrlWithoutApi) || 
      (url.startsWith('http') && !url.includes('localhost'))) {
    // 已经是正确格式，不需要修改
  }
  // 如果是相对路径，添加正确的基础URL
  else if (url.startsWith('/')) {
    fixedUrl = `${baseUrlWithoutApi}${url}`;
  }
  // 如果URL包含localhost，替换为正确的服务器地址
  else if (url.includes('localhost')) {
    const urlParts = url.split('localhost:');
    if (urlParts.length > 1) {
      const portAndPath = urlParts[1].split('/');
      if (portAndPath.length > 1) {
        const path = '/' + portAndPath.slice(1).join('/');
        fixedUrl = `${baseUrlWithoutApi}${path}`;
      }
    }
  }
  
  // 存入缓存
  urlCache.set(url, fixedUrl);
  
  return fixedUrl;
};

/**
 * 清理图片URL缓存
 */
export const clearImageUrlCache = () => {
  urlCache.clear();
};

/**
 * 图片组件，自动修正图片URL
 */
export const ImageWithFallback = ({ src, alt, className, ...props }) => {
  // 修正图片URL并使用缓存
  const fixedSrc = fixImageUrl(src);
  
  return (
    <img
      src={fixedSrc}
      alt={alt || '图片'}
      className={className}
      onError={(e) => {
        const img = e.target;
        if (img.dataset.retried) return; // 防止无限重试
        
        img.dataset.retried = "true";
        img.src = '/images/placeholder.png'; // 使用一个占位图
      }}
      {...props}
    />
  );
};
