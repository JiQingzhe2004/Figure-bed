import React from 'react';
import { Link } from 'react-router-dom';

interface WelcomeSectionProps {
  username: string;
  imageCount: number;
  storageUsed: number;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ username, imageCount, storageUsed }) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-blue-400/20">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/3 translate-x-1/3 blur-xl"></div>
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-blue-300 opacity-20 rounded-full translate-y-1/2 blur-md"></div>
        <div className="absolute top-1/3 left-10 w-16 h-16 bg-purple-400 opacity-20 rounded-full blur-sm"></div>
        <div className="absolute right-1/4 bottom-0 w-40 h-20 bg-gradient-to-t from-blue-400 to-transparent opacity-20 rounded-full transform rotate-45 translate-y-1/2"></div>
        
        {/* 点状图案装饰 */}
        <div className="absolute inset-0 bg-repeat opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <div className="relative p-8 md:p-10">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-between">
          <div className="mb-8 md:mb-0 max-w-lg">
            <div className="flex items-center mb-2">
              <div className="w-10 h-1 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full mr-3"></div>
              <span className="text-blue-100 font-medium tracking-wide">个人仪表板</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              欢迎回来，{username || '用户'}！
            </h1>
            <p className="text-lg md:text-xl mb-6 text-blue-100 opacity-90">今天是个上传新图片的好日子，不是吗？</p>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/upload" className="group bg-white hover:bg-blue-50 text-blue-700 font-medium py-2.5 px-6 rounded-xl shadow-md transition-all duration-300 flex items-center hover:shadow-lg hover:translate-y-[-2px]">
                <div className="mr-2 bg-blue-500 group-hover:bg-blue-600 text-white p-1.5 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                </div>
                上传新图片
              </Link>
              <Link to="/user/images" className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium py-2.5 px-6 rounded-xl border border-white/20 transition-all duration-300 flex items-center hover:shadow-lg hover:translate-y-[-2px]">
                <div className="mr-2 bg-white/20 text-white p-1.5 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                我的图库
              </Link>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 shadow-inner border border-white/10">
            <h3 className="text-base font-medium mb-5 text-center flex items-center justify-center">
              <svg className="w-4 h-4 mr-2 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              您的数据统计
            </h3>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="relative overflow-hidden bg-white/5 p-4 rounded-xl border border-white/10 transition-all hover:bg-white/10 hover:border-white/20">
                <div className="text-3xl font-bold text-white">
                  {imageCount || 0}
                </div>
                <div className="text-sm text-blue-200 mt-1">已上传图片</div>
              </div>
              <div className="relative overflow-hidden bg-white/5 p-4 rounded-xl border border-white/10 transition-all hover:bg-white/10 hover:border-white/20">
                <div className="text-3xl font-bold text-white">
                  {storageUsed ? (storageUsed / 1024 / 1024).toFixed(2) : 0} MB
                </div>
                <div className="text-sm text-blue-200 mt-1">已用空间</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
