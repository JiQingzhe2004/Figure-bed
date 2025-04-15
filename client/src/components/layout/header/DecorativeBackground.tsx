import React from 'react';

const DecorativeBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 渐变方格背景 */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="h-full w-full" 
          style={{ 
            backgroundImage: `
              linear-gradient(to right, rgb(255, 255, 255) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(255, 255, 255) 1px, transparent 1px),
              linear-gradient(to right, rgb(15, 16, 67) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(20, 21, 65) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px, 40px 40px, 8px 8px, 8px 8px'
          }}
        ></div>
      </div>
      
      {/* 装饰圆形 */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-purple-300/20 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-md"></div>
      <div className="absolute top-1/3 -left-8 w-24 h-24 bg-gradient-to-tr from-green-200/10 to-blue-200/10 dark:from-green-900/10 dark:to-blue-900/10 rounded-full blur-sm"></div>
      
      {/* 小装饰元素 */}
      <div className="absolute top-6 right-1/4 w-6 h-6 bg-purple-400/5 dark:bg-purple-400/10 rounded-md rotate-45"></div>
      <div className="absolute bottom-3 left-1/3 w-4 h-4 bg-blue-400/10 dark:bg-blue-400/20 rounded-full"></div>
      
      {/* 顶部装饰线条 - 更微妙的渐变效果 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent dark:via-blue-400/40"></div>
      
      {/* 底部装饰线条 - 呼应底部栏 */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-pink-400/20"></div>
    </div>
  );
};

export default DecorativeBackground;
