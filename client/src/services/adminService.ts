import axiosInstance from './axiosInstance';
import { ImageListResponse } from '../types/image';

// 获取仪表盘统计数据
export const getDashboardStats = async () => {
  try {
    // 修正API路径，添加/api前缀
    const response = await axiosInstance.get('/api/admin/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取统计数据失败');
  }
};

// 获取所有用户
export const getAllUsers = async (page: number = 1, perPage: number = 10) => {
  try {
    // 修正API路径，添加/api前缀
    const response = await axiosInstance.get(`/api/admin/users?page=${page}&per_page=${perPage}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取用户数据失败');
  }
};

// 获取单个用户
export const getUserById = async (userId: number) => {
  try {
    // 修正API路径，添加/api前缀
    const response = await axiosInstance.get(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取用户数据失败');
  }
};

// 更新用户角色
export const updateUserRole = async (userId: number, role: string) => {
  try {
    // 修正API路径，添加/api前缀
    const response = await axiosInstance.put(`/api/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '更新用户角色失败');
  }
};

// 删除用户
export const deleteUser = async (userId: number) => {
  try {
    // 修正API路径，添加/api前缀
    const response = await axiosInstance.delete(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '删除用户失败');
  }
};

// 获取所有图片（管理员）
export const getAllImages = async (page: number = 1, perPage: number = 12): Promise<ImageListResponse> => {
  try {
    // 修正API路径，添加/api前缀
    const response = await axiosInstance.get<ImageListResponse>(`/api/admin/images?page=${page}&per_page=${perPage}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取图片数据失败');
  }
};

// 删除图片（管理员）
export const deleteImageAdmin = async (imageId: number) => {
  try {
    // 修正API路径，添加/api前缀
    const response = await axiosInstance.delete(`/api/admin/images/${imageId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '删除图片失败');
  }
};

// 批量删除图片（管理员）
export const deleteImagesAdmin = async (imageIds: number[]) => {
  try {
    const response = await axiosInstance.delete('/api/admin/images', {
      data: { imageIds }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '批量删除图片失败');
  }
};
