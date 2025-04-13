import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import { getSettings } from '../../services/settingService';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [siteName, setSiteName] = useState('我的图床');
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md dark:bg-gray-800 dark:border-gray-700">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {siteName}
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">首页</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/upload" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">上传图片</Link>
              <Link to="/user/images" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">我的图片</Link>
              
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">
                  <span>{user?.username || '用户'}</span>
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 dark:bg-gray-700 z-50">
                  <Link to="/user/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">个人资料</Link>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">管理后台</Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">退出登录</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">登录</Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400">注册</Link>
            </>
          )}
          
          <ThemeSwitcher />
        </div>
        
        {/* 移动端菜单按钮 */}
        <div className="md:hidden flex items-center">
          <ThemeSwitcher />
          <button 
            className="ml-2 text-gray-700 dark:text-gray-200" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>
      
      {/* 移动端菜单 */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 py-2 px-4">
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
                个人资料
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="block py-2 text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                  onClick={() => setMenuOpen(false)}
                >
                  管理后台
                </Link>
              )}
              <button 
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }} 
                className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
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
