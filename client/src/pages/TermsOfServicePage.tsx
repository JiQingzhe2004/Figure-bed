import React, { useState, useEffect } from 'react';
import { getSettings } from '../services/settingService';

const TermsOfServicePage: React.FC = () => {
  const [content, setContent] = useState<string>('正在加载...');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await getSettings();
        
        // 获取使用条款内容，简单处理Markdown格式
        let markdownContent = response.settings.terms_of_service || '使用条款内容尚未设置';
        // 替换标题格式
        markdownContent = markdownContent.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
        markdownContent = markdownContent.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
        markdownContent = markdownContent.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
        // 替换段落
        markdownContent = markdownContent.replace(/^(?!<h[1-6]>)(.*?)$/gm, '<p>$1</p>');
        // 移除空段落
        markdownContent = markdownContent.replace(/<p><\/p>/g, '');

        setContent(markdownContent);
      } catch (err) {
        console.error('获取使用条款失败:', err);
        setContent('<p>加载使用条款失败，请稍后再试</p>');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">使用条款</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsOfServicePage;
