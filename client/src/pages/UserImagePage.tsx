import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getUserImages, deleteImage, toggleImagePublicStatus } from '../services/imageService';
import { ImageData } from '../types/image';
import LazyImage from '../components/image/LazyImage';
import Masonry from 'react-masonry-css';
import { preloadImages } from '../utils/imageUtils';

const UserImagePage: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchImages = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await getUserImages(pageNum);
      
      if (pageNum === 1) {
        setImages(response.images);
      } else {
        setImages(prev => [...prev, ...response.images]);
      }
      
      setTotalPages(response.pagination.last_page);
      setHasMore(response.pagination.current_page < response.pagination.last_page);
      
      // 预加载下一批图片的缩略图
      if (response.images.length > 0) {
        // 过滤掉可能的 undefined 值以符合类型要求
        const thumbnailUrls = response.images
          .map((img: ImageData) => img.thumbnail_url)
          .filter((url): url is string => !!url);
        preloadImages(thumbnailUrls);
      }
    } catch (err: any) {
      setError(err.message || '获取图片失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(1);
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchImages(nextPage);
    }
  }, [loading, hasMore, page]);

  // 添加滚动加载
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

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这张图片吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      await deleteImage(id);
      // 删除后刷新图片列表
      fetchImages(1);
    } catch (err: any) {
      setError(err.message || '删除图片失败');
    }
  };

  const handleTogglePublic = async (id: number) => {
    try {
      await toggleImagePublicStatus(id);
      // 更新后刷新图片列表
      fetchImages(1);
    } catch (err: any) {
      setError(err.message || '更新图片状态失败');
    }
  };

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
      <h1 className="text-2xl font-bold mb-6 dark:text-white">我的图片</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {loading && images.length === 0 ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-gray-500 dark:text-gray-400">您还没有上传过图片</p>
          <Link to="/upload" className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">
            上传图片
          </Link>
        </div>
      ) : (
        <>
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
                    <LazyImage
                      src={image.url}
                      thumbnailSrc={image.thumbnail_url}
                      alt={image.original_name}
                      className="w-full"
                      // 保持图片原始宽高比
                      aspectRatio={image.width && image.height ? `${image.width} / ${image.height}` : undefined}
                    />
                    
                    {/* 图片尺寸信息悬浮层 */}
                    {image.width && image.height && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {image.width} × {image.height}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate" title={image.original_name}>
                    {image.original_name}
                  </h3>
                  <div className="mt-2 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <span>{new Date(image.created_at).toLocaleDateString('zh-CN')}</span>
                    <span className={image.is_public ? "text-green-500" : "text-red-500"}>
                      {image.is_public ? "公开" : "私密"}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between">
                    <button
                      onClick={() => handleTogglePublic(image.id)}
                      className={`text-xs px-2 py-1 rounded ${
                        image.is_public
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                      }`}
                    >
                      {image.is_public ? '设为私密' : '设为公开'}
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      删除
                    </button>
                  </div>
                </div>
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
                <p className="text-gray-500 dark:text-gray-400">已加载全部图片</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserImagePage;
