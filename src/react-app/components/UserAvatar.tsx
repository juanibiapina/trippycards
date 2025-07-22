import React from 'react';
import type { UserData } from '../hooks/useUsers';

interface UserAvatarProps {
  user: UserData;
  size?: number;
  className?: string;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 32, className = '' }) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold overflow-hidden border border-gray-300 ${className}`}
      style={{ width: size, height: size }}
      title={user.name}
    >
      {user.profileImage ? (
        <img
          src={user.profileImage}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-sm">{getInitials(user.name)}</span>
      )}
    </div>
  );
};

export default UserAvatar;