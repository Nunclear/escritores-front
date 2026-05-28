import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../../components/AppShell';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import EditorialButton from '../../components/ui/EditorialButton';
import { useAuth } from '../../context/AuthContext';
import { Users, MessageCircle, BookOpen } from 'lucide-react';

export default function FollowersPage() {
  const { user } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFollowers = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Connect to actual followers service
        // For now, showing the structure
        setFollowers([]);
      } catch (err) {
        console.error('Error loading followers:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadFollowers();
    }
  }, [user?.id]);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-[var(--color-text)] mb-2">
            Mis Seguidores
          </h1>
          <p className="text-[var(--color-muted)] font-sans">
            Personas que siguen tu perfil y disfrutan de tus historias.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error.message} onRetry={() => window.location.reload()} />
        ) : followers.length === 0 ? (
          <EmptyState
            title="Sin seguidores"
            message="Aún no tienes seguidores. ¡Sigue escribiendo para atraer a tu audiencia!"
            icon="👥"
            action="Ver Mi Perfil"
            onAction={() => (window.location.href = '/perfil')}
          />
        ) : (
          <div className="space-y-4">
            {followers.map((follower) => (
              <div
                key={follower.id}
                className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-[var(--shadow-soft)] transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-light-accent)] to-[var(--color-sand)] flex-shrink-0 flex items-center justify-center text-2xl overflow-hidden">
                    {follower.avatarUrl ? (
                      <img src={follower.avatarUrl} alt={follower.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <Link
                      to={`/autores/${follower.id}`}
                      className="font-serif font-bold text-lg text-[var(--color-text)] hover:text-[var(--color-brown)] transition-colors"
                    >
                      {follower.name}
                    </Link>
                    <p className="text-sm text-[var(--color-muted)] font-sans mb-2">
                      {follower.email}
                    </p>
                    <div className="flex gap-4 text-xs text-[var(--color-muted)] font-sans">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {follower.storyCount || 0} historias
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {follower.followerCount || 0} seguidores
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {follower.rating?.toFixed(1) || '0.0'} ⭐
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/autores/${follower.id}`}>
                  <EditorialButton variant="secondary">
                    Ver Perfil
                  </EditorialButton>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
