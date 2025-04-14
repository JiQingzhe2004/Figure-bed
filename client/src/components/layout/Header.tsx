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
          className="h-8 w-8 rounded-full object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = `https://ui-avatars.com/api/?name=${user.username}&background=random`;
          }} 
        />
      );
    } else {
      return (
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
        </div>
      );
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              {siteLogo ? (
                <img src={siteLogo} alt="网站Logo" className="h-8 w-auto mr-2" />
              ) : (
                <div className="text-blue-500 dark:text-blue-400 text-2xl mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <span className="font-semibold text-xl tracking-tight dark:text-white">{siteName}</span>
            </Link>
          </div>
          
          {/* 桌面端菜单 */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              首页
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/upload" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  上传图片
                </Link>
                <Link to="/user/images" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  我的图片
                </Link>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    管理后台
                  </Link>
                )}
                <div className="relative group" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                  >
                    {getUserAvatar()}
                    <span className="ml-2">{user?.username}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                      <Link 
                        to="/user/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setDropdownOpen(false)}
                      >
                        个人信息
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  登录
                </Link>
                <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                  注册
                </Link>
              </>
            )}
            <ThemeSwitcher />
          </nav>
          
          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden text-gray-600 dark:text-gray-200 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* 移动端菜单 - 修改为固定定位，浮在内容上方 */}
      <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* 背景蒙层，点击关闭菜单 */}
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${mobileMenuOpen ? 'bg-opacity-60' : 'bg-opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        
        {/* 菜单内容 - 从右侧滑入 */}
        <div 
          className={`fixed right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 shadow-xl overflow-hidden transform transition-transform duration-300 ease-in-out rounded-l-2xl ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col`}
        >
          {/* 装饰元素 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* 顶部圆形装饰 */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20"></div>
            <div className="absolute top-1/4 -left-12 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-20"></div>
            
            {/* 底部装饰形状 */}
            <div className="absolute bottom-10 right-10 w-36 h-36 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 opacity-10"></div>
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-green-400 to-teal-500 opacity-10"></div>
            
            {/* 几何装饰 */}
            <div className="absolute top-1/3 right-12 w-12 h-12 border-4 border-blue-300 opacity-10 rounded-lg transform rotate-12"></div>
            <div className="absolute top-2/3 left-8 w-6 h-16 border-4 border-purple-300 opacity-10 transform -rotate-12"></div>
            
            {/* 波浪装饰 */}
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
          
          {/* 用户信息区域或登录提示 */}
          <div className="relative z-10 p-6 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* 花纹背景 */}
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
                <div className="scale-125 transform"> {/* 为头像添加放大效果 */}
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
          
          {/* 菜单内容区域 - 带滚动 */}
          <div className="relative z-10 flex-1 overflow-y-auto">
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
              
              {/* 保留现有菜单项，但统一样式 */}
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
                  {/* 未登录状态下的菜单项 */}
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
          
          {/* 底部区域 - 修复深色模式对比度 */}
          <div className="relative z-10 border-t border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-b from-transparent via-gray-50 to-gray-100 dark:from-transparent dark:via-gray-800 dark:to-gray-800">
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
            
            {/* 版权信息区域 */}
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
