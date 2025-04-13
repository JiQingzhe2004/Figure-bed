import React, { useState, useEffect } from 'react';
import { getAllImages, deleteImageAdmin } from '../../services/adminService';
import { ImageData } from '../../types/image';
import { fixImageUrl } from '../../utils/imageUtils';
import AdminImageCard from '../../components/admin/ImageCard';
import { Link } from 'react-router-dom';

const AdminImages: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await getAllImages(page);
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

  const handleDelete = async (imageId: number) => {
    if (deleteConfirm !== imageId) {
      setDeleteConfirm(imageId);
      return;
    }

    try {
      await deleteImageAdmin(imageId);
      setImages(images.filter(image => image.id !== imageId));
      setDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || '删除图片失败');
    }
  };

  const renderImages = () => {
    return images.map(image => (
      <div key={image.id} className="relative group">
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
          <Link to={`/image/${image.id}`}>
            <img 
              src={fixImageUrl(image.thumbnail_url || image.url)} 
              alt={image.original_name}
              className="w-full h-40 object-cover rounded-lg"
              loading="lazy"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (!img.dataset.retried) {
                  img.dataset.retried = "true";
                  img.onerror = null;
                  img.src = '/images/placeholder.png';
                }
              }}
            />
          </Link>
        </div>
      </div>
    ));
  };

  if (loading && images.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">图片管理</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p className="font-bold">错误</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  预览
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  文件名
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  类型 / 大小
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  上传者
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  上传时间
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {images.map(image => (
                <tr key={image.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <img 
                        src={fixImageUrl(image.url)} 
                        alt={image.original_name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.onerror = null;
                          img.src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {image.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div className="max-w-xs truncate" title={image.original_name}>
                      {image.original_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div>{image.file_type.split('/')[1]}</div>
                    <div className="text-xs">{formatBytes(image.file_size)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {(image as any).username || '未知'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${image.is_public ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                      {image.is_public ? '公开' : '私密'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(image.created_at).toLocaleString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <a 
                        href={`/image/${image.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        查看
                      </a>
                      {deleteConfirm === image.id ? (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleDelete(image.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            确认删除
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm(null)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleDelete(image.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          删除
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 分页 */}
        {totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  上一页
                </button>
                <span className="text-gray-700 dark:text-gray-300">
                  第 {page} 页，共 {totalPages} 页
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">{selectedImage.original_name}</h3>
              <button onClick={() => setSelectedImage(null)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              <img
                src={fixImageUrl(selectedImage.url)}
                alt={selectedImage.original_name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (!img.dataset.retried) {
                    img.dataset.retried = "true";
                    img.onerror = null;
                    img.src = '/images/placeholder.png';
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 格式化字节数的辅助函数
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default AdminImages;
