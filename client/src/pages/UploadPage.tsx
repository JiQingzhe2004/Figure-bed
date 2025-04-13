import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSettings } from '../services/settingService';
import { useFileUpload, FileWithPreview } from '../hooks/useFileUpload';
import DropZone from '../components/DropZone';
import FilePreviewItem from '../components/FilePreviewItem';

const UploadPage: React.FC = () => {
  const [isPublic, setIsPublic] = useState(true);
  const [allowedTypes, setAllowedTypes] = useState<string[]>([]);
  
  // 使用自定义钩子管理文件上传
  const {
    files,
    loading,
    error,
    typeWarning,
    success,
    uploadedImages,
    processFiles,
    addFiles, // 使用新添加的方法
    startEditing,
    saveFileName,
    handleFileNameChange,
    removeFile,
    clearAllFiles,
    uploadFiles
  } = useFileUpload(isPublic);
  
  // 获取应用设置
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { settings } = await getSettings();
        if (settings.allowed_file_types) {
          const types = settings.allowed_file_types.split(',').map((type: string) => type.trim());
          setAllowedTypes(types);
        }
      } catch (err) {
        console.error('获取设置失败:', err);
      }
    };

    fetchSettings();
  }, []);
  
  // 处理文件拖放
  const handleFilesDrop = (droppedFiles: File[]) => {
    const processedFiles = processFiles(droppedFiles, allowedTypes);
    if (processedFiles.length > 0) {
      addFiles(processedFiles); // 使用addFiles而不是setFiles
    }
  };
  
  // 重置表单
  const resetForm = () => {
    clearAllFiles();
    setIsPublic(true);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">上传图片</h1>
      <div className="max-w-xl mx-auto">
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
            <p className="font-bold">错误</p>
            <p>{error}</p>
          </div>
        )}
        
        {/* 警告提示 */}
        {typeWarning && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-5" role="alert">
            <p className="font-bold">警告</p>
            <p>{typeWarning}</p>
          </div>
        )}
        
        {/* 成功提示 */}
        {success && uploadedImages.length > 0 && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-5">
            <p className="font-bold">上传成功！</p>
            <p className="mb-2">已成功上传 {uploadedImages.length} 张图片。</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Link
                to={`/image/${uploadedImages[0].id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
              >
                查看第一张图片
              </Link>
              <Link
                to="/user/images"
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
              >
                查看我的图片
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
          {/* 拖放区域组件 */}
          <DropZone 
            onFilesDrop={handleFilesDrop}
            acceptedTypes={allowedTypes}
          />
          
          {/* 文件列表 */}
          {files.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700 dark:text-gray-300">已选择 {files.length} 个文件</h3>
                <button 
                  onClick={clearAllFiles}
                  className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  清除全部
                </button>
              </div>
              <div className="space-y-4 mt-3 max-h-96 overflow-y-auto p-2">
                {files.map(file => (
                  <FilePreviewItem
                    key={file.id}
                    file={file}
                    onEdit={startEditing}
                    onSave={saveFileName}
                    onChange={handleFileNameChange}
                    onRemove={removeFile}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* 公开设置 */}
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
          
          {/* 上传按钮 */}
          <div className="flex justify-end">
            <button
              onClick={uploadFiles}
              disabled={files.length === 0 || loading}
              className={`px-4 py-2 rounded font-medium ${
                files.length === 0 || loading 
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
              ) : files.length > 0 ? `上传 ${files.length} 个文件` : '上传图片'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
