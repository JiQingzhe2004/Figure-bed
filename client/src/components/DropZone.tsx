import React, { useRef, useState } from 'react';

interface DropZoneProps {
  onFilesDrop: (files: File[]) => void;
  acceptedTypes?: string[];
}

const DropZone: React.FC<DropZoneProps> = ({ onFilesDrop, acceptedTypes = [] }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
      onFilesDrop(imageFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFiles = Array.from(e.target.files);
    onFilesDrop(selectedFiles);
  };
  
  const acceptString = acceptedTypes.length > 0 ? acceptedTypes.join(',') : 'image/*';
  const supportedFormats = acceptedTypes.length > 0 
    ? acceptedTypes.map(t => t.replace('image/', '')).join(', ').toUpperCase() 
    : 'JPG, PNG, GIF, WEBP';
  
  return (
    <div
      className={`mb-6 border-2 border-dashed rounded-lg p-6 text-center transition-colors
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
        }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <div className="text-gray-700 dark:text-gray-300">
          <p className="font-medium">拖放图片文件到这里上传</p>
          <p className="text-sm">或者</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          type="button"
        >
          选择图片
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptString}
          multiple
          className="hidden"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          支持 {supportedFormats} 格式，最大10MB，支持批量上传
        </p>
      </div>
    </div>
  );
};

export default DropZone;
