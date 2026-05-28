import React from 'react';
import { EditorialButton } from './EditorialButton';

export function PaginationControls({
  currentPage = 0,
  totalPages = 1,
  onPageChange,
  totalItems,
  pageSize = 20,
}) {
  const hasNextPage = currentPage < totalPages - 1;
  const hasPrevPage = currentPage > 0;
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (hasPrevPage) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-6 border-t border-cream">
      <div className="text-text-secondary font-sans text-sm">
        {totalItems > 0 && (
          <>
            Mostrando <span className="font-medium">{startItem}</span> a{' '}
            <span className="font-medium">{endItem}</span> de{' '}
            <span className="font-medium">{totalItems}</span>
          </>
        )}
      </div>

      <div className="flex gap-2">
        <EditorialButton
          variant="secondary"
          size="sm"
          disabled={!hasPrevPage}
          onClick={handlePrev}
        >
          ← Anterior
        </EditorialButton>

        <div className="flex items-center gap-2 px-4">
          <span className="text-text-secondary font-sans text-sm">
            Página {currentPage + 1} de {totalPages}
          </span>
        </div>

        <EditorialButton
          variant="secondary"
          size="sm"
          disabled={!hasNextPage}
          onClick={handleNext}
        >
          Siguiente →
        </EditorialButton>
      </div>
    </div>
  );
}

export function SimplePagination({
  currentPage = 0,
  totalPages = 1,
  onPageChange,
}) {
  const hasNextPage = currentPage < totalPages - 1;
  const hasPrevPage = currentPage > 0;

  return (
    <div className="flex gap-2 justify-center py-6">
      <EditorialButton
        variant="secondary"
        size="sm"
        disabled={!hasPrevPage}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Anterior
      </EditorialButton>

      <div className="flex items-center gap-1 px-4">
        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`w-8 h-8 rounded-full font-sans text-sm transition-colors ${
              currentPage === i
                ? 'bg-coffee text-surface'
                : 'bg-cream text-text-primary hover:bg-surface-secondary'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <EditorialButton
        variant="secondary"
        size="sm"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Siguiente →
      </EditorialButton>
    </div>
  );
}
