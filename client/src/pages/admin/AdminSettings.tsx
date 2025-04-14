import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../services/settingService';

const AdminSettings: React.FC = () => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPrivacyPreview, setShowPrivacyPreview] = useState(false);
  const [showTermsPreview, setShowTermsPreview] = useState(false);

  const simpleMarkdownToHtml = (markdown: string) => {
    let html = markdown;
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^(?!<h[1-6]>)(.*?)$/gm, '<p>$1</p>');
    html = html.replace(/<p><\/p>/g, '');
    return html;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await getSettings();
        setFormValues(response.settings || {});
      } catch (err: any) {
        setError('获取设置失败: ' + (err.message || '未知错误'));
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setSaving(true);

      const savePromise = updateSettings(formValues);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('保存请求超时')), 10000);
      });

      await Promise.race([savePromise, timeoutPromise]);

      console.log('正在保存所有设置，包括隐私政策和使用条款');

      setSuccess('设置已成功保存');

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('保存设置出错:', err);
      setError(err.message || '保存设置失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">网站设置</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">基本信息</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                网站名称
              </label>
              <input
                type="text"
                name="site_name"
                value={formValues.site_name || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                网站Logo URL
              </label>
              <input
                type="text"
                name="site_logo"
                value={formValues.site_logo || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                网站描述
              </label>
              <textarea
                name="site_description"
                value={formValues.site_description || ''}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                网站关键词
              </label>
              <input
                type="text"
                name="site_keywords"
                value={formValues.site_keywords || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="关键词1,关键词2,关键词3"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">多个关键词请用逗号分隔</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">图片设置</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                最大文件大小 (MB)
              </label>
              <input
                type="number"
                name="max_file_size"
                value={formValues.max_file_size || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                min="1"
                max="20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                允许的文件类型
              </label>
              <input
                type="text"
                name="allowed_file_types"
                value={formValues.allowed_file_types || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">MIME类型，使用逗号分隔，例如: image/jpeg,image/png</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">用户设置</h2>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="allow_register"
              checked={formValues.allow_register === 'true'}
              onChange={(e) => handleInputChange({
                target: {
                  name: 'allow_register',
                  value: e.target.checked ? 'true' : 'false'
                }
              } as React.ChangeEvent<HTMLInputElement>)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="allow-register" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              允许新用户注册
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">外观设置</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              默认主题
            </label>
            <div className="relative">
              <select
                name="default_theme"
                value={formValues.default_theme || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white rounded-md"
              >
                <option value="light">浅色模式</option>
                <option value="dark">深色模式</option>
                <option value="system">跟随系统</option>
              </select>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              选择网站的默认主题
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">法律文本设置</h2>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                隐私政策
              </label>
              <button
                type="button"
                onClick={() => setShowPrivacyPreview(!showPrivacyPreview)}
                className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400"
              >
                {showPrivacyPreview ? '返回编辑' : '预览'}
              </button>
            </div>

            {showPrivacyPreview ? (
              <div className="border p-4 rounded-md bg-gray-50 dark:bg-gray-700 h-64 overflow-auto">
                <div className="prose dark:prose-invert max-w-none" 
                     dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(formValues.privacy_policy || '') }}>
                </div>
              </div>
            ) : (
              <textarea
                name="privacy_policy"
                value={formValues.privacy_policy || ''}
                onChange={handleInputChange}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="在此输入隐私政策内容，支持Markdown格式"
              />
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              支持Markdown格式，将显示在隐私政策页面
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                使用条款
              </label>
              <button
                type="button"
                onClick={() => setShowTermsPreview(!showTermsPreview)}
                className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400"
              >
                {showTermsPreview ? '返回编辑' : '预览'}
              </button>
            </div>

            {showTermsPreview ? (
              <div className="border p-4 rounded-md bg-gray-50 dark:bg-gray-700 h-64 overflow-auto">
                <div className="prose dark:prose-invert max-w-none"
                     dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(formValues.terms_of_service || '') }}>
                </div>
              </div>
            ) : (
              <textarea
                name="terms_of_service"
                value={formValues.terms_of_service || ''}
                onChange={handleInputChange}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="在此输入使用条款内容，支持Markdown格式"
              />
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              支持Markdown格式，将显示在使用条款页面
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 rounded-md text-white ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {saving ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                保存中...
              </div>
            ) : '保存设置'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
