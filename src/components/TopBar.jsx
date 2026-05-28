import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditorialButton } from './EditorialButton';

export function TopBar({ user, onLogout }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout?.();
    navigate('/');
    setUserMenuOpen(false);
  };

  const getAvatarUrl = () => {
    if (user?.avatarUrl) return user.avatarUrl;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.loginName || 'user'}`;
  };

  return (
    <header className="bg-surface border-b border-cream sticky top-0 z-40">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Search bar */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Busca historias, capítulos o personajes…"
            className="editorial-input w-full"
            onClick={() => navigate('/search')}
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 ml-6">
          {/* New story button */}
          <EditorialButton
            variant="primary"
            size="sm"
            onClick={() => navigate('/stories/new')}
          >
            + Nueva historia
          </EditorialButton>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 hover:bg-surface-secondary p-1 rounded-full transition-colors"
            >
              <img
                src={getAvatarUrl()}
                alt={user?.displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>

            {/* User dropdown menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-cream rounded-editorial shadow-warm-lg p-2">
                <div className="px-3 py-2 border-b border-cream mb-2">
                  <p className="font-sans font-medium text-text-primary text-sm">
                    {user?.displayName}
                  </p>
                  <p className="font-sans text-xs text-text-secondary">
                    @{user?.loginName}
                  </p>
                </div>

                <nav className="space-y-1">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-secondary text-text-primary font-sans text-sm transition-colors"
                  >
                    Mi Perfil
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-secondary text-text-primary font-sans text-sm transition-colors"
                  >
                    Configuración
                  </button>
                </nav>

                <div className="border-t border-cream pt-2 mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-wine/10 text-red-wine font-sans text-sm transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
