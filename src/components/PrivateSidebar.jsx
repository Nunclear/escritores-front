import React from 'react';
import { NavLink } from 'react-router-dom';

const NAVIGATION_SECTIONS = {
  USER: [
    {
      label: 'MESA DE TRABAJO',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Mis Historias', path: '/stories', icon: '📖' },
        { name: 'Borradores', path: '/stories?tab=drafts', icon: '✏️' },
        { name: 'Favoritos', path: '/favorites', icon: '❤️' },
        { name: 'Autores Seguidos', path: '/following', icon: '👥' },
      ],
    },
    {
      label: 'HERRAMIENTAS',
      items: [
        { name: 'Nueva Historia', path: '/stories/new', icon: '✨' },
        { name: 'Worldbuilding', path: '/worldbuilding', icon: '🌍' },
        { name: 'Métricas', path: '/metrics', icon: '📈' },
      ],
    },
    {
      label: 'CUENTA',
      items: [
        { name: 'Perfil', path: '/profile', icon: '👤' },
        { name: 'Configuración', path: '/settings', icon: '⚙️' },
      ],
    },
  ],
  MODERATOR: [
    {
      label: 'MODERACIÓN',
      items: [
        { name: 'Dashboard Mod', path: '/moderation', icon: '👮' },
        { name: 'Reportes', path: '/moderation/reports', icon: '🚩' },
        { name: 'Sanciones', path: '/moderation/sanctions', icon: '⚠️' },
        { name: 'Comentarios Ocultos', path: '/moderation/hidden-comments', icon: '🔒' },
      ],
    },
  ],
  ADMIN: [
    {
      label: 'ADMINISTRACIÓN',
      items: [
        { name: 'Dashboard Admin', path: '/admin', icon: '👑' },
        { name: 'Usuarios', path: '/admin/users', icon: '👥' },
        { name: 'Comunicados', path: '/admin/notices', icon: '📢' },
        { name: 'Actividad del Sistema', path: '/admin/activity', icon: '🔍' },
      ],
    },
  ],
};

export function PrivateSidebar({ userRole = 'USER', isOpen = true }) {
  const sections = NAVIGATION_SECTIONS[userRole] || NAVIGATION_SECTIONS.USER;

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:block bg-surface border-r border-cream pt-4 overflow-y-auto">
      {/* Logo */}
      <div className="px-6 mb-8">
        <h1 className="font-serif text-2xl font-bold text-coffee">Escritores</h1>
      </div>

      {/* Navigation Sections */}
      <nav className="space-y-6 px-4">
        {sections.map((section) => (
          <div key={section.label}>
            <h6 className="px-2 text-xs font-sans font-bold text-text-secondary uppercase tracking-wider mb-3">
              {section.label}
            </h6>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg font-sans text-sm transition-colors ${
                        isActive
                          ? 'bg-cream text-coffee font-medium'
                          : 'text-text-secondary hover:bg-surface-secondary text-text-primary'
                      }`
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
