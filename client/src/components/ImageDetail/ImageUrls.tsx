import React from 'react';
import { ImageData } from '../../types/image';

interface ImageUrlsProps {
  image: ImageData;
  fixImageUrl: (url: string) => string;
  onCopy: (text: string) => void;
}

const ImageUrls: React.FC<ImageUrlsProps> = ({ image, fixImageUrl, onCopy }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-500 dark:text-gray-400 font-medium mb-1">
          图片URL：
        </label>
        <div className="flex">
          <input 
            type="text" 
            readOnly 
            value={fixImageUrl(image.url)} 
            className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l px-3 py-2 text-gray-800 dark:text-gray-200"
          />
          <button 
            onClick={() => onCopy(fixImageUrl(image.url))}
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
            value={`![${image.original_name}](${fixImageUrl(image.url)})`}
            className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l px-3 py-2 text-gray-800 dark:text-gray-200"
          />
          <button 
            onClick={() => onCopy(`![${image.original_name}](${fixImageUrl(image.url)})`)}
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
            value={`<img src="${fixImageUrl(image.url)}" alt="${image.original_name}" />`}
            className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l px-3 py-2 text-gray-800 dark:text-gray-200"
          />
          <button 
            onClick={() => onCopy(`<img src="${fixImageUrl(image.url)}" alt="${image.original_name}" />`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
          >
            复制
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUrls;
