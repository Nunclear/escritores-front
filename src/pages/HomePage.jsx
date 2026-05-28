import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { EditorialButton } from '../components/EditorialButton';
import { StoryCard } from '../components/StoryCard';
import { LoadingCard } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { storiesService } from '../services/storiesService';
import { metricsService } from '../services/metricsService';
import { globalNoticesService } from '../services/adminService';
import { truncateText } from '../utils/helpers';

export function HomePage() {
  const navigate = useNavigate();
  const [featuredStories, setFeaturedStories] = useState([]);
  const [topViewedStories, setTopViewedStories] = useState([]);
  const [globalNotice, setGlobalNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load featured stories
        const storiesRes = await storiesService.getStories({
          page: 0,
          size: 6,
          sort: 'createdAt,desc',
        });
        setFeaturedStories(storiesRes.content || []);

        // Load top viewed stories
        const topRes = await metricsService.getTopViewedStories({
          page: 0,
          size: 10,
        });
        setTopViewedStories(topRes.content || []);

        // Load active global notice
        try {
          const noticeRes = await globalNoticesService.getActiveNotice();
          if (noticeRes) {
            setGlobalNotice(noticeRes);
          }
        } catch {
          // Global notice is optional
        }
      } catch (err) {
        console.error('Error loading homepage:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      {/* Global Notice */}
      {globalNotice && (
        <div className="bg-blue-grey/10 border-b border-blue-grey/20 py-4 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-blue-grey font-sans font-medium">{globalNotice.content}</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Escribe tu historia, comparte tu mundo
          </h1>
          <p className="font-sans text-lg text-text-secondary mb-8 leading-relaxed">
            Únete a nuestra comunidad literaria premium. Crea, publica y conecta con lectores que amaran tu obra.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EditorialButton
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
            >
              Comenzar a escribir
            </EditorialButton>
            <EditorialButton
              variant="secondary"
              size="lg"
              onClick={() => navigate('/explore')}
            >
              Explorar historias
            </EditorialButton>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-12 px-6 bg-surface border-t border-cream">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-bold text-text-primary mb-2">
              Historias destacadas
            </h2>
            <p className="text-text-secondary font-sans">
              Las mejores obras de nuestra comunidad literaria
            </p>
          </div>

          {loading ? (
            <LoadingCard count={6} />
          ) : error ? (
            <ErrorState
              title="Error al cargar historias"
              message="No pudimos cargar las historias. Por favor intenta de nuevo."
              onRetry={() => window.location.reload()}
            />
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredStories.slice(0, 6).map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onClick={() => navigate(`/story/${story.slug || story.id}`)}
                  />
                ))}
              </div>

              {featuredStories.length > 6 && (
                <div className="mt-8 text-center">
                  <EditorialButton
                    variant="secondary"
                    onClick={() => navigate('/explore')}
                  >
                    Ver más historias
                  </EditorialButton>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Top Viewed Stories */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="font-serif text-3xl font-bold text-text-primary mb-2">
              Más populares
            </h2>
            <p className="text-text-secondary font-sans">
              Las historias que más disfrutan nuestros lectores
            </p>
          </div>

          {loading ? (
            <LoadingCard count={3} />
          ) : (
            <div className="space-y-4">
              {topViewedStories.slice(0, 5).map((story, index) => (
                <div
                  key={story.id}
                  className="editorial-card p-4 flex items-start gap-4 hover:shadow-warm-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/story/${story.slug || story.id}`)}
                >
                  <div className="text-3xl font-serif font-bold text-sand opacity-50">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-lg text-text-primary mb-1">
                      {story.title}
                    </h3>
                    <p className="text-text-secondary font-sans text-sm mb-2">
                      {truncateText(story.description, 100)}
                    </p>
                    <p className="text-text-secondary font-sans text-xs">
                      Por {story.author?.displayName} • {story.viewCount || 0} vistas
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream py-8 px-6 text-center text-text-secondary font-sans text-sm">
        <p>© 2026 Escritores. Plataforma de Escritura Creativa Premium.</p>
      </footer>
    </div>
  );
}
