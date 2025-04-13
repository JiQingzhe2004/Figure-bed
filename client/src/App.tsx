import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import { getApiBaseUrl, isLocalEnvironment, isMobileDevice } from './utils/apiUtils';

// 页面组件
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';
import UserImagePage from './pages/UserImagePage';
import ProfilePage from './pages/ProfilePage';
import ImageDetailPage from './pages/ImageDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// 管理员页面
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminImages from './pages/admin/AdminImages';
import AdminSettings from './pages/admin/AdminSettings';

// 认证保护路由
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

function App() {
  useEffect(() => {
    // 在应用启动时显示API配置信息
    console.info('====== 应用配置信息 =======');
    console.info('API 地址:', getApiBaseUrl());
    console.info('环境:', isLocalEnvironment() ? '本地访问' : '远程访问');
    console.info('设备:', isMobileDevice() ? '移动设备' : '桌面设备');
    console.info('===========================');
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <Header />
          <main className="container mx-auto py-6 px-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/image/:id" element={<ImageDetailPage />} />
              
              {/* 需要登录的路由 */}
              <Route path="/upload" element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              } />
              <Route path="/user/images" element={
                <ProtectedRoute>
                  <UserImagePage />
                </ProtectedRoute>
              } />
              <Route path="/user/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              {/* 管理员路由 */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="images" element={<AdminImages />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
