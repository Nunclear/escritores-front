import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../../components/PublicNavbar';
import { EditorialButton } from '../../components/EditorialButton';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { storiesService, chaptersService, ratingsService, favoritesService, usersService } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Heart, Share2, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export function StoryReaderPage() {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    loadStoryData();
  }, [storyId, chapterId]);

  const loadStoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load story
      const storyData = await storiesService.getStoryById(storyId);
      setStory(storyData);

      // Load author
      if (storyData.authorId) {
        const authorData = await usersService.getUserById(storyData.authorId);
        setAuthor(authorData);
      }

      // Load chapters
      const chaptersData = await chaptersService.listChapters(storyId);
      setChapters(chaptersData.content || []);

      // Load current chapter or first chapter
      const currentChapterId = chapterId || chaptersData.content?.[0]?.id;
      if (currentChapterId) {
        const chapterData = await chaptersService.getChapter(storyId, currentChapterId);
        setCurrentChapter(chapterData);
      }

      // Load user interactions if authenticated
      if (isAuthenticated) {
        const isFav = await favoritesService.isFavorite(storyId);
        setIsFavorite(isFav.isFavorite);

        const rating = await ratingsService.getUserRating(storyId);
        setUserRating(rating.rating || 0);
      }
    } catch (err) {
      console.error('Error loading story:', err);
      setError(err.message || 'Error cargando la historia');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await favoritesService.removeFromFavorites(storyId);
      } else {
        await favoritesService.addToFavorites(storyId);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleRate = async (rating) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (userRating === rating) {
        await ratingsService.deleteRating(storyId);
        setUserRating(0);
      } else {
        await ratingsService.rateStory(storyId, { rating });
        setUserRating(rating);
      }
    } catch (err) {
      console.error('Error rating story:', err);
    }
  };

  const goToChapter = (chapterId) => {
    navigate(`/story/${storyId}/chapter/${chapterId}`);
  };

  const currentChapterIndex = chapters.findIndex((c) => c.id === currentChapter?.id);
  const previousChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!story) return <ErrorState message="Historia no encontrada" />;

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Story Header */}
        <div className="mb-8">
          <div className="flex gap-6 mb-6">
            {story.coverImageUrl && (
              <img
                src={story.coverImageUrl}
                alt={story.title}
                className="w-32 h-48 object-cover rounded-editorial shadow-warm-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="font-serif text-4xl font-bold text-text-primary mb-2">
                {story.title}
              </h1>
              {author && (
                <div className="flex items-center gap-3 mb-4">
                  <Avatar src={author.avatarUrl} name={author.displayName} size="md" />
                  <div>
                    <p className="font-sans font-medium text-text-primary">
                      {author.displayName}
                    </p>
                    <p className="text-text-secondary text-sm">Autor</p>
                  </div>
                </div>
              )}
              <p className="text-text-secondary font-sans mb-4">
                {story.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {story.genres && story.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">{genre}</Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <EditorialButton
                  variant={isFavorite ? 'primary' : 'secondary'}
                  icon={Heart}
                  onClick={handleToggleFavorite}
                >
                  {isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
                </EditorialButton>
                <EditorialButton variant="secondary" icon={Share2}>
                  Compartir
                </EditorialButton>
              </div>
            </div>
          </div>

          {/* Story Stats */}
          <div className="editorial-card p-4 flex gap-6">
            <div>
              <p className="text-text-secondary text-sm font-sans">Capítulos</p>
              <p className="font-serif text-2xl font-bold text-text-primary">
                {chapters.length}
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-sm font-sans">Calificación</p>
              <p className="font-serif text-2xl font-bold text-text-primary">
                {story.rating?.toFixed(1) || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-sm font-sans">Favoritos</p>
              <p className="font-serif text-2xl font-bold text-text-primary">
                {story.favoriteCount || 0}
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-sm font-sans">Vistas</p>
              <p className="font-serif text-2xl font-bold text-text-primary">
                {story.viewCount || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Current Chapter */}
        {currentChapter && (
          <article className="editorial-card p-8 mb-8">
            <div className="mb-6 pb-6 border-b border-sand">
              <h2 className="font-serif text-3xl font-bold text-text-primary mb-2">
                {currentChapter.title}
              </h2>
              <p className="text-text-secondary text-sm">
                Capítulo {currentChapterIndex + 1} de {chapters.length}
              </p>
            </div>

            <div className="prose prose-sm max-w-none mb-8 font-sans text-text-primary leading-relaxed">
              {currentChapter.content && (
                <div dangerouslySetInnerHTML={{ __html: currentChapter.content }} />
              )}
            </div>

            {/* Chapter Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-sand">
              {previousChapter ? (
                <EditorialButton
                  variant="secondary"
                  icon={ChevronLeft}
                  onClick={() => goToChapter(previousChapter.id)}
                >
                  Capítulo anterior
                </EditorialButton>
              ) : (
                <div />
              )}
              {nextChapter ? (
                <EditorialButton
                  variant="primary"
                  icon={ChevronRight}
                  iconPosition="right"
                  onClick={() => goToChapter(nextChapter.id)}
                >
                  Siguiente capítulo
                </EditorialButton>
              ) : (
                <EditorialButton variant="secondary" disabled>
                  Fin de la historia
                </EditorialButton>
              )}
            </div>
          </article>
        )}

        {/* Chapters List */}
        <div className="editorial-card p-6">
          <h3 className="font-serif text-xl font-bold text-text-primary mb-4">
            Capítulos
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {chapters.map((chapter, idx) => (
              <button
                key={chapter.id}
                onClick={() => goToChapter(chapter.id)}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  chapter.id === currentChapter?.id
                    ? 'bg-cream text-coffee'
                    : 'hover:bg-surface-secondary'
                }`}
              >
                <span className="font-medium">Capítulo {idx + 1}:</span> {chapter.title}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default StoryReaderPage;
