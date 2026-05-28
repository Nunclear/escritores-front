import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../../components/AppShell';
import { LoadingCard } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { favoritesService } from '../../services/favoritesService';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Eye, Heart, MessageCircle, Trash2 } from 'lucide-react';

export default function UserFavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recent'); // recent, oldest, title, author

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await favoritesService.getMyFavorites({ size: 100 });
        setFavorites(data.content || []);
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadFavorites();
    }
  }, [user?.id]);

  const handleRemoveFavorite = async (storyId) => {
    try {
      await favoritesService.removeFavorite(storyId);
      setFavorites(favorites.filter((f) => f.id !== storyId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      alert('Error al eliminar de favoritos');
    }
  };

  const getSortedFavorites = () => {
    const sorted = [...favorites];
    switch (sortBy) {
      case 'oldest':
        return sorted.reverse();
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'author':
        return sorted.sort((a, b) => (a.author?.name || '').localeCompare(b.author?.name || ''));
      case 'recent':
      default:
        return sorted;
    }
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-[var(--color-text)] mb-2">
            Mis Favoritos
          </h1>
          <p className="text-[var(--color-muted)] font-sans">
            Historias que has guardado para leer más tarde.
          </p>
        </div>

        {/* Sort Options */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {[
            { value: 'recent', label: 'Más recientes' },
            { value: 'oldest', label: 'Más antiguas' },
            { value: 'title', label: 'Por título' },
            { value: 'author', label: 'Por autor' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`px-4 py-2 rounded-full font-sans font-semibold text-sm whitespace-nowrap transition-all ${
                sortBy === option.value
                  ? 'bg-[var(--color-brown)] text-white'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingCard count={6} />
          </div>
        ) : error ? (
          <ErrorState message={error.message} onRetry={() => window.location.reload()} />
        ) : favorites.length === 0 ? (
          <EmptyState
            title="Sin favoritos"
            message="Aún no has guardado historias favoritas. ¡Explora y guarda tus lecturas preferidas!"
            icon="❤️"
            action="Explorar Historias"
            onAction={() => (window.location.href = '/explorar')}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getSortedFavorites().map((story) => (
              <div
                key={story.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:shadow-[var(--shadow-warm-lg)] transition-shadow group"
              >
                {/* Cover */}
                <Link to={`/story/${story.id}`} className="block relative h-40 bg-gradient-to-br from-[var(--color-light-accent)] to-[var(--color-sand)] overflow-hidden">
                  {story.coverImageUrl ? (
                    <img
                      src={story.coverImageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-[var(--color-brown)] opacity-50" />
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <Link to={`/story/${story.id}`} className="group/link">
                    <h3 className="font-serif font-bold text-lg text-[var(--color-text)] line-clamp-2 group-hover/link:text-[var(--color-brown)] transition-colors">
                      {story.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[var(--color-muted)] font-sans line-clamp-2">
                    {story.description}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-4 text-xs text-[var(--color-muted)] font-sans py-3 border-y border-[var(--color-border)]">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {story.chapterCount || 0} cap.
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {story.viewCount || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {story.commentCount || 0}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to={`/story/${story.id}`} className="flex-1">
                      <button className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] font-sans font-semibold text-sm hover:border-[var(--color-brown)] hover:text-[var(--color-brown)] transition-all">
                        Leer
                      </button>
                    </Link>
                    <button
                      onClick={() => handleRemoveFavorite(story.id)}
                      className="px-3 py-2 rounded-lg border border-red-200 text-red-600 font-sans font-semibold text-sm hover:bg-red-50 transition-all"
                      title="Eliminar de favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
