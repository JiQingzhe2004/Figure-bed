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
  fetchImagesInRange?: (startIndex: number, endIndex: number) => Promise<ImageData[]>;
}

interface LazyLoadedImageProps {
  image: ImageData;
  onIntersect: () => void;
  priority?: boolean;
}

// 简化的懒加载图片组件
const LazyLoadedImage: React.FC<LazyLoadedImageProps> = ({ image, onIntersect, priority = false }) => {
  const [isVisible, setIsVisible] = useState(priority); // 如果是优先级项，立即显示
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 如果是优先项，直接加载
    if (priority && !isLoaded) {
      setIsLoaded(true);
      onIntersect();
      return;
    }

    // 创建观察器
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '200px', // 提前500px开始加载图片
        threshold: 0.01
      }
    );

    const currentRef = imageRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [priority, isLoaded, onIntersect]);

  // 图片加载完成时触发
  const handleImageLoaded = useCallback(() => {
    if (!isLoaded) {
      setIsLoaded(true);
      onIntersect();
    }
  }, [isLoaded, onIntersect]);

  return (
    <div 
      ref={imageRef} 
      className="mb-4 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
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
                onLoad={handleImageLoaded}
              />
              {image.width && image.height && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {image.width} × {image.height}
                </div>
              )}
            </>
          ) : (
            <div 
              className="bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center" 
              style={{ 
                aspectRatio: image.width && image.height ? `${image.width} / ${image.height}` : '16/9',
                minHeight: '160px'
              }}
            >
              <svg className="w-10 h-10 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
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

// 主画廊组件
const PublicGallery: React.FC<PublicGalleryProps> = ({
  images,
  loading,
  error,
  hasMore,
  page,
  loadMore
}) => {
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const observerRef = useRef<HTMLDivElement>(null);
  const [initialRender, setInitialRender] = useState(true);
  
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  // 图片去重
  const uniqueImagesMap = new Map();
  images.forEach(image => {
    if (image.id) {
      uniqueImagesMap.set(image.id, image);
    }
  });
  
  const uniqueImages = Array.from(uniqueImagesMap.values());
  
  // 图片加载回调
  const handleImageLoaded = useCallback(() => {
    setLoadedImagesCount(prev => prev + 1);
  }, []);

  // 监听页面底部触发加载更多
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  // 设置底部观察器
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '300px 0px',
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

  // 首次加载后标记初始渲染完成
  useEffect(() => {
    if (initialRender && uniqueImages.length > 0) {
      // 300ms后标记初始渲染完成，让布局稳定
      const timer = setTimeout(() => {
        setInitialRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [initialRender, uniqueImages.length]);

  // 当页面重置时重置加载计数
  useEffect(() => {
    if (page === 1) {
      setLoadedImagesCount(0);
      setInitialRender(true);
    }
  }, [page]);

  return (
    <div className="public-gallery">
      <h2 className="text-2xl font-semibold mb-6">公开图片</h2>
      <hr className="my-6" />
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {uniqueImages.map((image, index) => (
          <LazyLoadedImage 
            key={`image-${image.id}`} 
            image={image} 
            onIntersect={handleImageLoaded}
            priority={index < 8} // 前8张图片优先加载
          />
        ))}
      </Masonry>

      {/* 加载更多触发器 */}
      <div 
        ref={observerRef} 
        className="h-10 w-full flex justify-center items-center mt-4"
      >
        {loading && (
          <div className="inline-flex items-center text-gray-500 dark:text-gray-400">
            <div className="mr-3 w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            正在获取更多图片...
          </div>
        )}
      </div>

      {!hasMore && uniqueImages.length > 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-4 mb-8">
          <p>已经到底啦，没有更多图片了~</p>
        </div>
      )}

      {loading && page === 1 && uniqueImages.length === 0 && (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && uniqueImages.length === 0 && (
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
