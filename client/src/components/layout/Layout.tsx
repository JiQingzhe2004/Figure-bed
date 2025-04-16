import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 dark:text-white">
      <Header />
      {/* 添加足够的顶部内边距，确保内容不被固定的顶部栏遮挡 */}
      <main className="flex-grow py-6 pt-20 md:pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
