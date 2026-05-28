import React from 'react';

export function LoadingState({ message = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-cream border-t-coffee animate-spin" />
      </div>
      <p className="text-text-secondary font-sans text-sm">{message}</p>
    </div>
  );
}

export function LoadingSkeleton({ count = 3, height = '200px' }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{ height }}
          className="bg-cream rounded-editorial animate-editorial-pulse"
        />
      ))}
    </div>
  );
}

export function LoadingCard({ count = 6 }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="editorial-card space-y-3">
          <div className="w-full h-40 bg-cream rounded-editorial animate-editorial-pulse" />
          <div className="h-4 bg-cream rounded-pill animate-editorial-pulse w-3/4" />
          <div className="h-3 bg-cream rounded-pill animate-editorial-pulse w-1/2" />
        </div>
      ))}
    </div>
  );
}
