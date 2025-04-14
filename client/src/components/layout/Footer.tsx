import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSettings } from '../../services/settingService';
import { useAuth } from '../../context/AuthContext'; // 添加认证上下文导入

const Footer: React.FC = () => {
  const [siteName, setSiteName] = useState('我的图床');
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated, user } = useAuth(); // 获取用户登录状态
  
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
            <div className="space-y-4 relative">
              <div className="absolute -left-3 top-0 w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center pl-2">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                关于{siteName}
              </h3>
              <div className="pl-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {siteName}是一款设计精美的图片托管服务，为您提供安全、快捷的图片存储和分享解决方案。我们注重用户体验，让您的每一次分享都如此简单。
                </p>
                <div className="pt-4 flex space-x-4">
                  {/* Gitee */}
                  <a href="https://gitee.com/jiqingzhe/" className="group">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-500 dark:text-blue-400 hover:shadow-md transition-all group-hover:scale-110">
                      <svg className="w-5 h-5" viewBox="0 0 1024 1024" fill="currentColor">
                        <path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a164.335 164.335 0 0 0 164.334-164.335V480.435a25.293 25.293 0 0 0-25.294-25.293z"/>
                      </svg>
                    </div>
                  </a>
                  {/* CSDN */}
                  <a href="https://blog.csdn.net/j304028273?spm=1000.2115.3001.5343" className="group">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-500 dark:text-blue-400 hover:shadow-md transition-all group-hover:scale-110">
                      <svg className="w-5 h-5" viewBox="0 0 1024 1024" fill="currentColor">
                        <path d="M229.12 841.92c-170.88-237.76-46.4-629.12 236.16-716.8 118.4-38.08 262.72-16.96 351.36 74.24 48.64 43.2 1.28 102.4-24.96 141.76-81.92-62.4-179.2-143.04-289.92-102.08C303.36 310.4 232 593.28 338.24 764.8c128 141.44 358.08 94.08 488.64-20.48 42.88 37.12 88.96 112.32 24.64 153.92-182.4 120.96-474.24 120-622.4-56.32z"/>
                      </svg>
                    </div>
                  </a>
                  {/* GitHub */}
                  <a href="https://github.com/JiQingzhe2004/" className="group">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-500 dark:text-blue-400 hover:shadow-md transition-all group-hover:scale-110">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                  </a>
                  {/* 抖音 */}
                  <a href="https://www.douyin.com/user/MS4wLjABAAAAnB8dkCUz4n75aT3gTPyPXWHLLI93elB4PRQjCLgiE3QJES43z76OernKbls95D4c?from_tab_name=main" className="group">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-500 dark:text-blue-400 hover:shadow-md transition-all group-hover:scale-110">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </div>
                  </a>
                  {/* 哔哩哔哩 */}
                  <a href="https://space.bilibili.com/473072921?spm_id_from=333.1007.0.0" className="group">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-500 dark:text-blue-400 hover:shadow-md transition-all group-hover:scale-110">
                      <svg className="w-5 h-5" viewBox="0 0 1024 1024" fill="currentColor">
                        <path d="M931.314 858.548l-0.032-547.662 0.031-1.961c0.069-5.214 0.18-16.791-6.55-23.632-2.941-2.969-8.164-9.353-16.451-9.353H613.097l122.489-174.069c7.306-10.536 4.668-23.583-5.878-30.881-10.541-7.295-25.01-6.803-32.308 3.741l-140.777 201.21h-46.897c-1.327 0-2.757 0.626-4.383-0.236L257.162 145.053c-11.312-6.019-25.374-1.017-31.406 10.306-6.023 11.321-1.734 22.885 9.597 28.914l176.92 91.667H124.264c-15.969 0-31.593 18.715-31.593 34.718v545.707c0 16.002 15.625 30.833 31.593 30.833h61.479c3.053 16.166 13.506 40.374 22.83 50.064 12.982 13.506 30.132 20.661 45.859 20.661h0.035c17.992 0 36.987-8.015 50.818-22.833 8.916-9.542 19.096-31.725 22.722-47.892h368.611c3.045 16.166 13.506 40.374 22.821 50.064 12.991 13.506 30.141 20.661 45.859 20.661h0.062c17.973 0 36.96-8.015 50.792-22.833 8.914-9.542 19.096-31.725 22.729-47.892h69.432c8.286 0 13.509-4.439 16.451-7.41 6.73-6.835 6.619-16.016 6.55-21.24z M837.595 401.868c0.902-3.673 3.509-13.054-2.539-20.73-3.743-4.784-8.851-8.204-15.305-8.204h-608.25c-11.596 0-31.94 10.126-31.94 29.194v371.638c0 22.404 21.187 27.555 31.94 27.555h608.25c6.014 0 11.627-1.191 15.344-5.699 6.388-7.749 2.531-16.312 1.552-21.276-0.111-0.65-2.379-0.77-2.383-0.77v0.095-0.095l2.002-370.442 1.329-1.266z"/>
                      </svg>
                    </div>
                  </a>
                  {/* 知乎 */}
                  <a href="https://www.zhihu.com/people/aiqji" className="group">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-500 dark:text-blue-400 hover:shadow-md transition-all group-hover:scale-110">
                      <svg className="w-5 h-5" viewBox="0 0 1024 1024" fill="currentColor">
                        <path d="M576.8 807.52h57.28l20.8 72.48 100.8-72.48h141.92V229.28H576.8z m67.84-513.92H832v448h-66.24l-85.12 64.96-18.56-64.96h-17.44zM126.4 884.48a149.44 149.44 0 0 0 123.84-10.4c60.96-36 105.92-194.56 105.92-194.56l144 177.44s13.12-84.48-2.24-108.32-99.04-119.84-99.04-119.84l-36.64 32 26.08-104.96H544s0-61.76-30.56-65.28-125.44 0-125.44 0v-192H528s-1.6-64-28.8-64H270.56l35.52-104.64s-57.6 3.36-77.92 39.36-86.4 221.6-86.4 221.6 21.92 10.24 59.2-17.28a147.68 147.68 0 0 0 49.28-75.52l67.84-3.36L320 491.2s-116.96-1.76-140.64 0-37.28 65.28-37.28 65.28H320s-15.2 108.16-60.96 187.2-132.64 140.8-132.64 140.8z" />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            {/* 快速导航 */}
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
            
            {/* 帮助与支持 */}
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
            
            {/* 订阅通知 */}
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
          </div>
          
          {/* 底部分隔线 */}
          <div className="border-t border-blue-100 dark:border-blue-900/30 pt-6 pb-2 relative">
            {/* 装饰元素 */}
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-12 h-12 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-full border border-blue-100 dark:border-blue-900/30 flex items-center justify-center shadow-md">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0 text-center md:text-left group">
                {/* 主版权信息 - 带悬浮动画 */}
                <div className="relative inline-block">
                  <div className="absolute inset-0 rounded-lg bg-blue-500/10 dark:bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-0 group-hover:w-full transition-all duration-500"></div>
                  <p className="group text-sm flex items-center font-medium relative">
                    <span className="text-gray-500 dark:text-gray-400 mr-2 transition-all duration-300 group-hover:text-blue-500 group-hover:scale-110">//</span>
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
                    Forrest-吉庆喆
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
        </div>
      </footer>
    </>
  );
};

export default Footer;
