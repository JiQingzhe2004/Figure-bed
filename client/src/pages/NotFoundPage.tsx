import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">页面未找到</p>
      <p className="text-gray-500 dark:text-gray-500 mb-8 text-center">
        抱歉，您请求的页面不存在或已被移动
      </p>
      <Link 
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
      >
        返回首页
      </Link>
    </div>
  );
};

export default NotFoundPage;
