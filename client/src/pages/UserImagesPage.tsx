import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserImages } from '../services/imageService';
import { fixImageUrl } from '../utils/imageUtils';
import { ImageData } from '../types/image';
import { useAuth } from '../context/AuthContext';

const UserImagesPage: React.FC = () => {
  const [userImages, setUserImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await getUserImages();
        setUserImages(response.images);
      } catch (err: any) {
        setError(err.message || '获取图片失败');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">我的图片</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : userImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userImages.map(image => (
            <div key={image.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden group">
              <div className="relative">
                <Link to={`/image/${image.id}`}>
                  <img 
                    src={fixImageUrl(image.thumbnail_url || image.url)} 
                    alt={image.original_name}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.dataset.retried) {
                        img.dataset.retried = "true";
                        img.src = '/images/placeholder.png';
                      }
                    }}
                  />
                </Link>
                
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5"
                    title="删除图片"
                    onClick={() => {/* 删除功能 */}}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium truncate">{image.original_name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(image.created_at).toLocaleDateString('zh-CN')}
                  </span>
                  <span className={image.is_public ? "text-green-500" : "text-red-500 text-sm"}>
                    {image.is_public ? "公开" : "私密"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-10 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">没有图片</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">你还没有上传任何图片。</p>
          <div className="mt-6">
            <Link to="/upload" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              上传图片
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserImagesPage;