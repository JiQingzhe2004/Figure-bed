import { useState } from 'react';
import { uploadImage } from '../services/imageService';
import { getFileNameAndExtension, generateId } from '../utils/fileUtils';

export interface FileWithPreview {
  file: File;  // 存储原始文件
  id: string;
  preview: string;
  progress: number;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  imageId?: number;
  editedName?: string;
  isEditing?: boolean;
  originalName: string;
  originalExtension: string;
}

export const useFileUpload = (isPublic: boolean) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typeWarning, setTypeWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  // 处理文件，添加预览和状态
  const processFiles = (selectedFiles: File[], allowedTypes: string[]) => {
    setError(null);
    setTypeWarning(null);

    if (selectedFiles.length === 0) return [];

    if (allowedTypes.length > 0) {
      const invalidFiles = selectedFiles.filter(file => !allowedTypes.includes(file.type));
      if (invalidFiles.length > 0) {
        setTypeWarning(`以下文件类型不支持: ${invalidFiles.map(f => f.type).join(', ')}`);
        const validFiles = selectedFiles.filter(file => allowedTypes.includes(file.type));
        if (validFiles.length === 0) return [];
      }
    }

    const filesWithPreviews = selectedFiles.map(file => {
      const { name, extension } = getFileNameAndExtension(file.name);

      // 创建新的 FileWithPreview 对象，不再继承 Blob
      const fileWithPreview: FileWithPreview = {
        file,  // 保存原始 File 对象
        id: generateId(),
        preview: URL.createObjectURL(file),
        progress: 0,
        uploading: false,
        uploaded: false,
        originalName: file.name,
        originalExtension: extension,
        editedName: file.name,
        isEditing: false
      };

      return fileWithPreview;
    });

    return filesWithPreviews;
  };

  // 添加新的文件到队列中
  const addFiles = (newFiles: FileWithPreview[]) => {
    if (newFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  // 文件名称编辑功能
  const startEditing = (id: string) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, isEditing: true } : f
    ));
  };

  // 保存文件名 - 修复扩展名问题
  const saveFileName = (id: string, newBaseName: string) => {
    setFiles(prev => {
      return prev.map(f => {
        if (f.id === id) {
          const baseName = newBaseName.trim() || getFileNameAndExtension(f.originalName).name;
          const finalFileName = baseName + f.originalExtension;
          return { 
            ...f, 
            editedName: finalFileName,
            isEditing: false 
          };
        }
        return f;
      });
    });
  };

  // 实时文件名变更处理 - 修复实时预览问题
  const handleFileNameChange = (id: string, newBaseName: string) => {
    setFiles(prev => {
      return prev.map(f => {
        if (f.id === id) {
          const finalFileName = newBaseName + f.originalExtension;
          return { ...f, editedName: finalFileName };
        }
        return f;
      });
    });
  };

  // 文件管理功能
  const removeFile = (id: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(file => file.id !== id);
      const fileToRemove = prev.find(file => file.id === id);
      if (fileToRemove && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return newFiles;
    });
  };

  const clearAllFiles = () => {
    files.forEach(file => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
    setError(null);
    setSuccess(false);
    setUploadedImages([]);
  };

  // 上传功能
  const uploadSingleFile = async (fileWithPreview: FileWithPreview): Promise<any> => {
    setFiles(prev => prev.map(f => 
      f.id === fileWithPreview.id ? { ...f, uploading: true } : f
    ));

    try {
      const formData = new FormData();

      if (fileWithPreview.editedName && fileWithPreview.editedName !== fileWithPreview.originalName) {

        const newFile = new File([fileWithPreview.file], fileWithPreview.editedName, { 
          type: fileWithPreview.file.type,
          lastModified: fileWithPreview.file.lastModified 
        });
        formData.append('image', newFile);
      } else {
        formData.append('image', fileWithPreview.file);
      }

      formData.append('is_public', isPublic.toString());

      const response = await uploadImage(formData, (progress) => {
        setFiles(prev => prev.map(f => 
          f.id === fileWithPreview.id ? { ...f, progress } : f
        ));
      });

      setFiles(prev => prev.map(f => 
        f.id === fileWithPreview.id ? { 
          ...f, 
          uploading: false, 
          uploaded: true,
          imageId: response.image.id
        } : f
      ));

      return response.image;
    } catch (err: any) {
      setFiles(prev => prev.map(f => 
        f.id === fileWithPreview.id ? { 
          ...f, 
          uploading: false, 
          error: err.message || '上传失败' 
        } : f
      ));
      throw err;
    }
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      setError('请先选择要上传的图片');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const results: any[] = [];
    const failedFiles: FileWithPreview[] = [];

    const uploadBatch = async (startIndex: number, batchSize: number) => {
      const batch = files.slice(startIndex, startIndex + batchSize)
        .filter(file => !file.uploaded && !file.uploading);

      if (batch.length === 0) return;

      try {
        const uploadPromises = batch.map(file => uploadSingleFile(file)
          .then(image => {
            results.push(image);
            return { success: true, file, image };
          })
          .catch(err => {
            failedFiles.push(file);
            return { success: false, file, error: err };
          })
        );

        await Promise.all(uploadPromises);

        if (startIndex + batchSize < files.length) {
          await uploadBatch(startIndex + batchSize, batchSize);
        }
      } catch (err) {
        throw err;
      }
    };

    try {
      await uploadBatch(0, 3);

      if (results.length > 0) {
        setUploadedImages(results);
        setSuccess(true);
      }

      if (failedFiles.length > 0) {
        setError(`${failedFiles.length}个文件上传失败`);
      }
    } catch (err: any) {
      setError(err.message || '上传过程出错');
    } finally {
      setLoading(false);
    }
  };

  return {
    files,
    setFiles,
    loading, 
    error,
    typeWarning,
    success,
    uploadedImages,
    processFiles,
    addFiles,
    startEditing,
    saveFileName,
    handleFileNameChange,
    removeFile,
    clearAllFiles,
    uploadFiles
  };
};
