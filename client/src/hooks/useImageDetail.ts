import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageById, deleteImage } from '../services/imageService';
import { ImageData } from '../types/image';
import { fixImageUrl } from '../utils/imageUtils';
import { useAuth } from '../context/AuthContext';

export const useImageDetail = (imageId: number) => {
  const [image, setImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // 获取图片数据
  useEffect(() => {
    const fetchImage = async () => {
      if (!imageId) return;
      
      try {
        setLoading(true);
        const imageData = await getImageById(imageId);
        setImage(imageData);
      } catch (err: any) {
        setError(err.message || '获取图片失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchImage();
  }, [imageId]);

  // 删除图片
  const handleDelete = async () => {
    if (!image) return;
    if (!window.confirm('确定要删除这张图片吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      await deleteImage(image.id);
      navigate('/user/images');
    } catch (err: any) {
      setError(err.message || '删除图片失败');
    }
  };

  // 下载图片
  const handleDownload = async () => {
    if (!image) return;
    
    try {
      const imageUrl = fixImageUrl(image.url);
      
      setDownloading(true);
      
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('下载图片失败，请稍后再试');
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = image.original_name || `image-${image.id}`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      setDownloading(false);
    } catch (err: any) {
      console.error('下载错误:', err);
      setError(err.message || '下载图片失败');
      setDownloading(false);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(() => {
          fallbackCopyToClipboard(text);
        });
    } else {
      fallbackCopyToClipboard(text);
    }
  };

  // 备用复制方法
  const fallbackCopyToClipboard = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        setError('复制失败，请手动选择并复制');
      }
    } catch (err) {
      setError('复制失败，请手动选择并复制');
    }
  };

  // 检查用户是否可以编辑图片
  const canEdit = user && image && (user.id === image.user_id || user.role === 'admin');

  return {
    image,
    loading,
    error,
    copySuccess,
    downloading,
    canEdit,
    handleDelete,
    handleDownload,
    copyToClipboard,
    fixImageUrl
  };
};
