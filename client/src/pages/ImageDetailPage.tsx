import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useImageDetail } from '../hooks/useImageDetail';
import ImageViewer from '../components/ImageDetail/ImageViewer';
import ImageMetadata from '../components/ImageDetail/ImageMetadata';
import ImageUrls from '../components/ImageDetail/ImageUrls';
import ImageActions from '../components/ImageDetail/ImageActions';

const ImageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const imageId = parseInt(id || '0');
  const navigate = useNavigate();
  
  const {
    image,
    loading,
    error,
    copySuccess,
    downloading,
    canEdit,
    handleDelete,
    handleDownload,
    copyToClipboard,
    fixImageUrl
  } = useImageDetail(imageId);
  
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
        {/* 图片查看器 */}
        <ImageViewer image={image} onDownload={handleDownload} />
        
        {/* 图片信息 */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {image.original_name}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 图片元数据 */}
            <ImageMetadata image={image} />
            
            {/* 图片URL和复制功能 */}
            <ImageUrls 
              image={image} 
              fixImageUrl={fixImageUrl} 
              onCopy={copyToClipboard} 
            />
          </div>
          
          {copySuccess && (
            <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-3">
              复制成功！
            </div>
          )}
          
          {/* 操作按钮 */}
          <ImageActions 
            onDownload={handleDownload} 
            onDelete={handleDelete}
            downloading={downloading} 
            canEdit={canEdit} 
          />
        </div>
      </div>
    </div>
  );
};

export default ImageDetailPage;
