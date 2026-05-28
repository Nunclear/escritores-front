import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PublicNavbar from '../../components/layout/PublicNavbar';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import EditorialButton from '../../components/ui/EditorialButton';
import { favoritesService } from '../../services/favoritesService';
import { storiesService } from '../../services/storiesService';
import { chaptersService } from '../../services/chaptersService';
import { ratingsService } from '../../services/ratingsService';
import { commentsService } from '../../services/commentsService';
import { useAuth } from '../../context/AuthContext';
import { Star, Heart, Eye, Book, MessageCircle, Share2 } from 'lucide-react';

export default function StoryDetailPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const loadStoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [storyData, chaptersData, commentsData] = await Promise.all([
          storiesService.getStory(storyId),
          chaptersService.getPublishedChapters(storyId, { size: 100 }),
          commentsService.getStoryComments(storyId, { size: 10 }),
        ]);

        setStory(storyData);
        setChapters(chaptersData.content || []);
        setComments(commentsData.content || []);

        // Load user's favorite status if authenticated
        if (user) {
          try {
            const favorites = await favoritesService.getUserFavorites({ size: 1000 });
            const isFav = favorites.content?.some((fav) => fav.storyId === storyId);
            setIsFavorite(isFav || false);
          } catch (err) {
            console.error('Error loading favorites:', err);
          }
        }
      } catch (err) {
        console.error('Error loading story:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadStoryData();
  }, [storyId, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await favoritesService.removeFavorite(storyId);
      } else {
        await favoritesService.addFavorite({ storyId });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleRateStory = async (rating) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await ratingsService.createRating({
        storyId,
        rating,
      });
      setUserRating(rating);
    } catch (err) {
      console.error('Error rating story:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <PublicNavbar />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <PublicNavbar />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <ErrorState message={error?.message || 'Historia no encontrada'} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <PublicNavbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header with Cover */}
        <div className="grid md:grid-cols-[1fr_2fr] gap-8 mb-12">
          {/* Cover Image */}
          <div className="h-80 rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] flex-shrink-0">
            {story.coverImageUrl ? (
              <img
                src={story.coverImageUrl}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-light-accent)] to-[var(--color-sand)]">
                <Book className="w-16 h-16 text-[var(--color-brown)] opacity-50" />
              </div>
            )}
          </div>

          {/* Story Info */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-light-accent)] text-[var(--color-brown)] text-xs font-semibold uppercase tracking-wider">
                  {story.genre || 'Ficción'}
                </span>
              </div>

              <h1 className="font-serif text-4xl font-bold text-[var(--color-text)] mb-3">
                {story.title}
              </h1>

              <p className="text-[var(--color-muted)] font-sans mb-6">
                Por <span className="font-semibold text-[var(--color-text)]">{story.author?.displayName}</span>
              </p>

              <p className="text-[var(--color-text)] font-sans leading-relaxed mb-8">
                {story.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 py-6 border-y border-[var(--color-border)]">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-[var(--color-text)]">
                      {story.rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)]">Calificación</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Eye className="w-4 h-4 text-[var(--color-brown)]" />
                    <span className="font-semibold text-[var(--color-text)]">
                      {story.viewCount || 0}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)]">Vistas</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="font-semibold text-[var(--color-text)]">
                      {story.favoriteCount || 0}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)]">Favoritos</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Book className="w-4 h-4 text-[var(--color-brown)]" />
                    <span className="font-semibold text-[var(--color-text)]">
                      {chapters.length}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)]">Capítulos</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                {chapters.length > 0 && (
                  <Link to={`/story/${storyId}/chapter/${chapters[0].id}`}>
                    <EditorialButton>
                      <Book className="w-4 h-4 mr-2" />
                      Leer ahora
                    </EditorialButton>
                  </Link>
                )}
                
                <button
                  onClick={handleToggleFavorite}
                  className={`px-4 py-2 rounded-full font-sans font-semibold flex items-center gap-2 transition-all ${
                    isFavorite
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'border border-[var(--color-border)] text-[var(--color-muted)] hover:text-red-500 hover:border-red-300'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Favorito' : 'Favoritar'}
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Enlace copiado al portapapeles');
                  }}
                  className="px-4 py-2 rounded-full font-sans font-semibold border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-brown)] hover:text-[var(--color-brown)] transition-all flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Compartir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8 mb-12">
          <h3 className="font-serif text-2xl font-bold text-[var(--color-text)] mb-4">
            Tu calificación
          </h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRateStory(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-all cursor-pointer ${
                    star <= (hoverRating || userRating)
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-[var(--color-muted)]'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Chapters */}
        {chapters.length > 0 && (
          <div className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-[var(--color-text)] mb-6">
              Capítulos ({chapters.length})
            </h2>
            <div className="space-y-3">
              {chapters.map((chapter, index) => (
                <Link
                  key={chapter.id}
                  to={`/story/${storyId}/chapter/${chapter.id}`}
                  className="block p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-[var(--shadow-soft)] hover:border-[var(--color-brown)] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-sans text-sm text-[var(--color-muted)]">
                        Capítulo {index + 1}
                      </p>
                      <h3 className="font-serif font-bold text-[var(--color-text)]">
                        {chapter.title}
                      </h3>
                    </div>
                    <div className="text-xs text-[var(--color-muted)] font-sans">
                      {chapter.readTime || 0} min
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        {comments.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl font-bold text-[var(--color-text)] mb-6">
              Comentarios ({comments.length})
            </h2>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-light-accent)] flex items-center justify-center font-semibold text-[var(--color-brown)] flex-shrink-0">
                      {comment.author?.displayName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--color-text)]">
                        {comment.author?.displayName}
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-[var(--color-text)] font-sans">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
