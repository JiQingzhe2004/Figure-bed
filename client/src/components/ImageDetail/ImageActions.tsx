import React from 'react';

interface ImageActionsProps {
  onDownload: () => void;
  onDelete?: () => void;
  downloading: boolean;
  canEdit: boolean | null; // 修改类型定义，接受 boolean 或 null
}

const ImageActions: React.FC<ImageActionsProps> = ({ 
  onDownload, 
  onDelete, 
  downloading, 
  canEdit 
}) => {
  return (
    <div className="mt-6 flex justify-end space-x-4">
      <button 
        onClick={onDownload}
        disabled={downloading}
        className={`flex items-center justify-center ${downloading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium py-2 px-6 rounded`}
      >
        {downloading ? (
          <>
            <span className="animate-spin inline-block h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></span>
            下载中...
          </>
        ) : (
          '下载原图'
        )}
      </button>
      
      {canEdit && onDelete && (
        <button 
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded"
        >
          删除图片
        </button>
      )}
    </div>
  );
};

export default ImageActions;
