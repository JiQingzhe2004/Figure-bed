import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImage } from '../services/imageService';

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      setError('只能上传图片文件');
      return;
    }

    // 检查文件大小 (5MB限制)
    if (file.size > 5 * 1024 * 1024) {
      setError('文件大小不能超过5MB');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // 创建图片预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        setError('只能上传图片文件');
        return;
      }

      // 检查文件大小
      if (file.size > 5 * 1024 * 1024) {
        setError('文件大小不能超过5MB');
        return;
      }

      setSelectedFile(file);
      setError(null);

      // 创建图片预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('请选择要上传的图片');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await uploadImage(selectedFile, isPublic);
      
      // 上传成功后跳转到详情页
      navigate(`/image/${response.image.id}`);
    } catch (err: any) {
      setError(err.message || '上传失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">上传图片</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div 
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer mb-6"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <img 
            src={preview} 
            alt="预览" 
            className="max-h-64 mx-auto rounded-lg"
          />
        ) : (
          <div className="text-gray-500 dark:text-gray-400">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path 
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            <p className="mt-2">
              点击或拖拽图片到此处上传<br />
              <span className="text-sm text-gray-400 dark:text-gray-500">支持JPG、PNG、GIF等格式，最大5MB</span>
            </p>
          </div>
        )}
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="mb-6">
        <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
            className="form-checkbox h-4 w-4 text-blue-500 dark:text-blue-400"
          />
          <span>公开图片（所有人可见）</span>
        </label>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md disabled:opacity-50"
        >
          {loading ? '上传中...' : '上传图片'}
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
