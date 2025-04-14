import React, { useState } from 'react';

interface LazyImageProps {
  thumbnailSrc?: string;
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // 宽高比，例如 "16 / 9"
}

const LazyImage: React.FC<LazyImageProps> = ({
  thumbnailSrc,
  src,
  alt,
  className = '',
  aspectRatio,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // 使用缩略图或原图
  const imgSrc = thumbnailSrc || src;
  
  // 处理图片加载完成事件
  const handleLoad = () => {
    setIsLoaded(true);
  };
  
  // 处理图片加载错误事件
  const handleError = () => {
    setError(true);
    // 如果有缩略图但加载失败，尝试加载原图
    if (thumbnailSrc && thumbnailSrc !== src) {
      setError(false);
    }
  };

  const style: React.CSSProperties = {};
  if (aspectRatio) {
    style.aspectRatio = aspectRatio;
  }
  
  return (
    <div className={`overflow-hidden ${className}`} style={style}>
      {!isLoaded && !error && (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" style={style} />
      )}
      
      <img
        src={error && thumbnailSrc ? src : imgSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

export default LazyImage;
