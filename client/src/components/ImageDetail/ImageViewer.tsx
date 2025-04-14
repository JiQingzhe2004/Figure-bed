import React from 'react';
import { ImageData } from '../../types/image';
import { fixImageUrl } from '../../utils/imageUtils';

interface ImageViewerProps {
  image: ImageData;
  onDownload: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ image, onDownload }) => {
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 flex justify-center relative">
      <div className="overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-700 p-2">
        <img 
          src={fixImageUrl(image.thumbnail_url || image.url)}
          alt={image.original_name || "Image"} 
          className="max-w-full max-h-[70vh] object-contain rounded"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.dataset.retried) return;
            
            img.dataset.retried = "true";
            img.onerror = null;
            img.src = '/images/placeholder.png';
            console.warn(`图片加载失败: ${image?.url}`);
          }}
        />
      </div>
    
      <button 
        onClick={onDownload}
        className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg"
        title="下载原始图片"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
    </div>
  );
};

export default ImageViewer;
