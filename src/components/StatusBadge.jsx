import React from 'react';

const BADGE_STYLES = {
  draft: {
    bg: 'bg-cream',
    text: 'text-coffee',
    label: 'Borrador',
  },
  published: {
    bg: 'bg-green-success/10',
    text: 'text-green-success',
    label: 'Publicado',
  },
  archived: {
    bg: 'bg-text-secondary/10',
    text: 'text-text-secondary',
    label: 'Archivado',
  },
  public: {
    bg: 'bg-blue-grey/10',
    text: 'text-blue-grey',
    label: 'Público',
  },
  private: {
    bg: 'bg-coffee/10',
    text: 'text-coffee',
    label: 'Privado',
  },
  hidden: {
    bg: 'bg-red-wine/10',
    text: 'text-red-wine',
    label: 'Oculto',
  },
  pending: {
    bg: 'bg-sand/10',
    text: 'text-sand',
    label: 'Pendiente',
  },
  reviewed: {
    bg: 'bg-blue-grey/10',
    text: 'text-blue-grey',
    label: 'Revisado',
  },
  resolved: {
    bg: 'bg-green-success/10',
    text: 'text-green-success',
    label: 'Resuelto',
  },
};

export function StatusBadge({ status, label }) {
  const style = BADGE_STYLES[status];

  if (!style) {
    return null;
  }

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-sans font-medium border border-opacity-20 ${style.bg} ${style.text}`}
    >
      {label || style.label}
    </span>
  );
}
