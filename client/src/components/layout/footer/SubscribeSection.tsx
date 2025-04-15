import React from 'react';

const SubscribeSection: React.FC = () => {
  return (
    <div className="space-y-4 relative">
      <div className="absolute -left-3 top-0 w-1 h-12 bg-gradient-to-b from-blue-400 to-cyan-500 rounded-full"></div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center pl-2">
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        订阅通知
      </h3>
      <div className="pl-2">
        <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 relative overflow-hidden">
          {/* 装饰元素 */}
          <div className="absolute -right-5 -bottom-5 w-16 h-16 bg-blue-200 dark:bg-blue-700 rounded-full opacity-30"></div>
          <div className="absolute right-4 bottom-4 w-6 h-6 bg-cyan-300 dark:bg-cyan-600 rounded-full opacity-40"></div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 relative z-10">
            订阅我们的通讯，第一时间获取新功能和优质内容！
          </p>
          
          <form className="relative z-10">
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="w-full pl-4 pr-10 py-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 dark:text-white text-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-700/30"
              >
                立即订阅
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscribeSection;
