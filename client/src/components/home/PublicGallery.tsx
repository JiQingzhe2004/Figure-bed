import React from 'react';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import LazyImage from '../image/LazyImage';
import { ImageData } from '../../types/image';

interface PublicGalleryProps {
  images: ImageData[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  loadMore: () => void;
}

const PublicGallery: React.FC<PublicGalleryProps> = ({
  images,
  loading,
  error,
  hasMore,
  page,
  loadMore
}) => {
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">公开图片</h2>
      <hr className="my-6" />
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto -ml-4"
        columnClassName="pl-4 bg-clip-padding"
      >
        {images.map(image => (
          <div key={image.id} className="mb-4 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <Link to={`/image/${image.id}`}>
              <div className="relative">
                <LazyImage
                  thumbnailSrc={image.thumbnail_url}
                  src={image.url}
                  alt={image.original_name}
                  className="w-full"
                  aspectRatio={image.width && image.height ? `${image.width} / ${image.height}` : undefined}
                />
                {image.width && image.height && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {image.width} × {image.height}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium truncate">{image.original_name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(image.created_at).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </Masonry>

      {images.length > 0 && (
        <div className="mt-10 text-center pb-6">
          {hasMore ? (
            loading ? (
              <div className="inline-flex items-center text-gray-500 dark:text-gray-400">
                <div className="mr-3 w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                加载更多中...
              </div>
            ) : (
              <button
                onClick={loadMore}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md shadow-md transition"
              >
                加载更多
              </button>
            )
          ) : (
            <p className="text-gray-500 dark:text-gray-400">已经到底啦，没有更多图片了~</p>
          )}
        </div>
      )}

      {loading && page === 1 && images.length === 0 && (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[200px] bg-gray-50 dark:bg-gray-700 rounded-lg">
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg text-gray-500 dark:text-gray-400">暂时没有图片，快来上传第一张吧！</p>
        </div>
      )}
    </div>
  );
};

export default PublicGallery;
