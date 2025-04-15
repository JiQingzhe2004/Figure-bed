import React from 'react';

interface AboutSectionProps {
  siteName: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ siteName }) => {
  return (
    <div className="space-y-4 relative">
      <div className="absolute -left-3 top-0 w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center pl-2">
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        关于{siteName}
      </h3>
      <div className="pl-2">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {siteName}是一款设计精美的图片托管服务，为您提供安全、快捷的图片存储和分享解决方案。我们注重用户体验，让您的每一次分享都如此简单。
        </p>
        <div className="pt-4 flex space-x-4">
          {/* Gitee */}
          <a href="https://gitee.com/jiqingzhe/" className="group">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-500 dark:text-blue-400 hover:shadow-md transition-all group-hover:scale-110">
              <svg className="w-5 h-5" viewBox="0 0 1024 1024" fill="currentColor">
                <path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a164.335 164.335 0 0 0 164.334-164.335V480.435a25.293 25.293 0 0 0-25.294-25.293z"/>
              </svg>
            </div>
          </a>
          {/* CSDN */}
          <a href="https://blog.csdn.net/j304028273?spm=1000.2115.3001.5343" className="group">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-500 dark:text-blue-400 hover:shadow-md transition-all group-hover:scale-110">
              <svg className="w-5 h-5" viewBox="0 0 1024 1024" fill="currentColor">
                <path d="M229.12 841.92c-170.88-237.76-46.4-629.12 236.16-716.8 118.4-38.08 262.72-16.96 351.36 74.24 48.64 43.2 1.28 102.4-24.96 141.76-81.92-62.4-179.2-143.04-289.92-102.08C303.36 310.4 232 593.28 338.24 764.8c128 141.44 358.08 94.08 488.64-20.48 42.88 37.12 88.96 112.32 24.64 153.92-182.4 120.96-474.24 120-622.4-56.32z"/>
              </svg>
            </div>
          </a>
          {/* GitHub */}
          <a href="https://github.com/JiQingzhe2004/" className="group">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-500 dark:text-blue-400 hover:shadow-md transition-all group-hover:scale-110">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
          </a>
          {/* 抖音 */}
          <a href="https://www.douyin.com/user/MS4wLjABAAAAnB8dkCUz4n75aT3gTPyPXWHLLI93elB4PRQjCLgiE3QJES43z76OernKbls95D4c?from_tab_name=main" className="group">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-500 dark:text-blue-400 hover:shadow-md transition-all group-hover:scale-110">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
          </a>
          {/* 哔哩哔哩 */}
          <a href="https://space.bilibili.com/473072921?spm_id_from=333.1007.0.0" className="group">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-500 dark:text-blue-400 hover:shadow-md transition-all group-hover:scale-110">
              <svg className="w-5 h-5" viewBox="0 0 1024 1024" fill="currentColor">
                <path d="M931.314 858.548l-0.032-547.662 0.031-1.961c0.069-5.214 0.18-16.791-6.55-23.632-2.941-2.969-8.164-9.353-16.451-9.353H613.097l122.489-174.069c7.306-10.536 4.668-23.583-5.878-30.881-10.541-7.295-25.01-6.803-32.308 3.741l-140.777 201.21h-46.897c-1.327 0-2.757 0.626-4.383-0.236L257.162 145.053c-11.312-6.019-25.374-1.017-31.406 10.306-6.023 11.321-1.734 22.885 9.597 28.914l176.92 91.667H124.264c-15.969 0-31.593 18.715-31.593 34.718v545.707c0 16.002 15.625 30.833 31.593 30.833h61.479c3.053 16.166 13.506 40.374 22.83 50.064 12.982 13.506 30.132 20.661 45.859 20.661h0.035c17.992 0 36.987-8.015 50.818-22.833 8.916-9.542 19.096-31.725 22.722-47.892h368.611c3.045 16.166 13.506 40.374 22.821 50.064 12.991 13.506 30.141 20.661 45.859 20.661h0.062c17.973 0 36.96-8.015 50.792-22.833 8.914-9.542 19.096-31.725 22.729-47.892h69.432c8.286 0 13.509-4.439 16.451-7.41 6.73-6.835 6.619-16.016 6.55-21.24z M837.595 401.868c0.902-3.673 3.509-13.054-2.539-20.73-3.743-4.784-8.851-8.204-15.305-8.204h-608.25c-11.596 0-31.94 10.126-31.94 29.194v371.638c0 22.404 21.187 27.555 31.94 27.555h608.25c6.014 0 11.627-1.191 15.344-5.699 6.388-7.749 2.531-16.312 1.552-21.276-0.111-0.65-2.379-0.77-2.383-0.77v0.095-0.095l2.002-370.442 1.329-1.266z"/>
              </svg>
            </div>
          </a>
          {/* 知乎 */}
          <a href="https://www.zhihu.com/people/aiqji" className="group">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-500 dark:text-blue-400 hover:shadow-md transition-all group-hover:scale-110">
              <svg className="w-5 h-5" viewBox="0 0 1024 1024" fill="currentColor">
                <path d="M576.8 807.52h57.28l20.8 72.48 100.8-72.48h141.92V229.28H576.8z m67.84-513.92H832v448h-66.24l-85.12 64.96-18.56-64.96h-17.44zM126.4 884.48a149.44 149.44 0 0 0 123.84-10.4c60.96-36 105.92-194.56 105.92-194.56l144 177.44s13.12-84.48-2.24-108.32-99.04-119.84-99.04-119.84l-36.64 32 26.08-104.96H544s0-61.76-30.56-65.28-125.44 0-125.44 0v-192H528s-1.6-64-28.8-64H270.56l35.52-104.64s-57.6 3.36-77.92 39.36-86.4 221.6-86.4 221.6 21.92 10.24 59.2-17.28a147.68 147.68 0 0 0 49.28-75.52l67.84-3.36L320 491.2s-116.96-1.76-140.64 0-37.28 65.28-37.28 65.28H320s-15.2 108.16-60.96 187.2-132.64 140.8-132.64 140.8z" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
