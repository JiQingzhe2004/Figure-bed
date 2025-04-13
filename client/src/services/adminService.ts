import apiClient from './api';
import { ImageListResponse } from '../types/image';

// 获取仪表盘统计数据
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取统计数据失败');
  }
};

// 获取所有用户
export const getAllUsers = async (page: number = 1, perPage: number = 10) => {
  try {
    const response = await apiClient.get(`/admin/users?page=${page}&per_page=${perPage}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取用户数据失败');
  }
};

// 获取单个用户
export const getUserById = async (userId: number) => {
  try {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取用户数据失败');
  }
};

// 更新用户角色
export const updateUserRole = async (userId: number, role: string) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '更新用户角色失败');
  }
};

// 删除用户
export const deleteUser = async (userId: number) => {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '删除用户失败');
  }
};

// 获取所有图片（管理员）
export const getAllImages = async (page: number = 1, perPage: number = 12): Promise<ImageListResponse> => {
  try {
    const response = await apiClient.get<ImageListResponse>(`/admin/images?page=${page}&per_page=${perPage}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取图片数据失败');
  }
};

// 删除图片（管理员）
export const deleteImageAdmin = async (imageId: number) => {
  try {
    const response = await apiClient.delete(`/admin/images/${imageId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '删除图片失败');
  }
};
