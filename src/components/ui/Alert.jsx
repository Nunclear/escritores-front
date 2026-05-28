import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const ALERT_STYLES = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    textColor: 'text-green-800',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    textColor: 'text-red-800',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-800',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
    iconColor: 'text-blue-600',
    textColor: 'text-blue-800',
  },
};

export function Alert({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) {
  const style = ALERT_STYLES[type] || ALERT_STYLES.info;
  const Icon = style.icon;

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-editorial p-4 flex gap-3 ${className}`}
    >
      <Icon className={`${style.iconColor} flex-shrink-0 mt-0.5`} size={20} />
      <div className="flex-1">
        {title && (
          <h3 className={`${style.textColor} font-serif font-bold`}>
            {title}
          </h3>
        )}
        {message && (
          <p className={`${style.textColor} font-sans text-sm mt-1`}>
            {message}
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${style.textColor} hover:opacity-75 flex-shrink-0`}
        >
          ✕
        </button>
      )}
    </div>
  );
}
