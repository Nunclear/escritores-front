import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../../components/AppShell';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import EditorialButton from '../../components/ui/EditorialButton';
import { useAuth } from '../../context/AuthContext';
import { Users, MessageCircle, BookOpen, UserMinus } from 'lucide-react';

export default function FollowingPage() {
  const { user } = useAuth();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFollowing = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Connect to actual following service
        // For now, showing the structure
        setFollowing([]);
      } catch (err) {
        console.error('Error loading following:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadFollowing();
    }
  }, [user?.id]);

  const handleUnfollow = async (authorId) => {
    if (window.confirm('¿Estás seguro de que deseas dejar de seguir a este autor?')) {
      try {
        // TODO: Connect to actual follow service
        alert('Dejaste de seguir al autor (integración pendiente)');
        setFollowing(following.filter((a) => a.id !== authorId));
      } catch (err) {
        console.error('Error unfollowing:', err);
        alert('Error al dejar de seguir');
      }
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-[var(--color-text)] mb-2">
            Siguiendo
          </h1>
          <p className="text-[var(--color-muted)] font-sans">
            Autores cuyo trabajo estás siguiendo.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error.message} onRetry={() => window.location.reload()} />
        ) : following.length === 0 ? (
          <EmptyState
            title="No sigues a nadie"
            message="Comienza a seguir autores para estar al tanto de sus nuevas historias."
            icon="📖"
            action="Explorar Autores"
            onAction={() => (window.location.href = '/autores')}
          />
        ) : (
          <div className="space-y-4">
            {following.map((author) => (
              <div
                key={author.id}
                className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-[var(--shadow-soft)] transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-light-accent)] to-[var(--color-sand)] flex-shrink-0 flex items-center justify-center text-2xl overflow-hidden">
                    {author.avatarUrl ? (
                      <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <Link
                      to={`/autores/${author.id}`}
                      className="font-serif font-bold text-lg text-[var(--color-text)] hover:text-[var(--color-brown)] transition-colors"
                    >
                      {author.name}
                    </Link>
                    <p className="text-sm text-[var(--color-muted)] font-sans mb-2">
                      {author.email}
                    </p>
                    <div className="flex gap-4 text-xs text-[var(--color-muted)] font-sans">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {author.storyCount || 0} historias
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {author.followerCount || 0} seguidores
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {author.rating?.toFixed(1) || '0.0'} ⭐
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link to={`/autores/${author.id}`}>
                    <EditorialButton variant="secondary">
                      Ver Perfil
                    </EditorialButton>
                  </Link>
                  <button
                    onClick={() => handleUnfollow(author.id)}
                    className="px-3 py-2 rounded-lg border border-red-200 text-red-600 font-sans font-semibold text-sm hover:bg-red-50 transition-all flex items-center gap-2"
                    title="Dejar de seguir"
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
