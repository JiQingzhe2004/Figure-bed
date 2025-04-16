import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeSwitcher from '../ui/ThemeSwitcher';
import { getSettings } from '../../services/settingService';
import Logo from './header/Logo';
import NavLink from './header/NavLink';
import UserDropdown from './header/UserDropdown';
import MobileMenu from './header/MobileMenu';
import DecorativeBackground from './header/DecorativeBackground';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [siteName, setSiteName] = useState('我的图床');
  const [siteLogo, setSiteLogo] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { settings } = await getSettings();
        if (settings.site_name) setSiteName(settings.site_name);
        if (settings.site_logo) setSiteLogo(settings.site_logo);
      } catch (error) {
        console.error('获取网站设置失败:', error);
      }
    };

    fetchSettings();
    
    // 处理滚动效果
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 ${
      scrolled 
      ? 'shadow-md bg-white/85 dark:bg-gray-800/90 backdrop-blur-md' 
      : 'bg-white/95 dark:bg-gray-800/95'
    }`}>
      <DecorativeBackground />
      
      <div className="w-full px-4 md:px-6 lg:container lg:mx-auto relative">
        <div className="flex justify-between items-center py-5 md:py-4">
          <div className="flex items-center">
            <Logo siteName={siteName} siteLogo={siteLogo} />
          </div>
          
          {/* 桌面端菜单 */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" label="首页" color="blue" />
            
            {isAuthenticated ? (
              <>
                <NavLink to="/upload" label="上传图片" color="purple" />
                <NavLink to="/user/images" label="我的图片" color="green" />
                
                {isAdmin && (
                  <NavLink to="/admin/dashboard" label="管理后台" color="red" />
                )}
                
                <div className="relative group pl-3" ref={dropdownRef}>
                  <UserDropdown 
                    user={user} 
                    isOpen={dropdownOpen}
                    setIsOpen={setDropdownOpen}
                    onLogout={handleLogout}
                  />
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="relative overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-1.5 transform hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                  <span className="relative z-10">登录</span>
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
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
          
          {/* 移动端菜单按钮 - 提高z-index使其在菜单打开时仍然可见 */}
          <button 
            className="md:hidden fixed top-5 right-4 z-[80] text-gray-600 dark:text-gray-200 focus:outline-none"
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
      
      {/* 移动端菜单 */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        setIsOpen={setMobileMenuOpen}
        siteName={siteName}
        user={user}
        isAdmin={isAdmin}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    </header>
  );
};

export default Header;
