/**
 * 处理文件名，确保它们可以安全存储在数据库中
 */
export const sanitizeFileName = (originalName: string): string => {
  try {
    // 解码URL编码的文件名
    const decodedName = decodeURIComponent(originalName);
    
    // 第一种方法：替换特殊字符
    return decodedName
      .replace(/[^\w\s\u4e00-\u9fa5\u0800-\u4e00.-]/g, '')  // 保留字母、数字、中文、日文和一些特定字符
      .trim()
      .substring(0, 200);  // 限制长度
      
    // 另一种方法：完全重命名
    // const ext = path.extname(originalName);
    // const timestamp = new Date().getTime();
    // return `file_${timestamp}${ext}`;
  } catch (error) {
    // 如果解码失败，返回一个安全的替代名称
    const timestamp = new Date().getTime();
    return `file_${timestamp}`;
  }
};
