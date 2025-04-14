import axiosInstance from './axiosInstance';

// 获取公开统计数据
export const getPublicStats = async () => {
  try {
    const response = await axiosInstance.get('/api/stats/public');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取统计数据失败');
  }
};
