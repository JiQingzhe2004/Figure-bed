import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 dark:text-white">
      <Header />
      {/* 添加顶部内边距，确保内容不被顶部栏挡住 */}
      <main className="flex-grow py-6 mt-2">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
