import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import LazyImage from '../image/LazyImage';
import { ImageData } from '../../types/image';

interface PublicGalleryProps {
  images: ImageData[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  loadMore: () => void;
}

// 为LazyLoadedImage组件定义props类型接口
interface LazyLoadedImageProps {
  image: ImageData;
  onIntersect: () => void;
}

// 图片懒加载组件
const LazyLoadedImage: React.FC<LazyLoadedImageProps> = ({ image, onIntersect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 延迟100ms再加载图片，让用户能看到骨架屏动画
          setTimeout(() => {
            setIsVisible(true);
            onIntersect && onIntersect(); // 触发回调
            
            // 一旦加载，取消观察
            if (imageRef.current) {
              observer.unobserve(imageRef.current);
            }
          }, 100);
        }
      },
      {
        rootMargin: '0px', // 不提前加载，只有进入视口才加载
        threshold: 0.5 // 当元素有50%进入视口时才触发加载
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [onIntersect]);

  return (
    <div ref={imageRef} className="mb-4 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/image/${image.id}`}>
        <div className="relative">
          {isVisible ? (
            <>
              <LazyImage
                thumbnailSrc={image.thumbnail_url}
                src={image.url}
                alt={image.original_name}
                className="w-full"
                aspectRatio={image.width && image.height ? `${image.width} / ${image.height}` : undefined}
              />
              {image.width && image.height && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {image.width} × {image.height}
                </div>
              )}
            </>
          ) : (
            // 优化骨架屏显示效果
            <div 
              className="bg-gray-200 dark:bg-gray-700 animate-pulse" 
              style={{ 
                aspectRatio: image.width && image.height ? `${image.width} / ${image.height}` : '16/9',
                minHeight: '160px'
              }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium truncate">
            {isVisible ? image.original_name : (
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            )}
          </h3>
          {isVisible ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {new Date(image.created_at).toLocaleDateString('zh-CN')}
            </p>
          ) : (
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
          )}
        </div>
      </Link>
    </div>
  );
};

const PublicGallery: React.FC<PublicGalleryProps> = ({
  images,
  loading,
  error,
  hasMore,
  page,
  loadMore
}) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  const imageMap = new Map();
  images.forEach(image => {
    if (image.id) {
      imageMap.set(image.id, image);
    }
  });
  
  const dedupedImages = Array.from(imageMap.values());
  
  const handleImageIntersect = useCallback(() => {
    setLoadedImagesCount(prev => prev + 1);
  }, []);

  // 使用Intersection Observer监听滚动到底部
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  useEffect(() => {
    // 创建底部观察器实例
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px 0px 200px 0px',
      threshold: 0.1
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleObserver]);

  // 重置加载计数，当组件重新加载时
  useEffect(() => {
    setLoadedImagesCount(0);
  }, [page === 1]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">公开图片</h2>
      <hr className="my-6" />
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-4 text-sm text-gray-500">
        已渲染 {loadedImagesCount} 张图片 • 按需加载 • 只有滚动到图片位置才会加载内容
      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {dedupedImages.map((image) => (
          <LazyLoadedImage 
            key={`image-${image.id}`} 
            image={image} 
            onIntersect={handleImageIntersect}
          />
        ))}
      </Masonry>

      {/* 无限滚动的观察点元素 */}
      <div ref={observerRef} className="h-10 w-full flex justify-center items-center mt-4">
        {loading && (
          <div className="inline-flex items-center text-gray-500 dark:text-gray-400">
            <div className="mr-3 w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            正在获取更多图片...
          </div>
        )}
      </div>

      {!hasMore && dedupedImages.length > 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-4 mb-8">
          <p>已经到底啦，没有更多图片了~</p>
        </div>
      )}

      {loading && page === 1 && images.length === 0 && (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[200px] bg-gray-50 dark:bg-gray-700 rounded-lg">
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg text-gray-500 dark:text-gray-400">暂时没有图片，快来上传第一张吧！</p>
        </div>
      )}
    </div>
  );
};

export default PublicGallery;
