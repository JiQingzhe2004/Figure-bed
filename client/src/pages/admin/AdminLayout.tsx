import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[80vh]">
      {/* 移动端菜单按钮 */}
      <div className="md:hidden p-4 bg-gray-800 text-white flex justify-between items-center">
        <h2 className="font-bold text-xl">管理后台</h2>
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* 侧边栏 */}
      <aside 
        className={`
          ${sidebarOpen ? 'block' : 'hidden'} 
          md:block bg-gray-800 text-white w-full md:w-64 flex-shrink-0 
          fixed md:relative top-[57px] md:top-0 bottom-0 z-10 overflow-y-auto
        `}
      >
        <div className="p-6 hidden md:block">
          <h2 className="font-bold text-xl">管理后台</h2>
        </div>
        <nav className="mt-6">
          <div className="px-4 py-2 text-gray-400 uppercase text-xs font-semibold">
            主菜单
          </div>
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => `
              flex items-center px-6 py-3 hover:bg-gray-700
              ${isActive ? 'bg-gray-700 border-l-4 border-blue-500' : ''}
            `}
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            仪表盘
          </NavLink>
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `
              flex items-center px-6 py-3 hover:bg-gray-700
              ${isActive ? 'bg-gray-700 border-l-4 border-blue-500' : ''}
            `}
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            用户管理
          </NavLink>
          <NavLink 
            to="/admin/images" 
            className={({ isActive }) => `
              flex items-center px-6 py-3 hover:bg-gray-700
              ${isActive ? 'bg-gray-700 border-l-4 border-blue-500' : ''}
            `}
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            图片管理
          </NavLink>
          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => `
              flex items-center px-6 py-3 hover:bg-gray-700
              ${isActive ? 'bg-gray-700 border-l-4 border-blue-500' : ''}
            `}
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            网站设置
          </NavLink>
          
          <div className="px-4 py-2 mt-6 text-gray-400 uppercase text-xs font-semibold">
            用户信息
          </div>
          <div className="px-6 py-4">
            <div className="font-medium">{user?.username}</div>
            <div className="text-sm text-gray-400">{user?.email}</div>
          </div>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
