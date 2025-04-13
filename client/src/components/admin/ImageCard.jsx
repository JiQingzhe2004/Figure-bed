import React from 'react';
import { Link } from 'react-router-dom';
import { fixImageUrl } from '../../utils/imageUtils';

const AdminImageCard = ({ image, onDelete }) => {
  // 优先使用缩略图
  const imageUrl = fixImageUrl(image.thumbnail_url || image.url);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`确定要删除图片"${image.original_name}"吗？`)) {
      onDelete(image.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow relative group">
      <Link to={`/image/${image.id}`}>
        <div className="aspect-w-16 aspect-h-12 bg-gray-100 dark:bg-gray-700">
          <img
            src={imageUrl}
            alt={image.original_name}
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
        
        <div className="p-3">
          <h3 className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">
            {image.original_name}
          </h3>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{new Date(image.created_at).toLocaleDateString()}</span>
            <span className={image.is_public ? 'text-green-500' : 'text-red-500'}>
              {image.is_public ? '公开' : '私密'}
            </span>
          </div>
        </div>
      </Link>
      
      {/* 删除按钮 */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title="删除图片"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default AdminImageCard;