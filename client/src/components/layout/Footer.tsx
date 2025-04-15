import React, { useState, useEffect } from 'react';
import { getSettings } from '../../services/settingService';
import { useAuth } from '../../context/AuthContext';

// 导入子组件
import FooterBackground from './footer/FooterBackground'; // 页脚背景装饰组件，包含几何图形和波浪效果
import AboutSection from './footer/AboutSection';         // 关于我们部分，包含网站介绍和社交媒体链接
import QuickNavigation from './footer/QuickNavigation';   // 快速导航部分，提供主要功能入口链接
import HelpSupport from './footer/HelpSupport';           // 帮助与支持部分，提供帮助相关资源链接
import SubscribeSection from './footer/SubscribeSection'; // 订阅通知部分，提供邮件订阅功能
import FooterBottom from './footer/FooterBottom';         // 页脚底部部分，包含版权信息和附加链接

const Footer: React.FC = () => {
  const [siteName, setSiteName] = useState('我的图床');
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth(); // 获取用户登录状态
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { settings } = await getSettings();
        if (settings.site_name) {
          setSiteName(settings.site_name);
        }
      } catch (error) {
        console.error('获取网站设置失败:', error);
      }
    };

    fetchSettings();
  }, []);

  const year = new Date().getFullYear();
  
  return (
    <>
      {/* 桌面版底部 */}
      <footer 
        className="bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/40 shadow-xl border-t border-blue-100 dark:border-blue-900/30 mt-auto pt-16 pb-10 relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 几何背景元素 */}
        <FooterBackground isHovered={isHovered} />
        
        {/* 内容容器 */}
        <div className="container mx-auto px-4 relative z-10">
          {/* 顶部Logo和品牌 */}
          <div className="flex flex-col items-center mb-12">
            <div className="mb-4 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl rotate-12 absolute -inset-1 blur-sm opacity-70"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-2xl border-2 border-white dark:border-gray-700 shadow-lg relative transform -rotate-12 hover:rotate-0 transition-all duration-500">
                <span className="text-3xl font-bold text-white">{siteName.charAt(0)}</span>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{siteName}</h2>
            <p className="mt-1 text-sm text-center max-w-md text-gray-600 dark:text-gray-400">
              专业的图片托管服务，简单高效地管理和分享您的珍贵瞬间
            </p>
          </div>
          
          {/* 主要底部内容 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* 关于我们 */}
            <AboutSection siteName={siteName} />
            
            {/* 快速导航 */}
            <QuickNavigation isAuthenticated={isAuthenticated} />
            
            {/* 帮助与支持 */}
            <HelpSupport />
            
            {/* 订阅通知 */}
            <SubscribeSection />
          </div>
          
          {/* 底部版权信息 */}
          <FooterBottom siteName={siteName} year={year} />
        </div>
      </footer>
    </>
  );
};

export default Footer;
