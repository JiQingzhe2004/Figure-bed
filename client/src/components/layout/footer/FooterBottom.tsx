import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface FooterBottomProps {
  siteName: string;
  year: number;
}

// 声明全局 confetti 函数类型
declare global {
  interface Window {
    confetti?: any;
  }
}

const FooterBottom: React.FC<FooterBottomProps> = ({ siteName, year }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [confettiLoaded, setConfettiLoaded] = useState(false);
  
  // 从CDN加载canvas-confetti
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    script.async = true;
    script.onload = () => setConfettiLoaded(true);
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handleDecorClick = () => {
    setIsAnimating(true);
    setClickCount(prev => prev + 1);
    
    // 发射彩色带状效果
    if (buttonRef.current && window.confetti && confettiLoaded) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y: y - 0.05 },
        colors: ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff8800', '#ff0088'],
        ticks: 300,
        startVelocity: 30,
        decay: 0.94,
        gravity: 0.8,
        zIndex: 1000
      });
    }
    
    // 3秒后重置动画状态
    setTimeout(() => {
      setIsAnimating(false);
    }, 3000);
  };

  // 根据点击次数决定不同的效果
  const getAnimationClasses = () => {
    if (!isAnimating) return '';
    
    const effects = [
      'animate-spin duration-1000', 
      'animate-bounce duration-500',
      'scale-150 rotate-45 transition-all duration-500',
      'scale-[2] transition-transform duration-700'
    ];
    
    return effects[clickCount % effects.length];
  };
  
  // 内圆动画
  const getInnerAnimationClasses = () => {
    if (!isAnimating) return '';
    
    const effects = [
      'scale-150 bg-gradient-to-br from-yellow-400 to-red-500 transition-all duration-500',
      'scale-75 bg-gradient-to-br from-green-400 to-teal-500 transition-all duration-500',
      'rotate-180 bg-gradient-to-br from-pink-400 to-purple-500 transition-all duration-500',
      'scale-[2] bg-gradient-to-br from-cyan-400 to-blue-500 transition-all duration-500'
    ];
    
    return effects[clickCount % effects.length];
  };

  return (
    <div className="border-t border-blue-100 dark:border-blue-900/30 pt-6 pb-2 relative">
      {/* 装饰元素 - 添加点击事件和ref */}
      <div 
        ref={buttonRef}
        className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
        onClick={handleDecorClick}
        title="点击试试看"
      >
        <div className={`w-12 h-12 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-full border border-blue-100 dark:border-blue-900/30 flex items-center justify-center shadow-md transition-all ${getAnimationClasses()}`}>
          <div className={`w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full transition-all ${getInnerAnimationClasses()}`}></div>
        </div>
      </div>
      
      {/* 彩蛋效果 - 放在按钮的下方 */}
      {isAnimating && (
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 translate-y-[calc(100%+8px)] z-10">
          <div className="animate-surprise-in text-sm font-medium bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-lg border border-blue-100 dark:border-blue-800 text-center whitespace-nowrap">
            {clickCount % 4 === 0 && "✨ 发现彩蛋! ✨"}
            {clickCount % 4 === 1 && "🎉 好奇心真强! 🎉"}
            {clickCount % 4 === 2 && "🚀 继续探索吧! 🚀"}
            {clickCount % 4 === 3 && "🎯 第" + clickCount + "次点击! 🎯"}
          </div>
          {/* 添加指向按钮的小三角形 */}
          <div className="w-4 h-2 bg-white dark:bg-gray-800 rotate-[225deg] transform -translate-x-1/2 translate-y-[-4px] absolute left-1/2 top-[-4px] border-l border-t border-blue-100 dark:border-blue-800"></div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 text-center md:text-left group">
          {/* 主版权信息 - 带悬浮动画 */}
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-lg bg-blue-500/10 dark:bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-0 group-hover:w-full transition-all duration-500"></div>
            <p className="group text-sm flex items-center font-medium relative">
              <span className="text-gray-500 dark:text-gray-400 mr-2 transition-all duration-300 group-hover:text-blue-500 group-hover:scale-110">{'//'}</span>
              <span className="text-gray-700 dark:text-gray-200 transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-105">
                Copyright &copy; {year}
              </span>
              <span className="mx-2 text-blue-500 dark:text-blue-400 transition-all duration-500 group-hover:rotate-180 group-hover:text-purple-500">•</span>
              <span className="text-gray-800 dark:text-white font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 transition-all duration-500 group-hover:bg-gradient-to-l">
                {siteName}
              </span>
              <span className="hidden md:inline ml-2 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 text-xs text-blue-600 dark:text-blue-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-[-2px] group-hover:shadow-sm group-hover:border-blue-300">
                All Rights Reserved
              </span>
              <span className="md:hidden ml-2 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 text-xs text-purple-600 dark:text-purple-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                版权所有
              </span>
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 transition-all duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">
            制作人：
            <span className="ml-1 text-blue-500 dark:text-blue-400 font-medium relative">
              <span className="absolute bottom-0 left-0 w-full h-px bg-blue-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
              {isAnimating && clickCount % 4 === 3 ? "您真厉害!" : "Forrest-吉庆喆"}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap justify-center space-x-4 items-center">
          <Link to="/privacy-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            隐私政策
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <Link to="/terms-of-service" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            使用条款
          </Link>
          <span className="text-gray-300 dark:text-gray-700">|</span>
          <Link to="/sitemap" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            网站地图
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;