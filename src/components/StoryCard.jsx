import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { getInitials } from '../utils/helpers';

export function StoryCard({
  story,
  variant = 'default',
  onClick,
  className = '',
}) {
  const {
    id,
    title,
    slug,
    description,
    coverImageUrl,
    author,
    publicationState,
    visibilityState,
    rating,
    favoriteCount,
    chapterCount,
    viewCount,
  } = story;

  const storyUrl = `/story/${slug || id}`;

  if (variant === 'horizontal') {
    return (
      <Link
        to={storyUrl}
        className={`editorial-card flex gap-4 p-4 hover:shadow-warm-lg transition-shadow cursor-pointer ${className}`}
        onClick={onClick}
      >
        <div className="w-24 h-32 flex-shrink-0 rounded-editorial overflow-hidden bg-cream">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream to-sand">
              <span className="text-2xl font-serif font-bold text-coffee">
                {getInitials(title)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-2 mb-2">
              <h3 className="font-serif font-bold text-lg text-text-primary flex-1 line-clamp-2">
                {title}
              </h3>
              <StatusBadge status={publicationState} />
            </div>
            <p className="text-text-secondary font-sans text-sm line-clamp-2 mb-2">
              {description}
            </p>
            <p className="text-text-secondary font-sans text-xs">
              Por {author?.displayName}
            </p>
          </div>

          <div className="flex gap-4 text-text-secondary font-sans text-xs">
            {rating && <span>⭐ {rating.toFixed(1)}</span>}
            {favoriteCount > 0 && <span>❤️ {favoriteCount}</span>}
            {chapterCount > 0 && <span>📖 {chapterCount} capítulos</span>}
            {viewCount > 0 && <span>👁️ {viewCount} vistas</span>}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={storyUrl}
      className={`editorial-card flex flex-col overflow-hidden hover:shadow-warm-lg transition-shadow cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="relative w-full h-40 bg-cream overflow-hidden rounded-t-editorial">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream to-sand">
            <span className="text-4xl font-serif font-bold text-coffee opacity-50">
              {getInitials(title)}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge status={publicationState} />
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="font-serif font-bold text-lg text-text-primary line-clamp-2">
          {title}
        </h3>

        <p className="text-text-secondary font-sans text-sm line-clamp-2 flex-1">
          {description}
        </p>

        <div className="text-text-secondary font-sans text-xs space-y-1">
          <p>Por {author?.displayName}</p>
          <div className="flex gap-3 flex-wrap">
            {rating && <span>⭐ {rating.toFixed(1)}</span>}
            {favoriteCount > 0 && <span>❤️ {favoriteCount}</span>}
            {chapterCount > 0 && <span>📖 {chapterCount}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function StoryCardGrid({ stories = [], onStoryClick, variant = 'default' }) {
  if (stories.length === 0) {
    return null;
  }

  const gridClass = variant === 'horizontal'
    ? 'space-y-3'
    : 'grid gap-6 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={gridClass}>
      {stories.map((story) => (
        <StoryCard
          key={story.id}
          story={story}
          variant={variant}
          onClick={() => onStoryClick?.(story)}
        />
      ))}
    </div>
  );
}
