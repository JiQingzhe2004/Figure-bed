import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserImages, deleteImage, toggleImagePublicStatus } from '../services/imageService';
import { ImageData } from '../types/image';

const UserImagePage: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await getUserImages(page);
      setImages(response.images);
      setTotalPages(response.pagination.last_page);
    } catch (err: any) {
      setError(err.message || '获取图片失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这张图片吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      await deleteImage(id);
      // 删除后刷新图片列表
      fetchImages();
    } catch (err: any) {
      setError(err.message || '删除图片失败');
    }
  };

  const handleTogglePublic = async (id: number) => {
    try {
      await toggleImagePublicStatus(id);
      // 更新后刷新图片列表
      fetchImages();
    } catch (err: any) {
      setError(err.message || '更新图片状态失败');
    }
  };

  return (
    <div className="container mx-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map(image => (
              <div key={image.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                <Link to={`/image/${image.id}`}>
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700">
                    <img 
                      src={image.url} 
                      alt={image.original_name} 
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
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
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={() => handleTogglePublic(image.id)}
                      className="flex-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded"
                    >
                      {image.is_public ? "设为私密" : "设为公开"}
                    </button>
                    <button 
                      onClick={() => handleDelete(image.id)}
                      className="flex-1 px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-800 dark:text-red-200 text-sm rounded"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 分页 */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-1">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 disabled:opacity-50"
                >
                  上一页
                </button>
                <span className="px-4 py-1 text-gray-700 dark:text-gray-300">
                  {page} / {totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 disabled:opacity-50"
                >
                  下一页
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserImagePage;
