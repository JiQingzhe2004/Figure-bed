import React, { useState, useEffect, useCallback } from 'react';
import { getPublicImages } from '../services/imageService';
import { getSettings } from '../services/settingService';
import { getUserStats } from '../services/userService';
import { getPublicStats } from '../services/statsService'; 
import { ImageData } from '../types/image';
import DynamicTitle from '../components/common/DynamicTitle';
import { useAuth } from '../context/AuthContext';

// 导入新创建的组件
import WelcomeSection from '../components/home/WelcomeSection';
import IntroSection from '../components/home/IntroSection';
import PublicGallery from '../components/home/PublicGallery';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [settings, setSettings] = useState({
    site_name: '我的图床',
    site_description: '简单好用的图片存储服务'
  });
  const [publicStats, setPublicStats] = useState({
    publicImagesCount: 0,
    totalUsers: 0
  });
  const [userStats, setUserStats] = useState({
    imageCount: 0,
    storageUsed: 0
  });

  // 获取公开统计数据
  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const data = await getPublicStats();
        setPublicStats(data);
      } catch (err) {
        console.error('获取公开统计失败:', err);
      }
    };
    
    fetchPublicStats();
  }, []);

  // 获取用户统计数据 (当用户登录时)
  useEffect(() => {
    if (!user) return;
    
    const fetchUserStats = async () => {
      try {
        const data = await getUserStats();
        setUserStats(data);
      } catch (err) {
        console.error('获取用户统计失败:', err);
      }
    };
    
    fetchUserStats();
  }, [user]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        setSettings({
          site_name: response.settings.site_name || '我的图床',
          site_description: response.settings.site_description || '简单好用的图片存储服务'
        });
      } catch (error) {
        console.error('获取设置失败:', error);
      }
    };

    fetchSettings();
  }, [images.length]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await getPublicImages(page);
        setImages(prev => page === 1 ? response.images : [...prev, ...response.images]);
        setHasMore(page < response.pagination.last_page);
      } catch (error: any) {
        setError(error.message || '获取图片失败');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [page]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore]);

  return (
    <div className="container mx-auto px-4">
      <DynamicTitle 
        title={settings.site_name}
        description={settings.site_description}
      />
      
      {user ? (
        <WelcomeSection 
          username={user.username}
          imageCount={userStats.imageCount}
          storageUsed={userStats.storageUsed}
        />
      ) : (
        <IntroSection
          siteName={settings.site_name}
          siteDescription={settings.site_description}
          publicImagesCount={publicStats.publicImagesCount}
          totalUsers={publicStats.totalUsers}
          previewImages={images}
        />
      )}

      <PublicGallery
        images={images}
        loading={loading}
        error={error}
        hasMore={hasMore}
        page={page}
        loadMore={loadMore}
      />
    </div>
  );
};

export default HomePage;
