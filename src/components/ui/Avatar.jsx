import React from 'react';
import { User } from 'lucide-react';

export function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
  onClick,
}) {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (text) => {
    if (!text) return '?';
    return text
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const initials = getInitials(name || alt);

  const baseStyles = `${sizeStyles[size]} rounded-full flex items-center justify-center font-medium flex-shrink-0 ${className}`;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${baseStyles} object-cover cursor-pointer`}
        onClick={onClick}
      />
    );
  }

  return (
    <div
      className={`${baseStyles} bg-gradient-to-br from-coffee to-gold-olive text-surface font-serif font-bold cursor-pointer`}
      onClick={onClick}
    >
      {initials}
    </div>
  );
}

export function AvatarGroup({ avatars = [], max = 3, size = 'sm' }) {
  const displayed = avatars.slice(0, max);
  const remaining = Math.max(0, avatars.length - max);

  const sizeStyles = {
    sm: '-ml-2',
    md: '-ml-3',
    lg: '-ml-4',
    xl: '-ml-6',
  };

  return (
    <div className="flex items-center">
      {displayed.map((avatar, idx) => (
        <div key={idx} className={sizeStyles[size]}>
          <Avatar
            {...avatar}
            size={size}
            className="border-2 border-surface"
          />
        </div>
      ))}
      {remaining > 0 && (
        <div className={sizeStyles[size]}>
          <div className="text-text-secondary font-sans text-xs font-medium">
            +{remaining}
          </div>
        </div>
      )}
    </div>
  );
}
