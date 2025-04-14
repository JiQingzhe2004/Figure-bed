import React, { useState, useEffect } from 'react';
import { getUserImages, deleteImage, toggleImagePublicStatus } from '../services/imageService';
import { ImageData } from '../types/image';
import { Link } from 'react-router-dom';
import LazyImage from '../components/image/LazyImage';
import Masonry from 'react-masonry-css';

const UserImagesPage: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toggleStatus, setToggleStatus] = useState<number | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await getUserImages(page);
        
        if (page === 1) {
          setImages(response.images);
        } else {
          setImages(prev => [...prev, ...response.images]);
        }
        
        setHasMore(page < response.pagination.last_page);
      } catch (error: any) {
        setError(error.message || '获取图片失败');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (!window.confirm('确定要删除这张图片吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      setDeleting(id);
      await deleteImage(id);
      setImages(images.filter(img => img.id !== id));
    } catch (error: any) {
      setError(error.message || '删除图片失败');
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublic = async (id: number, isPublic: boolean) => {
    try {
      setToggleStatus(id);
      await toggleImagePublicStatus(id); // 修改这里，使用正确的方法名
      // 更新本地状态
      setImages(images.map(img => 
        img.id === id ? { ...img, is_public: !isPublic } : img
      ));
    } catch (error: any) {
      setError(error.message || '更改图片状态失败');
    } finally {
      setToggleStatus(null);
    }
  };

  // 瀑布流的断点设置
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">我的图片</h1>
      
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
              <div className="flex items-center mt-4">
                <button
                  onClick={() => handleTogglePublic(image.id, image.is_public)}
                  disabled={toggleStatus === image.id}
                  className={`px-3 py-1 rounded-md text-white ${image.is_public ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} transition`}
                >
                  {toggleStatus === image.id ? '处理中...' : image.is_public ? '公开' : '私密'}
                </button>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  disabled={deleting === image.id}
                  className="ml-2 px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white transition"
                >
                  {deleting === image.id ? '删除中...' : '删除'}
                </button>
              </div>
            </div>
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
                onClick={handleLoadMore}
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

export default UserImagesPage;