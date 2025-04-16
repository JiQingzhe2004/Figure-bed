import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeSwitcher from '../../ui/ThemeSwitcher';
interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  siteName: string;
  user: any; // 使用合适的用户类型
  isAdmin: boolean;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  setIsOpen, 
  siteName, 
  user, 
  isAdmin, 
  isAuthenticated, 
  onLogout 
}) => {
  // 保存原始滚动位置
  const scrollPositionRef = useRef(0);
  
  // 添加立即关闭菜单的函数，确保状态更新迅速
  const handleClose = React.useCallback(() => {
    // 使用requestAnimationFrame确保更平滑的状态转换
    requestAnimationFrame(() => {
      setIsOpen(false);
    });
  }, [setIsOpen]);
  
  // 改进的滚动锁定实现
  useEffect(() => {
    if (isOpen) {
      // 保存当前滚动位置
      scrollPositionRef.current = window.pageYOffset;
      
      // 锁定滚动并固定位置
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll'; // 保持滚动条宽度一致，避免页面跳动
    } else {
      // 恢复滚动
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      
      // 恢复原始滚动位置
      window.scrollTo(0, scrollPositionRef.current);
    }
    
    return () => {
      // 清理函数
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* 全屏遮罩层 - 优化定位和层级，使用handleClose确保迅速响应 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" 
          onClick={handleClose}
          style={{ 
            position: 'fixed', 
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: '100vw',      // 确保覆盖整个视口宽度
            height: '100vh',     // 确保覆盖整个视口高度
            touchAction: 'none', // 防止触摸事件穿透
            willChange: 'opacity' // 优化性能
          }}
        />
      )}
      
      {/* 菜单容器 */}
      <div 
        className={`fixed right-0 top-0 bottom-0 w-[75%] max-w-xs bg-white dark:bg-gray-800 shadow-xl overflow-hidden transform transition-all duration-300 ease-in-out rounded-l-2xl z-[65] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
        style={{ 
          height: '100vh', 
          maxHeight: '-webkit-fill-available',
          willChange: 'transform' // 优化变换性能
        }}
      >
        {/* 内部容器，解决iOS Safari问题 */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* 恢复几何装饰元素 */}
          <MobileMenuDecoration />
          
          <div className="relative z-10 p-6 border-b border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0">
            <MobileMenuHeader 
              isAuthenticated={isAuthenticated}
              user={user}
              siteName={siteName}
              setIsOpen={setIsOpen}
              handleClose={handleClose} // 传递 handleClose 函数
            />
          </div>

          <div className="relative z-10 flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              菜单导航
            </h3>
          </div>
          
          {/* 主菜单内容区 */}
          <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain">
            <nav className="p-6 space-y-1">
              <MobileNavLink 
                to="/" 
                label="首页" 
                icon="home" 
                color="blue" 
                onClick={handleClose} 
              />
              
              {isAuthenticated ? (
                <>
                  <MobileNavLink 
                    to="/upload" 
                    label="上传图片" 
                    icon="upload" 
                    color="purple" 
                    onClick={handleClose} 
                  />
                  
                  <MobileNavLink 
                    to="/user/images" 
                    label="我的图片" 
                    icon="gallery" 
                    color="green" 
                    onClick={handleClose} 
                  />
                  
                  <MobileNavLink 
                    to="/user/profile" 
                    label="个人信息" 
                    icon="profile" 
                    color="yellow" 
                    onClick={handleClose} 
                  />
                  
                  {isAdmin && (
                    <MobileNavLink 
                      to="/admin/dashboard" 
                      label="管理后台" 
                      icon="admin" 
                      color="red" 
                      onClick={handleClose} 
                    />
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
                  
                  <MobileNavLink 
                    to="/public-images" 
                    label="浏览公开图片" 
                    icon="browse" 
                    color="teal" 
                    onClick={handleClose} 
                  />
                </>
              )}
            </nav>
          </div>
          
          {/* 底部区域 */}
          <div className="relative z-10 border-t border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-b from-transparent via-gray-50 to-gray-100 dark:from-transparent dark:via-gray-800 dark:to-gray-800 flex-shrink-0">
            <MobileMenuFooter 
              isAuthenticated={isAuthenticated} 
              onLogout={onLogout} 
              setIsOpen={setIsOpen}
              siteName={siteName} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

// 恢复几何装饰元素组件
const MobileMenuDecoration = () => (
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
);

// 更新 MobileMenuHeader 的接口，增加 handleClose 属性
interface MobileMenuHeaderProps {
  isAuthenticated: boolean;
  user: any;
  siteName: string;
  setIsOpen: (isOpen: boolean) => void;
  handleClose: () => void; // 添加 handleClose 属性
}

const MobileMenuHeader: React.FC<MobileMenuHeaderProps> = ({ 
  isAuthenticated, 
  user, 
  siteName, 
  setIsOpen,
  handleClose 
}) => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600/70 via-indigo-600/70 to-purple-600/70">
      {/* 添加装饰性几何元素 */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-20 bg-blue-400 opacity-10 transform rotate-12 blur-lg"></div>
      <div className="absolute top-0 right-1/4 w-2 h-12 bg-white opacity-20 rounded-full"></div>
      <div className="absolute bottom-4 right-8 w-4 h-4 bg-white opacity-20 rounded-full"></div>
      <div className="absolute top-8 left-4 w-3 h-3 bg-blue-300 opacity-20 rounded-full"></div>
      <div className="absolute bottom-12 left-1/4 w-6 h-6 bg-indigo-300 opacity-15 rounded-md transform rotate-45"></div>
      
      {/* 移除额外的模糊层，保留轻微的白色叠加效果 */}
      <div className="absolute inset-0 bg-white/5"></div>
      
      <div className="relative px-6 py-6 z-10">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {user && (user.avatar_path || user.avatar_url) ? (
                <img 
                  src={user.avatar_url || user.avatar_path} 
                  alt={user.username} 
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-white/70 shadow-md" 
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = `https://ui-avatars.com/api/?name=${user.username}&background=random`;
                  }}
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold shadow-md ring-2 ring-white/30">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div>
              <div className="font-semibold text-white text-xl">{user?.username}</div>
              <div className="text-sm text-blue-100/90 truncate max-w-[180px]">{user?.email}</div>
            </div>
          </div>
        ) : (
          <div className="py-2">
            <div className="font-bold text-xl mb-2 text-white">欢迎使用{siteName}</div>
            <div className="text-blue-100 mb-4">登录以获得更多功能</div>
            <div className="flex space-x-3">
              <Link 
                to="/login" 
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-white transition-colors duration-200"
                onClick={handleClose}
              >
                登录
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                onClick={handleClose}
              >
                注册
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface MobileNavLinkProps {
  to: string;
  label: string;
  icon: 'home' | 'upload' | 'gallery' | 'profile' | 'admin' | 'browse';
  color: 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'teal';
  onClick?: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, label, icon, color, onClick }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue': return {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-500 dark:text-blue-300',
        hover: 'group-hover:bg-blue-200 dark:group-hover:bg-blue-800'
      };
      case 'purple': return {
        bg: 'bg-purple-100 dark:bg-purple-900',
        text: 'text-purple-500 dark:text-purple-300',
        hover: 'group-hover:bg-purple-200 dark:group-hover:bg-purple-800'
      };
      case 'green': return {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-500 dark:text-green-300',
        hover: 'group-hover:bg-green-200 dark:group-hover:bg-green-800'
      };
      case 'yellow': return {
        bg: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-500 dark:text-yellow-300',
        hover: 'group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800'
      };
      case 'red': return {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-500 dark:text-red-300',
        hover: 'group-hover:bg-red-200 dark:group-hover:bg-red-800'
      };
      case 'teal': return {
        bg: 'bg-teal-100 dark:bg-teal-900',
        text: 'text-teal-500 dark:text-teal-300',
        hover: 'group-hover:bg-teal-200 dark:group-hover:bg-teal-800'
      };
      default: return {
        bg: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-500 dark:text-blue-300',
        hover: 'group-hover:bg-blue-200 dark:group-hover:bg-blue-800'
      };
    }
  };
  
  const getHoverClass = () => {
    switch(color) {
      case 'blue': return 'hover:bg-blue-50 dark:hover:bg-blue-900/20';
      case 'purple': return 'hover:bg-purple-50 dark:hover:bg-purple-900/20';
      case 'green': return 'hover:bg-green-50 dark:hover:bg-green-900/20';
      case 'yellow': return 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20';
      case 'red': return 'hover:bg-red-50 dark:hover:bg-red-900/20';
      case 'teal': return 'hover:bg-teal-50 dark:hover:bg-teal-900/20';
      default: return 'hover:bg-blue-50 dark:hover:bg-blue-900/20';
    }
  };
  
  const getIcon = () => {
    const colorClass = getColorClasses();
    
    switch (icon) {
      case 'home':
        return (
          <div className={`${colorClass.bg} p-2 rounded-md ${colorClass.text} mr-3 ${colorClass.hover} transition-colors`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        );
      case 'upload':
        return (
          <div className={`${colorClass.bg} p-2 rounded-md ${colorClass.text} mr-3 ${colorClass.hover} transition-colors`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
            </svg>
          </div>
        );
      case 'gallery':
        return (
          <div className={`${colorClass.bg} p-2 rounded-md ${colorClass.text} mr-3 ${colorClass.hover} transition-colors`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'profile':
        return (
          <div className={`${colorClass.bg} p-2 rounded-md ${colorClass.text} mr-3 ${colorClass.hover} transition-colors`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'admin':
        return (
          <div className={`${colorClass.bg} p-2 rounded-md ${colorClass.text} mr-3 ${colorClass.hover} transition-colors`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100-4m0 4a2 2 0 110-4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
        );
      case 'browse':
        return (
          <div className={`${colorClass.bg} p-2 rounded-md ${colorClass.text} mr-3 ${colorClass.hover} transition-colors`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Link 
      to={to} 
      className={`flex items-center py-3 px-4 rounded-md text-gray-700 dark:text-gray-200 ${getHoverClass()} transition-colors group`}
      onClick={(e) => {
        // 确保点击事件立即处理
        if (onClick) onClick();
        // 添加微小延迟以确保导航后再关闭菜单
        setTimeout(() => {
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          document.body.style.overflowY = '';
        }, 50);
      }}
    >
      {getIcon()}
      <span>{label}</span>
    </Link>
  );
};

interface MobileMenuFooterProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  setIsOpen: (isOpen: boolean) => void;
  siteName: string;
}

const MobileMenuFooter: React.FC<MobileMenuFooterProps> = ({ isAuthenticated, onLogout, setIsOpen, siteName }) => {
  return (
    <div className="relative z-10 border-t border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-b from-transparent via-gray-50 to-gray-100 dark:from-transparent dark:via-gray-800 dark:to-gray-800 sticky bottom-0">
      {isAuthenticated && (
        <button
          className="w-full flex items-center py-2 px-4 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          onClick={() => {
            onLogout();
            setIsOpen(false);
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
  );
};

export default MobileMenu;
