import React from 'react';
import { Link } from 'react-router-dom';
import { FileWithPreview } from '../hooks/useFileUpload';
import { getFileNameAndExtension } from '../utils/fileUtils';

interface FilePreviewItemProps {
  file: FileWithPreview;
  onEdit: (id: string) => void;
  onSave: (id: string, name: string) => void;
  onChange: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}

const FilePreviewItem: React.FC<FilePreviewItemProps> = ({ 
  file, onEdit, onSave, onChange, onRemove 
}) => {
  return (
    <div className="flex items-start p-2 border border-gray-200 dark:border-gray-700 rounded">
      {/* 图片预览 */}
      <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 mr-3 flex-shrink-0">
        <img 
          src={file.preview} 
          alt="预览"
          className="h-full w-full object-contain"
        />
      </div>
      
      <div className="flex-grow min-w-0">
        {/* 文件名和操作按钮 */}
        <div className="flex justify-between">
          {file.isEditing ? (
            <div className="flex items-center w-full mr-2">
              <input
                type="text"
                value={getFileNameAndExtension(file.editedName || file.originalName).name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(file.id, e.target.value)}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => onSave(file.id, e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    onSave(file.id, e.currentTarget.value);
                  }
                }}
                autoFocus
                className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l px-2 py-1 flex-grow"
                placeholder="输入文件名（不含扩展名）"
              />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-r border border-l-0 border-gray-300 dark:border-gray-600 whitespace-nowrap">
                {file.originalExtension || getFileNameAndExtension(file.originalName).extension}
              </span>
            </div>
          ) : (
            <div className="flex items-center w-full mr-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate flex-grow" 
                 title={file.editedName || file.originalName}>
                {file.editedName || file.originalName}
              </p>
              <button
                onClick={() => onEdit(file.id)}
                className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                title="编辑文件名"
                disabled={file.uploading || file.uploaded}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
          )}
          
          {!file.uploading && !file.uploaded && (
            <button 
              onClick={() => onRemove(file.id)}
              className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
              title="移除"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        
        {/* 文件大小 */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {(file.file.size / 1024).toFixed(1)} KB
        </p>
        
        {/* 上传进度 */}
        {file.uploading && (
          <div className="mt-2">
            <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-1">
              <div 
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${file.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              上传中 {file.progress.toFixed(0)}%
            </p>
          </div>
        )}
        
        {/* 上传成功信息 */}
        {file.uploaded && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            上传成功 
            {file.imageId && (
              <Link 
                to={`/image/${file.imageId}`} 
                className="ml-2 underline"
              >
                查看
              </Link>
            )}
          </p>
        )}
        
        {/* 错误信息 */}
        {file.error && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            {file.error}
          </p>
        )}
      </div>
    </div>
  );
};

export default FilePreviewItem;
