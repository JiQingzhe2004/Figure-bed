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
    // 检查avatar_path或avatar_url属性
    if (user && (user.avatar_path || user.avatar_url)) {
      // 优先使用avatar_url，因为它已经是完整URL
      const avatarUrl = user.avatar_url || user.avatar_path;
      
      return (
        <img 
          src={avatarUrl} 
          alt="用户头像" 
          className="h-8 w-8 rounded-full object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            // 使用ui-avatars生成带有用户名首字母的头像
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
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
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
          <div className="hidden md:flex items-center space-x-4">
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
          </div>
          
          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center">
            <ThemeSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none ml-4"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 py-2 px-4">
          {isAuthenticated && (
            <div className="py-2 flex items-center">
              {getUserAvatar()}
              <span className="ml-2 text-gray-700 dark:text-gray-200">{user?.username}</span>
            </div>
          )}
          
          <Link 
            to="/" 
            className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
            onClick={() => setMenuOpen(false)}
          >
            首页
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/upload" 
                className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                上传图片
              </Link>
              <Link 
                to="/user/images" 
                className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                我的图片
              </Link>
              <Link 
                to="/user/profile" 
                className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                个人信息
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin/dashboard" 
                  className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                  onClick={() => setMenuOpen(false)}
                >
                  管理后台
                </Link>
              )}
              <button
                className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                退出登录
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                登录
              </Link>
              <Link 
                to="/register" 
                className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                注册
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
