import React from 'react';

export function Card({
  children,
  className = '',
  hoverable = false,
  onClick,
}) {
  return (
    <div
      className={`editorial-card p-6 ${
        hoverable ? 'hover:shadow-warm-lg cursor-pointer transition-shadow' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`pb-4 border-b border-sand ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`pt-4 border-t border-sand flex gap-2 justify-end ${className}`}>
      {children}
    </div>
  );
}
