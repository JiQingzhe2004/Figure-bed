import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getImageById, deleteImage } from '../services/imageService';
import { useAuth } from '../context/AuthContext';
import { ImageData } from '../types/image';

const ImageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [image, setImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const imageId = parseInt(id || '0');
  
  useEffect(() => {
    const fetchImage = async () => {
      if (!imageId) return;
      
      try {
        setLoading(true);
        const imageData = await getImageById(imageId);
        setImage(imageData);
      } catch (err: any) {
        setError(err.message || '获取图片失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchImage();
  }, [imageId]);
  
  const handleDelete = async () => {
    if (!image) return;
    if (!window.confirm('确定要删除这张图片吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      await deleteImage(image.id);
      navigate('/user/images');
    } catch (err: any) {
      setError(err.message || '删除图片失败');
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(() => {
        setError('复制失败，请手动选择并复制');
      });
  };
  
  const canEdit = user && image && (user.id === image.user_id || user.role === 'admin');
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
        <p className="font-bold">出错了</p>
        <p>{error}</p>
      </div>
    );
  }
  
  if (!image) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">图片未找到</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">该图片可能已被删除或不存在</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded"
        >
          返回首页
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* 图片显示区 */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 flex justify-center">
          <img 
            src={image.url} 
            alt={image.original_name} 
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
        
        {/* 图片信息 */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {image.original_name}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 dark:text-gray-400 font-medium">大小：</span>
                <span className="text-gray-800 dark:text-gray-200">
                  {(image.file_size / 1024).toFixed(2)} KB
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 font-medium">类型：</span>
                <span className="text-gray-800 dark:text-gray-200">{image.file_type}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 font-medium">上传时间：</span>
                <span className="text-gray-800 dark:text-gray-200">
                  {new Date(image.created_at).toLocaleString('zh-CN')}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 font-medium">状态：</span>
                <span className={`${image.is_public ? 'text-green-500' : 'text-red-500'}`}>
                  {image.is_public ? '公开' : '私密'}
                </span>
              </div>
              {image.width && image.height && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">尺寸：</span>
                  <span className="text-gray-800 dark:text-gray-200">
                    {image.width} x {image.height}
                  </span>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 dark:text-gray-400 font-medium mb-1">
                  图片URL：
                </label>
                <div className="flex">
                  <input 
                    type="text" 
                    readOnly 
                    value={image.url} 
                    className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l px-3 py-2 text-gray-800 dark:text-gray-200"
                  />
                  <button 
                    onClick={() => copyToClipboard(image.url)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
                  >
                    复制
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-500 dark:text-gray-400 font-medium mb-1">
                  Markdown 代码：
                </label>
                <div className="flex">
                  <input 
                    type="text" 
                    readOnly 
                    value={`![${image.original_name}](${image.url})`}
                    className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l px-3 py-2 text-gray-800 dark:text-gray-200"
                  />
                  <button 
                    onClick={() => copyToClipboard(`![${image.original_name}](${image.url})`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
                  >
                    复制
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-500 dark:text-gray-400 font-medium mb-1">
                  HTML 代码：
                </label>
                <div className="flex">
                  <input 
                    type="text" 
                    readOnly 
                    value={`<img src="${image.url}" alt="${image.original_name}" />`}
                    className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l px-3 py-2 text-gray-800 dark:text-gray-200"
                  />
                  <button 
                    onClick={() => copyToClipboard(`<img src="${image.url}" alt="${image.original_name}" />`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
                  >
                    复制
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {copySuccess && (
            <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-3">
              复制成功！
            </div>
          )}
          
          {/* 操作按钮 */}
          {canEdit && (
            <div className="mt-6 flex justify-end space-x-4">
              <button 
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded"
              >
                删除图片
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageDetailPage;
