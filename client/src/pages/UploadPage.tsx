import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { uploadImage } from '../services/imageService';
import { useAuth } from '../context/AuthContext';
import { getSettings } from '../services/settingService';

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [customFileName, setCustomFileName] = useState<string>('');
  const [originalFileName, setOriginalFileName] = useState<string>('');
  const [allowedTypes, setAllowedTypes] = useState<string[]>([]);
  const [typeWarning, setTypeWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await getSettings();
        const settings = response.settings || {};
        
        if (settings.allowed_file_types) {
          setAllowedTypes(settings.allowed_file_types.split(','));
        }
      } catch (err) {
        console.error('加载设置失败:', err);
        setAllowedTypes(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
      }
    };
    
    loadSettings();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setTypeWarning(null);
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      setCustomFileName('');
      setOriginalFileName('');
      return;
    }
    
    if (allowedTypes.length > 0 && !allowedTypes.includes(selectedFile.type)) {
      setTypeWarning(`警告: 文件类型 "${selectedFile.type}" 不在管理员设置的允许列表中。上传可能会失败或被系统拒绝。`);
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('文件大小不能超过10MB');
      return;
    }
    
    setFile(selectedFile);
    setOriginalFileName(selectedFile.name);
    setCustomFileName(selectedFile.name);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };
  
  const handleUpload = async () => {
    if (!file) {
      setError('请先选择要上传的图片');
      return;
    }
    
    if (!user) {
      setError('请先登录');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const renamedFile = new File([file], customFileName, { type: file.type });
      
      const response = await uploadImage(renamedFile, isPublic);
      setSuccess(true);
      setUploadedImage(response.image);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFile(null);
      
    } catch (err: any) {
      setError(err.message || '上传图片失败');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setCustomFileName('');
    setOriginalFileName('');
    setUploadedImage(null);
    setSuccess(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const getFileExtension = (filename: string): string => {
    return filename.substring(filename.lastIndexOf('.') || filename.length);
  };
  
  const getThumbnailFileName = (filename: string): string => {
    const ext = getFileExtension(filename);
    const baseName = filename.substring(0, filename.length - ext.length);
    return `${baseName}_thumb${ext}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">上传图片</h1>
      
      <div className="max-w-xl mx-auto">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
            <p className="font-bold">错误</p>
            <p>{error}</p>
          </div>
        )}
        
        {typeWarning && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-5" role="alert">
            <p className="font-bold">警告</p>
            <p>{typeWarning}</p>
          </div>
        )}
        
        {success && uploadedImage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-5">
            <p className="font-bold">上传成功！</p>
            <p className="mb-2">图片已成功上传。</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Link 
                to={`/image/${uploadedImage.id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
              >
                查看图片
              </Link>
              <button 
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded"
              >
                继续上传
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          {preview && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">图片预览：</p>
              <div className="relative">
                <img 
                  src={preview} 
                  alt="预览" 
                  className="w-full h-auto max-h-72 object-contain rounded border border-gray-300 dark:border-gray-600" 
                />
                <div className="mt-2 text-sm text-gray-500">
                  <div><span className="font-medium">原始文件名：</span> {originalFileName}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              选择图片文件：
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept={allowedTypes.length > 0 ? allowedTypes.join(',') : 'image/*'}
              className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 w-full text-gray-500 dark:text-gray-400"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              支持{allowedTypes.length > 0 ? allowedTypes.map(t => t.replace('image/', '')).join(', ').toUpperCase() : 'JPG, PNG, GIF, WEBP'} 格式，最大10MB
            </p>
          </div>
          
          {file && (
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                自定义文件名（可选）：
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={customFileName.substring(0, customFileName.lastIndexOf('.')) || ''}
                  onChange={(e) => {
                    const ext = getFileExtension(originalFileName);
                    setCustomFileName(`${e.target.value}${ext}`);
                  }}
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l p-2 dark:bg-gray-700 dark:text-white"
                  placeholder="输入新文件名（不包括扩展名）"
                />
                <span className="bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-3 py-2 border border-gray-300 dark:border-gray-600 border-l-0 rounded-r">
                  {getFileExtension(originalFileName)}
                </span>
              </div>
              {customFileName && (
                <div className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <p>最终文件名：{customFileName}</p>
                  <p>缩略图文件名：{getThumbnailFileName(customFileName)}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                公开图片（所有人可见）
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`px-4 py-2 rounded font-medium ${
                !file || loading 
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  正在上传...
                </>
              ) : '上传图片'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
