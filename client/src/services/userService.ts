import axiosInstance from './axiosInstance';

// 上传用户头像
export const uploadAvatar = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await axiosInstance.post('/api/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '头像上传失败');
  }
};

// 更新用户密码
export const updatePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await axiosInstance.put('/api/auth/password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '密码更新失败');
  }
};

// 获取用户统计数据
export const getUserStats = async () => {
  try {
    const response = await axiosInstance.get('/api/user/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取用户统计数据失败');
  }
};
