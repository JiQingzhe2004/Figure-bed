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
    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-fuchsia-600 text-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-purple-400/20">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-pink-500/40 to-purple-500/40 opacity-30 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-blue-500/30 to-indigo-500/30 opacity-30 rounded-full blur-2xl"></div>
        
        {/* 波浪装饰 */}
        <svg className="absolute bottom-0 left-0 right-0 opacity-10" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#fff" fillOpacity="1" d="M0,96L48,106.7C96,117,192,139,288,154.7C384,171,480,181,576,165.3C672,149,768,107,864,101.3C960,96,1056,128,1152,138.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        
        {/* 网格装饰 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-30"></div>
      </div>
      
      <div className="relative p-8 md:p-10">
        <div className="grid md:grid-cols-2 gap-10 relative z-10">
          <div>
            <div className="flex items-center mb-3">
              <div className="w-10 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mr-3"></div>
              <span className="text-purple-200 font-medium tracking-wide">产品介绍</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
              {siteName}
            </h1>
            <p className="text-lg md:text-xl mb-6 text-purple-100 leading-relaxed">
              {siteDescription}
            </p>
            
            <div className="space-y-5 mt-8">
              {[
                '轻松上传和分享图片',
                '永久保存，随时查看',
                '支持多种格式，安全可靠'
              ].map((feature, index) => (
                <div key={index} className="flex items-center group">
                  <div className="bg-white/20 group-hover:bg-white/30 p-2 rounded-xl mr-4 transition-all duration-300 border border-white/10">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/upload" className="group bg-white text-purple-700 font-medium py-3 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/20 hover:translate-y-[-2px]">
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  立即体验
                </span>
              </Link>
              <Link to="/register" className="group bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white font-medium py-3 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-pink-500/30 hover:translate-y-[-2px]">
                免费注册
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-inner border border-white/10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-center space-x-6 mb-6">
                {[
                  { value: publicImagesCount || 0, label: '公开图片' },
                  { value: totalUsers || 0, label: '注册用户' },
                  { value: '100%', label: '免费使用' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-purple-200">
                      {stat.value}
                    </div>
                    <div className="text-sm text-purple-200 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {previewImages.slice(0, 6).map((image, index) => (
                  <div 
                    key={`preview-${image.id || index}`} 
                    className="aspect-square overflow-hidden rounded-xl bg-gray-200 group hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <img 
                      src={image.thumbnail_url || image.url} 
                      alt=""
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <div className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm">
                  查看更多精彩图片
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
