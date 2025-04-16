import React from 'react';
import { Link } from 'react-router-dom';
import { ImageData } from '../../types/image';

interface IntroSectionProps {
  siteName: string;
  siteDescription: string;
  publicImagesCount: number;
  totalUsers: number;
  previewImages: ImageData[];
}

const IntroSection: React.FC<IntroSectionProps> = ({ 
  siteName, 
  siteDescription, 
  publicImagesCount, 
  totalUsers, 
  previewImages 
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-lg overflow-hidden mb-10">
      <div className="relative p-8">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-300 opacity-20 rounded-full"></div>
        
        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{siteName}</h1>
            <p className="text-lg md:text-xl mb-6 text-blue-100">{siteDescription}</p>
            
            <div className="space-y-4 mt-6">
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>轻松上传和分享图片</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>永久保存，随时查看</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>支持多种格式，安全可靠</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/upload" className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg shadow-md transition duration-300">
                立即体验
              </Link>
              <Link to="/register" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition duration-300">
                免费注册
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex justify-center items-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 max-w-xs">
              <div className="flex items-end justify-center space-x-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{publicImagesCount || 0}</div>
                  <div className="text-sm text-blue-100">公开图片</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{totalUsers || 0}</div>
                  <div className="text-sm text-blue-100">注册用户</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm text-blue-100">免费使用</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {previewImages.slice(0, 6).map((image, index) => (
                  <div key={`preview-${image.id || index}`} className="aspect-square overflow-hidden rounded-lg bg-gray-200">
                    <img 
                      src={image.thumbnail_url || image.url} 
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
