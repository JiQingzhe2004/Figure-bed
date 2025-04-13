import apiClient from './api';
import { ImageResponse, ImageListResponse, ImageData } from '../types/image';

export const uploadImage = async (file: File, isPublic: boolean = true): Promise<ImageResponse> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('is_public', isPublic.toString());
    
    try {
        console.log('开始上传图片...');
        console.log('图片大小:', (file.size / 1024).toFixed(2) + ' KB');
        console.log('图片类型:', file.type);
        
        // 获取当前 token，确保在请求中包含
        const token = localStorage.getItem('authToken');
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await apiClient.post<ImageResponse>('/images/upload', formData, {
            headers: {
                ...headers,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log('上传成功，接收到响应:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('上传图片失败:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || '上传图片失败');
    }
};

export const getUserImages = async (page: number = 1, perPage: number = 12): Promise<ImageListResponse> => {
    try {
        const response = await apiClient.get<ImageListResponse>(`/images/my-images?page=${page}&per_page=${perPage}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取图片失败');
    }
};

export const getPublicImages = async (page: number = 1, perPage: number = 12): Promise<ImageListResponse> => {
    try {
        const response = await apiClient.get<ImageListResponse>(`/images/public?page=${page}&per_page=${perPage}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取公开图片失败');
    }
};

export const getImageById = async (id: number): Promise<ImageData> => {
    try {
        const response = await apiClient.get<{ image: ImageData }>(`/images/${id}`);
        return response.data.image;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取图片失败');
    }
};

export const deleteImage = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(`/images/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '删除图片失败');
    }
};

export const toggleImagePublicStatus = async (id: number): Promise<boolean> => {
    try {
        const response = await apiClient.patch<{ is_public: boolean }>(`/images/${id}/toggle-public`);
        return response.data.is_public;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '更新图片状态失败');
    }
};
