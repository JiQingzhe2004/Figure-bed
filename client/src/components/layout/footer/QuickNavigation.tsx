import React from 'react';
import { Link } from 'react-router-dom';

interface QuickNavigationProps {
  isAuthenticated: boolean;
}

const QuickNavigation: React.FC<QuickNavigationProps> = ({ isAuthenticated }) => {
  return (
    <div className="space-y-4 relative">
      <div className="absolute -left-3 top-0 w-1 h-12 bg-gradient-to-b from-green-400 to-teal-500 rounded-full"></div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center pl-2">
        <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        快速导航
      </h3>
      <div className="grid grid-cols-2 gap-4 pl-2">
        <Link to="/" className="group">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl hover:shadow-md transition-all group-hover:translate-y-[-3px]">
            <div className="flex items-center">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg mr-3 shadow-sm">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">首页</span>
            </div>
          </div>
        </Link>
        
        <Link to="/upload" className="group">
          <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-xl hover:shadow-md transition-all group-hover:translate-y-[-3px]">
            <div className="flex items-center">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg mr-3 shadow-sm">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">上传图片</span>
            </div>
          </div>
        </Link>
        
        <Link to="/public-images" className="group">
          <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-xl hover:shadow-md transition-all group-hover:translate-y-[-3px]">
            <div className="flex items-center">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg mr-3 shadow-sm">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">公开图库</span>
            </div>
          </div>
        </Link>
        
        {/* 根据登录状态显示不同的选项 */}
        {isAuthenticated ? (
          // 已登录用户显示"我的图片"
          <Link to="/user/images" className="group">
            <div className="p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30 rounded-xl hover:shadow-md transition-all group-hover:translate-y-[-3px]">
              <div className="flex items-center">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg mr-3 shadow-sm">
                  <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">我的图片</span>
              </div>
            </div>
          </Link>
        ) : (
          // 未登录用户显示"登录/注册"
          <Link to="/login" className="group">
            <div className="p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30 rounded-xl hover:shadow-md transition-all group-hover:translate-y-[-3px]">
              <div className="flex items-center">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg mr-3 shadow-sm">
                  <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">登录/注册</span>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuickNavigation;
