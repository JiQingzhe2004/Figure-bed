import axiosInstance from './axiosInstance';
import { ImageResponse, ImageListResponse, ImageData } from '../types/image';
import { AxiosRequestConfig } from 'axios';

export const uploadImage = async (formData: FormData, onProgress?: (progress: number) => void): Promise<ImageResponse> => {
  try {
    // 检查和记录上传内容，帮助调试
    const imageFile = formData.get('image') as File;
    if (!imageFile) {
      console.error('表单数据中没有找到image文件');
      throw new Error('上传准备不完整：未选择图片文件');
    }
    
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000
    };

    if (onProgress) {
      axiosConfig.onUploadProgress = (progressEvent: any) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        onProgress(percentCompleted);
      };
    }

    const response = await axiosInstance.post<ImageResponse>('/api/images/upload', formData, axiosConfig);
    return response.data;
  } catch (error: any) {
    console.error('上传图片失败:', error);
    
    if (error.response) {
      console.error('服务器错误状态:', error.response.status);
      console.error('服务器错误数据:', error.response.data);
    } else if (error.request) {
      console.error('没有收到服务器响应');
    } else {
      console.error('请求配置错误:', error.message);
    }
    
    if (error.response?.status === 413) {
      throw new Error('图片太大，请上传小于10MB的图片');
    }
    throw new Error(error.response?.data?.message || '上传图片失败，请重试');
  }
};

export const getUserImages = async (page: number = 1, perPage: number = 20): Promise<ImageListResponse> => {
  try {
    const response = await axiosInstance.get<ImageListResponse>(`/api/images/my-images?page=${page}&per_page=${perPage}`);
    return response.data;
  } catch (error: any) {
    console.error('获取用户图片失败:', error);
    throw new Error(error.response?.data?.message || '获取用户图片失败');
  }
};

export const getPublicImages = async (page: number = 1, perPage: number = 12): Promise<ImageListResponse> => {
    try {
        const response = await axiosInstance.get<ImageListResponse>(`/api/images/public?page=${page}&per_page=${perPage}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取公开图片失败');
    }
};

export const getImageById = async (id: number): Promise<ImageData> => {
    try {
        const response = await axiosInstance.get<{ image: ImageData }>(`/api/images/${id}`);
        return response.data.image;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取图片失败');
    }
};

export const deleteImage = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/api/images/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '删除图片失败');
    }
};

export const toggleImagePublicStatus = async (id: number): Promise<boolean> => {
    try {
        const response = await axiosInstance.patch<{ is_public: boolean }>(`/api/images/${id}/toggle-public`);
        return response.data.is_public;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '更新图片状态失败');
    }
};
