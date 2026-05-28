import React from 'react';
import { EditorialButton } from './EditorialButton';

export function ErrorState({
  title = 'Oops, algo salió mal',
  message = 'Algo inesperado ocurrió. Por favor intenta de nuevo más tarde.',
  onRetry,
  action = 'Reintentar',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6 text-center max-w-md mx-auto">
      <div className="text-red-wine text-5xl">⚠️</div>
      <h3 className="text-xl font-serif font-bold text-text-primary">{title}</h3>
      <p className="text-text-secondary font-sans text-sm">{message}</p>
      {onRetry && (
        <EditorialButton variant="primary" onClick={onRetry}>
          {action}
        </EditorialButton>
      )}
    </div>
  );
}

export function ErrorAlert({ message, onDismiss }) {
  return (
    <div className="bg-red-wine/10 border border-red-wine/20 rounded-editorial p-4 flex items-start gap-3">
      <span className="text-red-wine text-xl flex-shrink-0">⚠️</span>
      <div className="flex-1">
        <p className="text-red-wine font-sans text-sm">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-wine hover:text-red-wine/70 flex-shrink-0 text-lg"
        >
          ×
        </button>
      )}
    </div>
  );
}
