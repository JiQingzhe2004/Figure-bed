import axiosInstance from './axiosInstance';

// 获取网站设置
export const getSettings = async () => {
  try {
    const response = await axiosInstance.get('/api/settings');
    return response.data;
  } catch (error: any) {
    console.error('获取设置失败:', error);
    throw new Error('获取设置失败');
  }
};

// 更新设置（管理员）
export const updateSettings = async (settings: Record<string, string>) => {
  try {
    console.log('正在保存设置...');
    // 确保发送的数据格式为 { settings: { key1: value1, key2: value2, ... } }
    const response = await axiosInstance.post('/api/settings', { settings });
    console.log('设置保存成功:', response.data);
    return response.data;
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || '更新设置失败';
    console.error('更新设置失败:', errorMsg);
    throw new Error(errorMsg);
  }
};
