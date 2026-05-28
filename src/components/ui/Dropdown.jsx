import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function Dropdown({
  trigger,
  items = [],
  onSelect,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    onSelect?.(item);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        {trigger}
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-surface border border-sand rounded-editorial shadow-lg z-50">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(item)}
              className={`w-full text-left px-4 py-2 font-sans text-sm ${
                idx !== 0 ? 'border-t border-sand' : ''
              } hover:bg-surface-secondary transition-colors ${
                item.divider ? 'border-b border-sand' : ''
              }`}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
