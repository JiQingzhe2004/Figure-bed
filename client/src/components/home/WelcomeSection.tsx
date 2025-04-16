import React from 'react';
import { Link } from 'react-router-dom';

interface WelcomeSectionProps {
  username: string;
  imageCount: number;
  storageUsed: number;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ username, imageCount, storageUsed }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg overflow-hidden mb-10">
      <div className="relative p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-20 w-24 h-24 bg-blue-400 opacity-20 rounded-full translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-between">
          <div className="mb-6 md:mb-0 max-w-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">欢迎回来，{username || '用户'}！</h1>
            <p className="text-lg md:text-xl mb-4 text-blue-100">今天是个上传新图片的好日子，不是吗？</p>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/upload" className="bg-white text-blue-700 hover:bg-blue-50 font-medium py-2.5 px-6 rounded-lg shadow-md transition duration-300 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                </svg>
                上传新图片
              </Link>
              <Link to="/user/images" className="bg-blue-800 bg-opacity-50 hover:bg-opacity-70 text-white font-medium py-2.5 px-6 rounded-lg shadow-md transition duration-300 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                我的图库
              </Link>
            </div>
          </div>
          
          <div className="bg-blue-800 bg-opacity-30 rounded-xl p-5 backdrop-blur-sm">
            <h3 className="text-lg font-medium mb-3 text-center">您的统计</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">
                  {imageCount || 0}
                </div>
                <div className="text-sm text-blue-200">已上传图片</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {storageUsed ? (storageUsed / 1024 / 1024).toFixed(2) : 0} MB
                </div>
                <div className="text-sm text-blue-200">已用空间</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
