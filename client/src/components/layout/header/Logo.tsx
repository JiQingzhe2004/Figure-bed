import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  siteName: string;
  siteLogo: string;
}

const Logo: React.FC<LogoProps> = ({ siteName, siteLogo }) => {
  return (
    <Link to="/" className="group flex items-center">
      <div className="relative overflow-hidden">
        {siteLogo ? (
          <img src={siteLogo} alt="网站Logo" className="h-6 w-auto md:h-7 md:w-auto object-contain transform transition-transform" />
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-[1px] opacity-80 transition-opacity"></div>
            <div className="relative text-white text-base md:text-xl p-1 md:p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
        
        <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-0 group-hover:opacity-10 transition-opacity"></div>
      </div>
      
      <div className="ml-2 md:ml-3 relative overflow-hidden">
        <span className="font-bold text-base md:text-xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
          {siteName}
        </span>
        <div className="h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></div>
      </div>
    </Link>
  );
};

export default Logo;
