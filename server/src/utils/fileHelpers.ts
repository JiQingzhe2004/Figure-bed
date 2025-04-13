/**
 * 文件处理辅助函数
 */

/**
 * 清理并规范化文件名，处理编码问题
 * @param fileName 原始文件名
 * @returns 清理后的文件名
 */
export const sanitizeFileName = (fileName: string): string => {
  try {
    // 尝试处理中文或其他特殊字符编码问题
    const decodedFileName = decodeURIComponent(escape(fileName));
    
    // 移除不安全的文件名字符
    let sanitized = decodedFileName
      .replace(/[/\\?%*:|"<>]/g, '-') // 替换文件系统不允许的字符
      .trim();
    
    // 如果处理后文件名为空，使用时间戳作为文件名
    if (!sanitized || sanitized === '.') {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const extension = fileName.includes('.') 
        ? fileName.substring(fileName.lastIndexOf('.')) 
        : '';
      
      sanitized = `image-${timestamp}${extension}`;
    }
    
    console.log('清理文件名:', fileName, '=>', sanitized);
    return sanitized;
  } catch (error) {
    console.error('文件名清理错误:', error);
    // 出错时，使用时间戳创建安全的文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = fileName.includes('.') 
      ? fileName.substring(fileName.lastIndexOf('.')) 
      : '';
    
    return `image-${timestamp}${extension}`;
  }
};
