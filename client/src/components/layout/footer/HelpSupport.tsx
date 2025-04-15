import React from 'react';
import { Link } from 'react-router-dom';

const HelpSupport: React.FC = () => {
  return (
    <div className="space-y-4 relative">
      <div className="absolute -left-3 top-0 w-1 h-12 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center pl-2">
        <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        帮助与支持
      </h3>
      <div className="pl-2">
        <ul className="space-y-3">
          {['常见问题', '使用条款', '隐私政策', '联系我们'].map((item, index) => (
            <li key={index} className="group">
              <Link 
                to={['faq', 'terms-of-service', 'privacy-policy', '#contact'][index]} 
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
              >
                <span className="w-6 h-6 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full mr-2 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors">
                  <svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                {item}
                <span className="ml-auto transform translate-x-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="mt-6 px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-100 dark:border-purple-800/20">
          <p className="text-xs text-purple-800 dark:text-purple-300">
            <span className="font-bold">图床代码:</span> 周一至周五 9:00-18:00不带写的-周六日休息
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
