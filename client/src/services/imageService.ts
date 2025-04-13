import axiosInstance from './axiosInstance';
import { ImageResponse, ImageListResponse, ImageData } from '../types/image';

export const uploadImage = async (file: File, isPublic: boolean = true): Promise<ImageResponse> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('is_public', isPublic.toString());
  
  try {
    console.log('开始上传图片...');
    console.log('图片大小:', (file.size / 1024).toFixed(2) + ' KB');
    console.log('图片类型:', file.type);
    
    // 增加调试信息
    console.log('文件名:', file.name);
    console.log('上传端点:', '/api/images/upload');
    
    const response = await axiosInstance.post<ImageResponse>('/api/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000, // 增加上传超时时间为30秒
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || file.size));
        console.log(`上传进度: ${percentCompleted}%`);
      }
    });
    
    console.log('上传成功!', response.data);
    return response.data;
  } catch (error: any) {
    console.error('上传图片失败:', error);
    
    // 增强错误日志
    if (error.response) {
      // 服务器返回了错误响应
      console.error('服务器错误状态:', error.response.status);
      console.error('服务器错误数据:', error.response.data);
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('没有收到服务器响应');
    } else {
      // 设置请求时发生了错误
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
