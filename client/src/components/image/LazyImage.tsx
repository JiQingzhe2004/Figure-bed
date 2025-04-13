import React, { useState, useRef, useEffect } from 'react';
import { fixImageUrl } from '../../utils/imageUtils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  thumbnailSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  aspectRatio?: string; // 添加宽高比支持
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholderColor = '#f3f4f6',
  thumbnailSrc,
  onLoad,
  onError,
  aspectRatio,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // 优先使用缩略图URL，如果没有则使用原图URL
  const mainSrc = thumbnailSrc || src;
  const fixedSrc = fixImageUrl(mainSrc);

  // 监听元素进入视口
  useEffect(() => {
    if (!imageRef.current) return;

    observerRef.current = new IntersectionObserver((entries) => {
      const image = entries[0];
      if (image.isIntersecting) {
        const imgElement = imageRef.current;
        if (imgElement && !isLoaded && !hasError) {
          // 确保立即启动图片加载
          setTimeout(() => {
            // 使用setTimeout确保在下一个渲染周期执行
            if (imageRef.current) {
              imageRef.current.src = fixedSrc;
            }
          }, 0);
        }
        // 一旦开始加载，取消观察
        observerRef.current?.disconnect();
      }
    }, {
      threshold: 0.1,  // 当图片有10%进入视口时触发
      rootMargin: '50px' // 提前50px开始加载
    });

    observerRef.current.observe(imageRef.current);

    // 清理函数
    return () => {
      observerRef.current?.disconnect();
    };
  }, [fixedSrc, isLoaded, hasError]);

  // 计算样式
  const containerStyles: React.CSSProperties = {
    backgroundColor: placeholderColor,
    position: 'relative',
    overflow: 'hidden',
    minHeight: '120px' // 添加最小高度确保占位符可见
  };
  
  // 如果提供了宽高比，添加到样式中
  if (aspectRatio) {
    containerStyles.aspectRatio = aspectRatio;
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={containerStyles}>
      {/* 使用动画占位符 */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* 实际图片 */}
      <img
        ref={imageRef}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        // 默认使用空图片作为src，等Intersection Observer触发后再加载
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        onLoad={(e) => {
          // 确保图片已经设置了实际URL后才标记为已加载
          if ((e.target as HTMLImageElement).src !== "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7") {
            setIsLoaded(true);
            onLoad?.();
          }
        }}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            onError?.();
            if (imageRef.current) {
              imageRef.current.src = '/images/placeholder.png';
            }
          }
        }}
      />
    </div>
  );
};

export default LazyImage;
