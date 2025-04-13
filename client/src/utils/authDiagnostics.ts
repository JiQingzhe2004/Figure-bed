import axiosInstance from '../services/axiosInstance';

/**
 * 检查并诊断当前的认证状态
 * 可以在控制台中调用来辅助调试
 */
export const diagnosisAuth = async () => {
  console.group('认证状态诊断');
  
  // 检查本地存储的令牌
  const token = localStorage.getItem('authToken');
  console.log('localStorage中的token:', token ? '存在' : '不存在');
  
  if (token) {
    // 尝试解析令牌
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log('Token payload:', payload);
        console.log('用户角色:', payload.role);
        
        const expTime = new Date(payload.exp * 1000);
        console.log('令牌过期时间:', expTime.toLocaleString());
        console.log('是否已过期:', expTime < new Date());
      }
    } catch (error) {
      console.error('令牌解析失败:', error);
    }
    
    // 尝试调用debug接口
    try {
      const response = await axiosInstance.get('/api/auth/debug-token');
      console.log('服务器验证结果:', response.data);
    } catch (error: any) {
      console.error('服务器验证失败:', error.response?.data || error.message);
    }
  }
  
  console.groupEnd();
};

// 在开发环境中自动将函数挂载到window对象，方便在控制台调用
if (process.env.NODE_ENV === 'development') {
  (window as any).diagnosisAuth = diagnosisAuth;
}
