import React from 'react';

const BADGE_STYLES = {
  default: 'bg-cream text-coffee border border-sand',
  primary: 'bg-coffee text-surface',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  premium: 'bg-gradient-to-r from-coffee to-gold-olive text-surface',
};

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className = '',
}) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const variantStyle = BADGE_STYLES[variant] || BADGE_STYLES.default;

  return (
    <span
      className={`${variantStyle} ${sizeStyles[size]} rounded-full font-medium font-sans inline-block whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}

export function BadgeGroup({ badges = [], className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((badge, idx) => (
        <Badge key={idx} {...badge}>
          {badge.label || badge.children}
        </Badge>
      ))}
    </div>
  );
}
