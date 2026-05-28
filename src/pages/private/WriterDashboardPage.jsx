import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/AppShell';
import { LoadingCard } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import EditorialButton from '../../components/ui/EditorialButton';
import { storiesService } from '../../services/storiesService';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Plus, Eye, Heart, MessageCircle, MoreVertical, Archive, Trash2, Edit } from 'lucide-react';

export default function WriterDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, published, drafts, archived

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        if (filter === 'drafts') {
          response = await storiesService.getMyDrafts({ size: 100 });
        } else if (filter === 'archived') {
          response = await storiesService.getMyArchived({ size: 100 });
        } else {
          response = await storiesService.getUserStories(user?.id, { size: 100 });
        }

        setStories(response.content || []);
      } catch (err) {
        console.error('Error loading stories:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadStories();
    }
  }, [filter, user?.id]);

  const handleDeleteStory = async (storyId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta historia?')) {
      try {
        await storiesService.deleteStory(storyId);
        setStories(stories.filter((s) => s.id !== storyId));
      } catch (err) {
        console.error('Error deleting story:', err);
        alert('Error al eliminar la historia');
      }
    }
  };

  const handleArchiveStory = async (storyId, isArchived) => {
    try {
      if (isArchived) {
        await storiesService.restoreStory(storyId);
      } else {
        await storiesService.archiveStory(storyId);
      }
      // Reload stories
      window.location.reload();
    } catch (err) {
      console.error('Error archiving story:', err);
      alert('Error al archivar la historia');
    }
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold text-[var(--color-text)] mb-2">
              Mis Historias
            </h1>
            <p className="text-[var(--color-muted)] font-sans">
              Gestiona, publica y organiza todas tus obras literarias.
            </p>
          </div>
          <EditorialButton
            onClick={() => navigate('/app/historia/nueva')}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Historia
          </EditorialButton>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 border-b border-[var(--color-border)] pb-4">
          {[
            { value: 'all', label: 'Todas' },
            { value: 'published', label: 'Publicadas' },
            { value: 'drafts', label: 'Borradores' },
            { value: 'archived', label: 'Archivadas' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-full font-sans font-semibold text-sm transition-all ${
                filter === tab.value
                  ? 'bg-[var(--color-brown)] text-white'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error.message} onRetry={() => window.location.reload()} />
        ) : stories.length === 0 ? (
          <EmptyState
            title="Sin historias"
            message={
              filter === 'drafts'
                ? 'Aún no tienes borradores. ¡Comienza a escribir!'
                : filter === 'archived'
                ? 'No hay historias archivadas'
                : 'Aún no has publicado historias. ¡Crea tu primera obra!'
            }
            icon={filter === 'drafts' ? '📝' : filter === 'archived' ? '📦' : '✍️'}
            action={filter !== 'archived' ? 'Crear Historia' : undefined}
            onAction={filter !== 'archived' ? () => navigate('/app/historia/nueva') : undefined}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <div
                key={story.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:shadow-[var(--shadow-warm-lg)] transition-shadow group"
              >
                {/* Cover */}
                <div className="relative h-40 bg-gradient-to-br from-[var(--color-light-accent)] to-[var(--color-sand)] overflow-hidden">
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
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        story.publicationState === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700'
                          : story.publicationState === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {story.publicationState === 'PUBLISHED'
                        ? 'Publicada'
                        : story.publicationState === 'DRAFT'
                        ? 'Borrador'
                        : 'Archivada'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[var(--color-text)] line-clamp-2 mb-1">
                      {story.title}
                    </h3>
                    <p className="text-xs text-[var(--color-muted)] font-sans line-clamp-2">
                      {story.description}
                    </p>
                  </div>

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
                      <Heart className="w-4 h-4" />
                      {story.favoriteCount || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {story.commentCount || 0}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to={`/app/historia/${story.id}`} className="flex-1">
                      <button className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] font-sans font-semibold text-sm hover:border-[var(--color-brown)] hover:text-[var(--color-brown)] transition-all flex items-center justify-center gap-2">
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                    </Link>
                    <button
                      onClick={() => handleArchiveStory(story.id, story.visibilityState === 'ARCHIVED')}
                      className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] font-sans font-semibold text-sm hover:border-[var(--color-brown)] hover:text-[var(--color-brown)] transition-all"
                      title={story.visibilityState === 'ARCHIVED' ? 'Restaurar' : 'Archivar'}
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="px-3 py-2 rounded-lg border border-red-200 text-red-600 font-sans font-semibold text-sm hover:bg-red-50 transition-all"
                      title="Eliminar"
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
