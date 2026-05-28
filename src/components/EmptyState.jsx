import React from 'react';
import { EditorialButton } from './EditorialButton';

export function EmptyState({
  title = 'Sin contenido',
  message = 'No hay nada que mostrar aquí todavía.',
  icon = '📖',
  action,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center max-w-md mx-auto">
      <div className="text-5xl">{icon}</div>
      <h3 className="text-xl font-serif font-bold text-text-primary">{title}</h3>
      <p className="text-text-secondary font-sans text-sm">{message}</p>
      {action && onAction && (
        <EditorialButton variant="primary" onClick={onAction}>
          {action}
        </EditorialButton>
      )}
    </div>
  );
}

export function EmptyListMessage({
  title = 'Lista vacía',
  description = 'No hay elementos para mostrar.',
}) {
  return (
    <div className="text-center py-8">
      <p className="text-text-secondary font-sans text-sm">{title}</p>
      <p className="text-text-secondary font-sans text-xs mt-1">{description}</p>
    </div>
  );
}
