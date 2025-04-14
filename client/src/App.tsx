import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { getSettings } from './services/settingService';
import DynamicTitle from './components/common/DynamicTitle';

function App() {
  const [siteMetadata, setSiteMetadata] = useState({
    title: '图床应用',
    description: '简单好用的图片管理工具',
    keywords: '图片,上传,图床,照片,分享'
  });
  
  useEffect(() => {
    const fetchSiteMetadata = async () => {
      try {
        const { settings } = await getSettings();
        setSiteMetadata({
          title: settings.site_name || '图床应用',
          description: settings.site_description || '简单好用的图片管理工具',
          keywords: settings.site_keywords || '图片,上传,图床,照片,分享'
        });
      } catch (error) {
        console.error('获取网站元数据失败:', error);
      }
    };
    
    fetchSiteMetadata();
  }, []);
  
  return (
    <>
      <DynamicTitle 
        title={siteMetadata.title}
        description={siteMetadata.description}
        keywords={siteMetadata.keywords}
      />
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
