import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getPublicImages } from '../services/imageService';
import { getSettings } from '../services/settingService';
import { getUserStats } from '../services/userService';
import { getPublicStats } from '../services/statsService'; // 导入公开统计服务
import { ImageData } from '../types/image';
import Masonry from 'react-masonry-css';
import LazyImage from '../components/image/LazyImage';
import DynamicTitle from '../components/common/DynamicTitle';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [settings, setSettings] = useState({
    site_name: '我的图床',
    site_description: '简单好用的图片存储服务'
  });
  const [publicStats, setPublicStats] = useState({
    publicImagesCount: 0,
    totalUsers: 0
  });
  const [userStats, setUserStats] = useState({
    imageCount: 0,
    storageUsed: 0
  });

  // 获取公开统计数据
  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const data = await getPublicStats();
        setPublicStats(data);
      } catch (err) {
        console.error('获取公开统计失败:', err);
      }
    };
    
    fetchPublicStats();
  }, []);

  // 获取用户统计数据 (当用户登录时)
  useEffect(() => {
    if (!user) return;
    
    const fetchUserStats = async () => {
      try {
        const data = await getUserStats();
        setUserStats(data);
      } catch (err) {
        console.error('获取用户统计失败:', err);
      }
    };
    
    fetchUserStats();
  }, [user]);

  useEffect(() => {
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
  }, [images.length]);

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

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore]);

  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  return (
    <div className="container mx-auto px-4">
      <DynamicTitle 
        title={settings.site_name}
        description={settings.site_description}
      />
      
      {user ? (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg overflow-hidden mb-10">
          <div className="relative p-8">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-20 w-24 h-24 bg-blue-400 opacity-20 rounded-full translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-between">
              <div className="mb-6 md:mb-0 max-w-lg">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">欢迎回来，{user.username || '用户'}！</h1>
                <p className="text-lg md:text-xl mb-4 text-blue-100">今天是个上传新图片的好日子，不是吗？</p>
                
                <div className="flex flex-wrap gap-3 mt-6">
                  <Link to="/upload" className="bg-white text-blue-700 hover:bg-blue-50 font-medium py-2.5 px-6 rounded-lg shadow-md transition duration-300 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                    </svg>
                    上传新图片
                  </Link>
                  <Link to="/user/images" className="bg-blue-800 bg-opacity-50 hover:bg-opacity-70 text-white font-medium py-2.5 px-6 rounded-lg shadow-md transition duration-300 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    我的图库
                  </Link>
                </div>
              </div>
              
              <div className="bg-blue-800 bg-opacity-30 rounded-xl p-5 backdrop-blur-sm">
                <h3 className="text-lg font-medium mb-3 text-center">您的统计</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {userStats.imageCount || 0}
                    </div>
                    <div className="text-sm text-blue-200">已上传图片</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {userStats.storageUsed ? (userStats.storageUsed / 1024 / 1024).toFixed(2) : 0} MB
                    </div>
                    <div className="text-sm text-blue-200">已用空间</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-lg overflow-hidden mb-10">
          <div className="relative p-8">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-300 opacity-20 rounded-full"></div>
            
            <div className="grid md:grid-cols-2 gap-8 relative z-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{settings.site_name}</h1>
                <p className="text-lg md:text-xl mb-6 text-blue-100">{settings.site_description}</p>
                
                <div className="space-y-4 mt-6">
                  <div className="flex items-center">
                    <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>轻松上传和分享图片</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>永久保存，随时查看</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>支持多种格式，安全可靠</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mt-8">
                  <Link to="/upload" className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg shadow-md transition duration-300">
                    立即体验
                  </Link>
                  <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition duration-300">
                    免费注册
                  </Link>
                </div>
              </div>
              
              <div className="hidden md:flex justify-center items-center">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 max-w-xs">
                  <div className="flex items-end justify-center space-x-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{publicStats.publicImagesCount || 0}</div>
                      <div className="text-sm text-blue-100">公开图片</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{publicStats.totalUsers || 0}</div>
                      <div className="text-sm text-blue-100">注册用户</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">100%</div>
                      <div className="text-sm text-blue-100">免费使用</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {images.slice(0, 6).map((image, index) => (
                      <div key={`preview-${image.id || index}`} className="aspect-square overflow-hidden rounded-lg bg-gray-200">
                        <img 
                          src={image.thumbnail_url || image.url} 
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        {images.map(image => (
          <div key={image.id} className="mb-4 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <Link to={`/image/${image.id}`}>
              <div className="relative">
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

export default HomePage;
