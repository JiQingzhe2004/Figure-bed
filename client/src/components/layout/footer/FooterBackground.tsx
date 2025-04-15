import React from 'react';

interface FooterBackgroundProps {
  isHovered: boolean;
}

const FooterBackground: React.FC<FooterBackgroundProps> = ({ isHovered }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 大圆形装饰 */}
      <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/20 transition-all duration-1000 ${isHovered ? 'scale-110' : 'scale-100'}`}></div>
      <div className="absolute top-1/2 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-green-400/10 to-teal-300/10 blur-md"></div>
      
      {/* 小装饰元素 */}
      <div className="absolute top-20 left-1/4 w-16 h-16 bg-blue-500/5 rounded-lg rotate-45"></div>
      <div className="absolute bottom-12 left-1/3 w-8 h-8 bg-purple-500/10 rounded-lg rotate-12"></div>
      <div className="absolute top-1/3 right-1/4 w-6 h-12 bg-green-500/5 rounded-full"></div>
      
      {/* 格子背景 */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{ 
          backgroundImage: 'linear-gradient(90deg, #6366f1 1px, transparent 1px), linear-gradient(#6366f1 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}></div>
      </div>
      
      {/* 三角形装饰 */}
      <div className="absolute bottom-10 right-1/4">
        <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[40px] border-b-blue-300/10 rotate-12"></div>
      </div>
      
      {/* 波浪线 */}
      <svg className="absolute bottom-0 left-0 right-0 text-blue-50 dark:text-blue-900/20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="currentColor" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,218.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
      <svg className="absolute bottom-0 left-0 right-0 text-blue-100 dark:text-blue-800/30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="currentColor" fillOpacity="1" d="M0,160L40,138.7C80,117,160,75,240,69.3C320,64,400,96,480,128C560,160,640,192,720,192C800,192,880,160,960,138.7C1040,117,1120,107,1200,122.7C1280,139,1360,181,1400,202.7L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
      </svg>
    </div>
  );
};

export default FooterBackground;
