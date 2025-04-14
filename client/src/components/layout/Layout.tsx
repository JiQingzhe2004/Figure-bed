import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
// 尝试使用完整路径导入
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 dark:text-white">
      <Header />
      <main className="flex-grow py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
