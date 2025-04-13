/**
 * 文件处理工具函数
 */

// 分离文件名和扩展名
export const getFileNameAndExtension = (fullName: string | undefined): { name: string, extension: string } => {
  if (!fullName) {
    return { name: '', extension: '' };
  }
  const lastDotIndex = fullName.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return { name: fullName, extension: '' };
  }
  return {
    name: fullName.substring(0, lastDotIndex),
    extension: fullName.substring(lastDotIndex)
  };
};

// 生成唯一ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// 验证文件类型
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  if (allowedTypes.length === 0) return true;
  return allowedTypes.includes(file.type);
};
