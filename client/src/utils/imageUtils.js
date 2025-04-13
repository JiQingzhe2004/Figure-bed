import { getApiBaseUrl } from './apiUtils';

// 存储已处理过的URL映射，避免重复处理
const urlCache = new Map();
// 预加载的图片缓存
const preloadCache = new Map();

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
 * 预加载图片并缓存
 * @param {string} url - 要预加载的图片URL
 * @returns {Promise} 返回一个Promise，加载完成后解析
 */
export const preloadImage = (url) => {
  if (!url) return Promise.resolve();
  
  const fixedUrl = fixImageUrl(url);
  
  // 如果已经加载过，直接返回缓存的Promise
  if (preloadCache.has(fixedUrl)) {
    return preloadCache.get(fixedUrl);
  }

  // 创建新的预加载Promise
  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = fixedUrl;
  });
  
  // 存入缓存
  preloadCache.set(fixedUrl, promise);
  
  return promise;
};

/**
 * 批量预加载图片
 * @param {Array<string>} urls - 图片URL数组 
 * @param {number} concurrency - 同时加载的最大数量
 */
export const preloadImages = async (urls, concurrency = 3) => {
  if (!urls || urls.length === 0) return;

  // 过滤掉空值
  const validUrls = urls.filter(Boolean);
  
  // 如果并发数大于图片数，则直接全部加载
  if (concurrency >= validUrls.length) {
    return Promise.all(validUrls.map(preloadImage));
  }
  
  // 否则控制并发数
  const results = [];
  for (let i = 0; i < validUrls.length; i += concurrency) {
    const batch = validUrls.slice(i, i + concurrency);
    results.push(...await Promise.allSettled(batch.map(preloadImage)));
  }
  
  return results;
};

/**
 * 清理预加载缓存
 */
export const clearPreloadCache = () => {
  preloadCache.clear();
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
