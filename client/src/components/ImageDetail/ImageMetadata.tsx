import React from 'react';
import { ImageData } from '../../types/image';

interface ImageMetadataProps {
  image: ImageData;
}

const ImageMetadata: React.FC<ImageMetadataProps> = ({ image }) => {
  return (
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
  );
};

export default ImageMetadata;
