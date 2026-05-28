import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PublicNavbar from '../../components/layout/PublicNavbar';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import EditorialButton from '../../components/ui/EditorialButton';
import { chaptersService } from '../../services/chaptersService';
import { storiesService } from '../../services/storiesService';
import { commentsService } from '../../services/commentsService';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, ChevronRight, BookOpen, Clock, MessageCircle } from 'lucide-react';

export default function ChapterReaderPage() {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [story, setStory] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fontSize, setFontSize] = useState('base');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [storyData, chapterData, chaptersData, commentsData] = await Promise.all([
          storiesService.getStory(storyId),
          chaptersService.getChapter(chapterId),
          chaptersService.getPublishedChapters(storyId, { size: 100 }),
          commentsService.getChapterComments(chapterId, { size: 20 }),
        ]);

        setStory(storyData);
        setChapter(chapterData);
        setAllChapters(chaptersData.content || []);
        setComments(commentsData.content || []);
      } catch (err) {
        console.error('Error loading chapter:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [storyId, chapterId]);

  const currentChapterIndex = allChapters.findIndex((ch) => ch.id === parseInt(chapterId));
  const previousChapter = currentChapterIndex > 0 ? allChapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < allChapters.length - 1 ? allChapters[currentChapterIndex + 1] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <PublicNavbar />
        <div className="max-w-2xl mx-auto px-6 py-12">
          <LoadingState />
        </div>
      </div>
    );
  }

  if (error || !chapter || !story) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <PublicNavbar />
        <div className="max-w-2xl mx-auto px-6 py-12">
          <ErrorState message={error?.message || 'Capítulo no encontrado'} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  const fontSizeMap = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <PublicNavbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Reading Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[var(--color-border)]">
          <Link
            to={`/story/${storyId}`}
            className="flex items-center gap-2 text-[var(--color-brown)] hover:text-[var(--color-text)] transition-colors font-sans font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            {story.title}
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="font-size" className="text-xs font-sans font-semibold text-[var(--color-muted)] uppercase">
                Tamaño:
              </label>
              <select
                id="font-size"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
              >
                <option value="sm">Pequeño</option>
                <option value="base">Normal</option>
                <option value="lg">Grande</option>
                <option value="xl">Muy grande</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chapter Header */}
        <div className="text-center mb-12">
          <p className="text-[var(--color-muted)] font-sans text-sm mb-2">
            Capítulo {currentChapterIndex + 1} de {allChapters.length}
          </p>
          <h1 className="font-serif text-4xl font-bold text-[var(--color-text)] mb-4">
            {chapter.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-[var(--color-muted)] font-sans">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {chapter.readTime || 0} min de lectura
            </div>
            <div>
              Publicado: {new Date(chapter.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Chapter Content */}
        <article
          className={`prose prose-sm max-w-none mb-12 ${fontSizeMap[fontSize]}`}
          style={{
            color: 'var(--color-text)',
          }}
        >
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-12 leading-relaxed">
            {chapter.content ? (
              <div
                className="whitespace-pre-wrap font-sans text-[var(--color-text)]"
                dangerouslySetInnerHTML={{
                  __html: chapter.content
                    .split('\n')
                    .map((para) => `<p className="mb-4">${para}</p>`)
                    .join(''),
                }}
              />
            ) : (
              <p className="text-[var(--color-muted)] text-center py-12">
                El contenido del capítulo no está disponible
              </p>
            )}
          </div>
        </article>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 mb-12 pb-12 border-b border-[var(--color-border)]">
          {previousChapter ? (
            <Link to={`/story/${storyId}/chapter/${previousChapter.id}`}>
              <EditorialButton variant="secondary">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Capítulo anterior
              </EditorialButton>
            </Link>
          ) : (
            <div />
          )}

          {nextChapter ? (
            <Link to={`/story/${storyId}/chapter/${nextChapter.id}`}>
              <EditorialButton>
                Próximo capítulo
                <ChevronRight className="w-4 h-4 ml-2" />
              </EditorialButton>
            </Link>
          ) : (
            <div className="text-center flex-1">
              <p className="text-[var(--color-muted)] font-sans">
                Fin de la historia
              </p>
            </div>
          )}
        </div>

        {/* Comments Section */}
        {comments.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Comentarios ({comments.length})
            </h2>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-[var(--shadow-soft)] transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-light-accent)] flex items-center justify-center font-semibold text-[var(--color-brown)] flex-shrink-0 text-sm">
                      {comment.author?.displayName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[var(--color-text)] font-sans">
                          {comment.author?.displayName}
                        </p>
                        {comment.author?.id === story.author?.id && (
                          <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-light-accent)] text-[var(--color-brown)] font-semibold">
                            Autor
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-muted)] font-sans">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-[var(--color-text)] font-sans leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Comment Section */}
        {user ? (
          <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
            <h3 className="font-serif text-xl font-bold text-[var(--color-text)] mb-4">
              Dejar un comentario
            </h3>
            <div className="p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
              <textarea
                placeholder="Comparte tu opinión sobre este capítulo..."
                className="w-full p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)] focus-visible:ring-offset-2"
                rows="4"
              />
              <div className="mt-4 flex justify-end">
                <EditorialButton>Publicar comentario</EditorialButton>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 pt-8 border-t border-[var(--color-border)] text-center">
            <p className="text-[var(--color-muted)] font-sans mb-4">
              Inicia sesión para dejar un comentario
            </p>
            <Link to="/login">
              <EditorialButton variant="secondary">Iniciar sesión</EditorialButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
