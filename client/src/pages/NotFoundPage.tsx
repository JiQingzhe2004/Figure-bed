import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-blue-500 dark:text-blue-400 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">页面未找到</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        您访问的页面不存在或已被移除。请检查URL是否正确，或返回首页继续浏览。
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition duration-300"
      >
        返回首页
      </Link>
    </div>
  );
};

export default NotFoundPage;
