import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSettings } from '../services/settingService';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'light' 
}) => {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // 首次加载时从设置中获取默认主题
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // 首先检查本地存储
        const savedTheme = localStorage.getItem('theme') as ThemeMode;
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeState(savedTheme);
          setIsInitialized(true);
          return;
        }
        
        // 如果本地没有保存，则从服务器获取默认设置
        const { settings } = await getSettings();
        if (settings.default_theme) {
          // 处理跟随系统的情况
          if (settings.default_theme === 'system') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
              setThemeState('dark');
            } else {
              setThemeState('light');
            }
          } else if (settings.default_theme === 'dark' || settings.default_theme === 'light') {
            setThemeState(settings.default_theme);
          }
        }
      } catch (error) {
        console.error('获取主题设置失败:', error);
        // 如果获取失败，应用系统偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setThemeState('dark');
        } else {
          setThemeState('light');
        }
      } finally {
        setIsInitialized(true);
      }
    };

    initializeTheme();
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有当使用系统主题设置时才自动切换
      getSettings().then(response => {
        if (response.settings.default_theme === 'system' && !localStorage.getItem('theme')) {
          setThemeState(e.matches ? 'dark' : 'light');
        }
      }).catch(error => {
        console.error('获取主题设置失败:', error);
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 应用主题到文档元素
  useEffect(() => {
    if (isInitialized) {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, isInitialized]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
