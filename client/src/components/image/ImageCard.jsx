import React from 'react';
import { Link } from 'react-router-dom';
import { fixImageUrl } from '../../utils/imageUtils';

const ImageCard = ({ image }) => {
  // 优先使用缩略图URL以提高加载速度
  const imageUrl = fixImageUrl(image.thumbnail_url || image.url);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/image/${image.id}`} className="block">
        <div className="aspect-w-16 aspect-h-12 bg-gray-100 dark:bg-gray-700">
          <img
            src={imageUrl}
            alt={image.original_name || '图片'}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const img = e.target;
              if (!img.dataset.retried) {
                img.dataset.retried = 'true';
                img.src = '/images/placeholder.png';
              }
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium truncate text-gray-800 dark:text-gray-200">
            {image.original_name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {new Date(image.created_at).toLocaleDateString('zh-CN')}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ImageCard;