import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { uploadAvatar } from '../services/userService';
import axiosInstance from '../services/axiosInstance';

const ProfilePage: React.FC = () => {
  const { user, updateCurrentUser } = useAuth();
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    if (formData.newPassword !== formData.confirmPassword) {
      setError('新密码与确认密码不匹配');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setError('新密码长度不能少于6个字符');
      return;
    }
    
    // 实现密码更新功能
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/user/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      if (response.data.success) {
        setPasswordUpdated(true);
        setError(null);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(response.data.message || '密码更新失败');
      }
    } catch (err: any) {
      console.error('密码修改错误:', err);
      
      if (err.message === 'Network Error') {
        setError('网络错误，请确认API服务器是否正在运行');
      } else if (err.response?.status === 404) {
        setError('找不到修改密码的API端点，请联系管理员确认API路径');
      } else if (err.response?.status === 401) {
        setError('认证失败，请重新登录');
      } else if (err.response?.status === 403) {
        setError('您没有权限执行此操作');
      } else {
        setError(err.response?.data?.message || err.message || '密码更新失败');
      }
    } finally {
      setLoading(false);
    }
  };

  // 处理头像上传
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      setAvatarError('请上传图片文件');
      return;
    }
    
    // 验证文件大小 (5MB限制)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('图片大小不能超过5MB');
      return;
    }
    
    try {
      setUploadingAvatar(true);
      setAvatarError(null);
      
      const response = await uploadAvatar(file);
      
      // 更新上下文中的用户信息
      if (user && updateCurrentUser) {
        updateCurrentUser({
          ...user,
          avatar_path: response.avatar_url // 使用avatar_path替代avatar_url
        });
      }
    } catch (err: any) {
      setAvatarError(err.message || '上传头像失败');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">个人资料</h1>
      </div>
      
      {/* 用户信息卡片 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            {/* 添加头像上传功能 */}
            <div 
              onClick={handleAvatarClick} 
              className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group"
            >
              {(user?.avatar_path || user?.avatar_url) ? (
                <img 
                  src={user.avatar_path || user.avatar_url} 
                  alt={user.username} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = `https://ui-avatars.com/api/?name=${user.username}&background=random`;
                  }} 
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.username?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm">更换头像</span>
              </div>
              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleAvatarChange} 
            />
            {avatarError && (
              <p className="mt-2 text-sm text-red-500">{avatarError}</p>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.username}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{user?.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              用户角色: {user?.role === 'admin' ? '管理员' : '普通用户'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              注册时间: {user?.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : '未知'}
            </p>
          </div>
        </div>
      </div>
      
      {/* 修改密码表单 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">修改密码</h2>
        
        {passwordUpdated && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
            <p>密码已成功更新</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="currentPassword">
              当前密码
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="newPassword">
              新密码
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={6}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
              确认新密码
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={6}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? '提交中...' : '更新密码'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
