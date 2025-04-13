import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/adminService';

interface StatsData {
  totalUsers: number;
  totalImages: number;
  publicImages: number;
  privateImages: number;
  totalStorage: number;
  storageFormatted: string;
}

interface ChartData {
  recentUsers: { date: string; count: number }[];
  recentImages: { date: string; count: number }[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data.stats);
        setChartData(data.charts);
      } catch (err: any) {
        setError(err.message || '获取统计数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
        <p className="font-bold">错误</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">仪表盘</h1>
      
      {/* 数据卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 mr-4">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">用户总数</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-300 mr-4">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">图片总数</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalImages || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-500 dark:text-yellow-300 mr-4">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">公开图片</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.publicImages || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-500 dark:text-purple-300 mr-4">
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">存储空间</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.storageFormatted || '0 B'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 活动数据 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">最近活动</h2>
        <p className="text-gray-600 dark:text-gray-400">
          最近7天共新增用户 {chartData?.recentUsers.reduce((sum, item) => sum + item.count, 0) || 0} 名，
          新增图片 {chartData?.recentImages.reduce((sum, item) => sum + item.count, 0) || 0} 张。
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">图片统计</h2>
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-500 dark:text-blue-400">{stats?.publicImages || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">公开图片</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-purple-500 dark:text-purple-400">{stats?.privateImages || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">私密图片</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">快速操作</h2>
          <div className="flex flex-wrap gap-4">
            <a href="/admin/users" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-4 rounded-md">
              管理用户
            </a>
            <a href="/admin/images" className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center py-3 px-4 rounded-md">
              管理图片
            </a>
            <a href="/admin/settings" className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-center py-3 px-4 rounded-md">
              网站设置
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
