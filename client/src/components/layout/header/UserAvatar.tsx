import React from 'react';

interface UserAvatarProps {
  user: any; // 使用合适的用户类型
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-8 w-8 md:h-10 md:w-10',
    lg: 'h-10 w-10 md:h-12 md:w-12'
  };
  
  if (user && (user.avatar_path || user.avatar_url)) {
    const avatarUrl = user.avatar_url || user.avatar_path;

    return (
      <img 
        src={avatarUrl} 
        alt="用户头像" 
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white/30 shadow-lg`}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.src = `https://ui-avatars.com/api/?name=${user.username}&background=random`;
        }} 
      />
    );
  } else {
    return (
      <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-2 border-white/30`}>
        {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
      </div>
    );
  }
};

export default UserAvatar;
