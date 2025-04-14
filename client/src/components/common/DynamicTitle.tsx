import React, { useEffect } from 'react';

interface DynamicTitleProps {
  title: string;
  description?: string;
  keywords?: string;
}

const DynamicTitle: React.FC<DynamicTitleProps> = ({ 
  title, 
  description, 
  keywords 
}) => {
  useEffect(() => {
    // 更新页面标题
    document.title = title;
    
    // 更新页面描述
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
    
    // 更新页面关键词
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // 清理函数
    return () => {
      // 组件卸载时可以选择不做任何事情
    };
  }, [title, description, keywords]);

  // 这个组件不渲染任何可见内容
  return null;
};

export default DynamicTitle;
