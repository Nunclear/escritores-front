import React, { useState } from 'react';

export function Tooltip({ content, children, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute ${positionStyles[position]} bg-text-primary text-surface text-xs px-2 py-1 rounded whitespace-nowrap z-50 font-sans`}
        >
          {content}
          <div className="absolute w-2 h-2 bg-text-primary transform rotate-45" />
        </div>
      )}
    </div>
  );
}
