import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSettings } from '../../services/settingService';

const Footer: React.FC = () => {
  const [siteName, setSiteName] = useState('我的图床');
  
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
    <footer className="bg-white dark:bg-gray-800 shadow mt-auto py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-300">
              &copy; {year} {siteName}. 保留所有权利。
            </p>
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
              首页
            </Link>
            <Link to="/upload" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
              上传
            </Link>
            <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
              登录
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
