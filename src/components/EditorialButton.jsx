import React from 'react';

const BUTTON_STYLES = {
  primary: 'bg-coffee text-surface hover:bg-red-wine',
  secondary: 'bg-cream text-coffee border border-sand hover:bg-surface',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-secondary',
  danger: 'bg-red-wine text-white hover:bg-red-900',
  success: 'bg-green-success text-white hover:bg-green-600',
  premium: 'bg-gradient-to-r from-coffee to-gold-olive text-surface hover:from-red-wine hover:to-gold-olive',
};

export function EditorialButton({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const baseStyles = 'rounded-pill px-6 py-2 font-sans font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coffee disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-sm px-4 py-1',
    md: 'text-base px-6 py-2',
    lg: 'text-lg px-8 py-3',
  };

  const variantStyles = BUTTON_STYLES[variant] || BUTTON_STYLES.primary;

  const finalClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles} ${className}`;

  return (
    <button
      className={finalClassName}
      disabled={disabled || loading}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {Icon && iconPosition === 'left' && <Icon size={20} />}
        {loading ? (
          <span className="inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          children
        )}
        {Icon && iconPosition === 'right' && <Icon size={20} />}
      </span>
    </button>
  );
}
