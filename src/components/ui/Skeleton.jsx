import React from 'react';

export function Skeleton({ width = 'w-full', height = 'h-4', className = '' }) {
  return (
    <div
      className={`${width} ${height} bg-gradient-to-r from-sand via-cream to-sand animate-pulse rounded ${className}`}
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="editorial-card p-6 space-y-4">
      <Skeleton height="h-6" width="w-3/4" />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            height="h-4"
            width={i === lines - 1 ? 'w-2/3' : 'w-full'}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonAvatar({ size = 'md' }) {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <Skeleton
      width={sizeStyles[size]}
      height={sizeStyles[size]}
      className="rounded-full"
    />
  );
}
