/**
 * 文件工具函数
 */

/**
 * 从文件名获取扩展名
 * @param filename 文件名
 * @returns 扩展名 (包括点号，如 '.jpg')
 */
export const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';
};

/**
 * 从文件名获取基础名称（不含扩展名）
 * @param filename 文件名
 * @returns 基础名称
 */
export const getFileBaseName = (filename: string): string => {
  const extension = getFileExtension(filename);
  return filename.substring(0, filename.length - extension.length);
};

/**
 * 格式化文件大小
 * @param bytes 文件字节大小
 * @returns 格式化后的大小字符串 (例如：'1.23 MB')
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 创建缩略图文件名
 * @param filename 原始文件名
 * @returns 缩略图文件名
 */
export const createThumbnailFilename = (filename: string): string => {
  const extension = getFileExtension(filename);
  const baseName = getFileBaseName(filename);
  return `${baseName}_thumb${extension}`;
};

/**
 * 检查文件类型是否为图片
 * @param file 文件对象
 * @returns 是否为图片
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};
