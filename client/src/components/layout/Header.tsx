import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import { getSettings } from '../../services/settingService';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [siteName, setSiteName] = useState('我的图床');
  const [siteLogo, setSiteLogo] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { settings } = await getSettings();
        if (settings.site_name) {
          setSiteName(settings.site_name);
        }
        if (settings.site_logo) {
          setSiteLogo(settings.site_logo);
        }
      } catch (error) {
        console.error('获取网站设置失败:', error);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 获取用户头像或默认头像
  const getUserAvatar = () => {
    if (user && (user.avatar_path || user.avatar_url)) {
      const avatarUrl = user.avatar_url || user.avatar_path;

      return (
        <img 
          src={avatarUrl} 
          alt="用户头像" 
          className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover border-2 border-white/30 shadow-lg"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = `https://ui-avatars.com/api/?name=${user.username}&background=random`;
          }} 
        />
      );
    } else {
      return (
        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-2 border-white/30">
          {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>
      );
    }
  };

  return (
    <header className={`relative z-40 transition-all duration-300 ${scrolled ? 'shadow-md bg-white dark:bg-gray-800' : 'bg-white/95 dark:bg-gray-800/95'}`}>
      {/* 几何背景装饰 - 添加渐变方格 */}
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
      
      {/* 更改为全宽容器，解决手机端右侧空白问题 */}
      <div className="w-full px-4 md:px-6 lg:container lg:mx-auto relative">
        {/* 主要内容 */}
        <div className="flex justify-between items-center py-3 md:py-4">
          <div className="flex items-center">
            <Link to="/" className="group flex items-center">
              <div className="relative overflow-hidden">
                {siteLogo ? (
                  <img src={siteLogo} alt="网站Logo" className="h-6 w-auto md:h-7 md:w-auto object-contain transform transition-transform" />
                ) : (
                  <div className="relative">
                    {/* 缩小Logo尺寸，特别是在移动设备上 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-[1px] opacity-80 transition-opacity"></div>
                    <div className="relative text-white text-base md:text-xl p-1 md:p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden transition-shadow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {/* 移除悬浮蒙版 */}
                    </div>
                  </div>
                )}
                
                {/* 装饰元素 - 光晕效果，保留但减弱 */}
                <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </div>
              
              <div className="ml-2 md:ml-3 relative overflow-hidden">
                <span className="font-bold text-base md:text-xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                  {siteName}
                </span>
                <div className="h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>
          </div>
          
          {/* 桌面端菜单 */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/" className="relative px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 group overflow-hidden rounded-md">
              <span className="relative z-10">首页</span>
              <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/upload" className="relative px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 group overflow-hidden rounded-md">
                  <span className="relative z-10">上传图片</span>
                  <div className="absolute inset-0 bg-purple-50 dark:bg-purple-900/20 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
                </Link>
                
                <Link to="/user/images" className="relative px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 group overflow-hidden rounded-md">
                  <span className="relative z-10">我的图片</span>
                  <div className="absolute inset-0 bg-green-50 dark:bg-green-900/20 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
                </Link>
                
                {isAdmin && (
                  <Link to="/admin/dashboard" className="relative px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 group overflow-hidden rounded-md">
                    <span className="relative z-10">管理后台</span>
                    <div className="absolute inset-0 bg-red-50 dark:bg-red-900/20 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
                  </Link>
                )}
                
                <div className="relative group pl-3" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-3 py-1.5 rounded-full hover:shadow-md transition-all focus:outline-none border border-blue-100 dark:border-blue-800/30"
                  >
                    {getUserAvatar()}
                    <span className="text-gray-700 dark:text-gray-200 font-medium max-w-[80px] truncate">{user?.username}</span>
                    <svg 
                      className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  {/* 添加动态效果的下拉菜单 */}
                  <div 
                    className={`absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-10 border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 origin-top-right ${dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    
                    <Link 
                      to="/user/profile" 
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      个人信息
                    </Link>
                    
                    <Link 
                      to="/user/settings" 
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      账号设置
                    </Link>
                    
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      退出登录
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="relative px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 group overflow-hidden rounded-md">
                  <span className="relative z-10">登录</span>
                  <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
                </Link>
                
                <Link to="/register" className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-1.5 transform hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                  <span className="relative z-10">注册</span>
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </Link>
              </>
            )}
            
            <div className="ml-2 p-1 rounded-full bg-gray-100 dark:bg-gray-700">
              <ThemeSwitcher />
            </div>
          </nav>
          
          {/* 移动端菜单按钮 - 调整大小 */}
          <button 
            className="md:hidden relative z-50 text-gray-600 dark:text-gray-200 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-700 shadow-md border border-gray-200 dark:border-gray-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </div>
          </button>
        </div>
      </div>
      
      {/* 移动端菜单 - 使用固定定位但不限制高度，避免被输入框挡住 */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* 背景蒙层，点击关闭菜单 - 增强过渡动画效果 */}
        <div 
          className={`fixed inset-0 transition-all duration-500 ease-in-out ${
            mobileMenuOpen 
              ? 'bg-black/60 backdrop-blur-sm' 
              : 'bg-black/0 backdrop-blur-none pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        
        {/* 菜单内容 - 从右侧滑入，使用适应性高度 */}
        <div 
          className={`fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-gray-800 shadow-xl overflow-hidden transform transition-transform duration-500 ease-out rounded-l-2xl ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col`}
          style={{ maxHeight: '100%' }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20"></div>
            <div className="absolute top-1/4 -left-12 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-20"></div>
            <div className="absolute bottom-10 right-10 w-36 h-36 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 opacity-10"></div>
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-green-400 to-teal-500 opacity-10"></div>
            <div className="absolute top-1/3 right-12 w-12 h-12 border-4 border-blue-300 opacity-10 rounded-lg transform rotate-12"></div>
            <div className="absolute top-2/3 left-8 w-6 h-16 border-4 border-purple-300 opacity-10 transform -rotate-12"></div>
            <svg 
              className="absolute bottom-0 left-0 right-0 opacity-10 text-blue-500 dark:text-blue-300"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 1440 320"
            >
              <path 
                fill="currentColor" 
                d="M0,128L48,117.3C96,107,192,85,288,90.7C384,96,480,128,576,154.7C672,181,768,203,864,197.3C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
          
          <div className="relative z-10 p-6 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <svg className="absolute opacity-10" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1" />
                  </pattern>
                  <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                    <rect width="80" height="80" fill="url(#smallGrid)" />
                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-blue-600 opacity-40"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white rounded-full opacity-10"></div>
              <div className="absolute -top-12 right-8 w-24 h-24 bg-blue-300 rounded-full opacity-20 blur-xl"></div>
            </div>

            {isAuthenticated ? (
              <div className="relative z-10 flex items-center space-x-4">
                <div className="scale-125 transform">
                  {getUserAvatar()}
                </div>
                <div>
                  <div className="font-medium text-white">{user?.username}</div>
                  <div className="text-sm text-blue-100">{user?.email}</div>
                </div>
              </div>
            ) : (
              <div className="relative z-10 py-4">
                <div className="font-bold text-xl mb-2 text-white">欢迎使用{siteName}</div>
                <div className="text-blue-100 mb-4">登录以获得更多功能</div>
                <div className="flex space-x-3">
                  <Link 
                    to="/login" 
                    className="bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 px-4 py-2 rounded-md text-white transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    登录
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md font-medium transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    注册
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              菜单导航
            </h3>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* 主菜单内容区 - 设置为flex-1且使用overflow-y-auto，确保滚动正常工作 */}
          <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain">
            <nav className="p-6 space-y-1">
              <Link 
                to="/" 
                className="flex items-center py-3 px-4 rounded-md text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md text-blue-500 dark:text-blue-300 mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span>首页</span>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/upload" 
                    className="flex items-center py-3 px-4 rounded-md text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-md text-purple-500 dark:text-purple-300 mr-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                      </svg>
                    </div>
                    <span>上传图片</span>
                  </Link>
                  
                  <Link 
                    to="/user/images" 
                    className="flex items-center py-3 px-4 rounded-md text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-md text-green-500 dark:text-green-300 mr-3 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span>我的图片</span>
                  </Link>
                  
                  <Link 
                    to="/user/profile" 
                    className="flex items-center py-3 px-4 rounded-md text-gray-700 dark:text-gray-200 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-md text-yellow-500 dark:text-yellow-300 mr-3 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span>个人信息</span>
                  </Link>
                  
                  {isAdmin && (
                    <Link 
                      to="/admin/dashboard" 
                      className="flex items-center py-3 px-4 rounded-md text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="bg-red-100 dark:bg-red-900 p-2 rounded-md text-red-500 dark:text-red-300 mr-3 group-hover:bg-red-200 dark:group-hover:bg-red-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                      <span>管理后台</span>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <div className="border-b border-dashed border-gray-200 dark:border-gray-700 my-2"></div>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 px-4 py-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    探索功能
                  </div>
                  
                  <Link 
                    to="/public-images" 
                    className="flex items-center py-3 px-4 rounded-md text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="bg-teal-100 dark:bg-teal-900 p-2 rounded-md text-teal-500 dark:text-teal-300 mr-3 group-hover:bg-teal-200 dark:group-hover:bg-teal-800 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span>浏览公开图片</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          {/* 底部区域 - 使用sticky定位确保在底部显示 */}
          <div className="relative z-10 border-t border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-b from-transparent via-gray-50 to-gray-100 dark:from-transparent dark:via-gray-800 dark:to-gray-800 sticky bottom-0">
            {isAuthenticated && (
              <button
                className="w-full flex items-center py-2 px-4 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </button>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                切换主题
              </div>
              <ThemeSwitcher />
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} {siteName} 
              </div>
              <div className="flex justify-center space-x-4 mt-2">
                <Link to="/privacy-policy" className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                  隐私政策
                </Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <Link to="/terms-of-service" className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                  使用条款
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
