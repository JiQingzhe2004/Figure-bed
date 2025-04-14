import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getPublicImages } from '../services/imageService';
import { getSettings } from '../services/settingService';
import { ImageData } from '../types/image';
import Masonry from 'react-masonry-css';
import LazyImage from '../components/image/LazyImage';
import DynamicTitle from '../components/common/DynamicTitle';

const HomePage: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [settings, setSettings] = useState({
    site_name: '我的图床',
    site_description: '简单好用的图片存储服务'
  });

  // 使用useCallback优化函数
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    // 获取站点设置
    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        setSettings({
          site_name: response.settings.site_name || '我的图床',
          site_description: response.settings.site_description || '简单好用的图片存储服务'
        });
      } catch (error) {
        console.error('获取设置失败:', error);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await getPublicImages(page);
        setImages(prev => page === 1 ? response.images : [...prev, ...response.images]);
        setHasMore(page < response.pagination.last_page);
      } catch (error: any) {
        setError(error.message || '获取图片失败');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [page]);

  // 添加自动加载更多功能
  useEffect(() => {
    const handleScroll = () => {
      // 当用户滚动到距离底部200px时自动加载更多
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore]);

  // 瀑布流的断点设置
  const breakpointColumnsObj = {
    default: 4, // 默认4列
    1280: 3,    // 在1280px以下是3列
    1024: 3,    // 在1024px以下是3列
    768: 2,     // 在768px以下是2列
    640: 1      // 在640px以下是1列
  };

  return (
    <div className="container mx-auto px-4">
      <DynamicTitle 
        title={settings.site_name}
        description={settings.site_description}
      />
      
      {/* 首页横幅 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-8 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{settings.site_name}</h1>
        <p className="text-lg md:text-xl mb-6">{settings.site_description}</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/upload" className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-2 px-6 rounded-full shadow-md transition duration-300">
            上传图片
          </Link>
          <Link to="/register" className="bg-transparent hover:bg-white/20 border border-white text-white font-medium py-2 px-6 rounded-full shadow-md transition duration-300">
            立即注册
          </Link>
        </div>
      </div>

      {/* 图片展示区 */}
      <h2 className="text-2xl font-semibold mb-6">公开图片</h2>
      <hr className="my-6" />
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* 使用Masonry组件实现瀑布流 */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-4" // 负外边距补偿子元素的间距
        columnClassName="pl-4 bg-clip-padding" // 列的左内边距
      >
        {images.map(image => (
          <div key={image.id} className="mb-4 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <Link to={`/image/${image.id}`}>
              <div className="relative">
                {/* 使用LazyImage组件，优先加载缩略图 */}
                <LazyImage
                  thumbnailSrc={image.thumbnail_url} // 优先使用缩略图
                  src={image.url} // 缩略图不存在时使用原图
                  alt={image.original_name}
                  className="w-full" // 保持原有宽度
                  // 根据图片原始尺寸设置宽高比
                  aspectRatio={image.width && image.height ? `${image.width} / ${image.height}` : undefined}
                />
                
                {/* 图片尺寸信息悬浮层 */}
                {image.width && image.height && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {image.width} × {image.height}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium truncate">{image.original_name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(image.created_at).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </Masonry>

      {/* 加载更多/底部提示 */}
      {images.length > 0 && (
        <div className="mt-10 text-center pb-6">
          {hasMore ? (
            loading ? (
              <div className="inline-flex items-center text-gray-500 dark:text-gray-400">
                <div className="mr-3 w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                加载更多中...
              </div>
            ) : (
              <button
                onClick={loadMore}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md shadow-md transition"
              >
                加载更多
              </button>
            )
          ) : (
            <p className="text-gray-500 dark:text-gray-400">已经到底啦，没有更多图片了~</p>
          )}
        </div>
      )}

      {/* 初始加载提示 */}
      {loading && page === 1 && images.length === 0 && (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* 无图片提示 */}
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

export default HomePage;
