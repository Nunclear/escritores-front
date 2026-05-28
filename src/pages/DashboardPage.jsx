import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell, EditorialButton, LoadingState, ErrorState } from '../components';
import { metricsService } from '../services/metricsService';
import { storiesService } from '../services/storiesService';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentComments, setRecentComments] = useState([]);
  const [recentStories, setRecentStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get dashboard summary
        const summaryRes = await metricsService.getDashboardSummary();
        setSummary(summaryRes);

        // Get recent comments
        const commentsRes = await metricsService.getRecentComments({
          page: 0,
          size: 5,
        });
        setRecentComments(commentsRes.content || []);

        // Get recent stories
        const storiesRes = await storiesService.getMyDrafts({
          page: 0,
          size: 5,
        });
        setRecentStories(storiesRes.content || []);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <AppShell user={user} userRole={user?.accessLevel}>
        <LoadingState message="Cargando tu dashboard..." />
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell user={user} userRole={user?.accessLevel}>
        <ErrorState onRetry={() => window.location.reload()} />
      </AppShell>
    );
  }

  return (
    <AppShell user={user} userRole={user?.accessLevel}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-text-primary mb-2">
          Bienvenido, {user?.displayName}
        </h1>
        <p className="text-text-secondary font-sans">
          Tu mesa de trabajo personal
        </p>
      </div>

      {/* Quick Stats */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {[
            {
              label: 'Historias',
              value: summary.storiesCount || 0,
              icon: '📖',
            },
            {
              label: 'Borradores',
              value: summary.draftsCount || 0,
              icon: '✏️',
            },
            {
              label: 'Favoritos',
              value: summary.favoritesCount || 0,
              icon: '❤️',
            },
            {
              label: 'Seguidos',
              value: summary.followingCount || 0,
              icon: '👥',
            },
          ].map((stat) => (
            <div key={stat.label} className="editorial-card p-6 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-serif font-bold text-coffee">
                {stat.value}
              </p>
              <p className="text-text-secondary font-sans text-sm mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <EditorialButton
          variant="primary"
          className="w-full justify-center py-3"
          onClick={() => navigate('/stories/new')}
        >
          ✨ Nueva Historia
        </EditorialButton>
        <EditorialButton
          variant="secondary"
          className="w-full justify-center py-3"
          onClick={() => navigate('/stories')}
        >
          📖 Mis Historias
        </EditorialButton>
        <EditorialButton
          variant="secondary"
          className="w-full justify-center py-3"
          onClick={() => navigate('/worldbuilding')}
        >
          🌍 Worldbuilding
        </EditorialButton>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Stories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold text-text-primary">
              Borradores Recientes
            </h2>
            <button
              onClick={() => navigate('/stories')}
              className="text-coffee hover:text-sand font-sans text-sm"
            >
              Ver todos →
            </button>
          </div>

          {recentStories.length > 0 ? (
            <div className="space-y-2">
              {recentStories.map((story) => (
                <div
                  key={story.id}
                  className="editorial-card p-4 cursor-pointer hover:shadow-warm-lg transition-shadow"
                  onClick={() => navigate(`/stories/${story.id}/edit`)}
                >
                  <h3 className="font-serif font-bold text-text-primary">
                    {story.title}
                  </h3>
                  <p className="text-text-secondary font-sans text-xs mt-1">
                    Editado: {formatDate(story.updatedAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="editorial-card p-8 text-center">
              <p className="text-text-secondary font-sans text-sm">
                No tienes borradores aún
              </p>
              <EditorialButton
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => navigate('/stories/new')}
              >
                Crear uno ahora
              </EditorialButton>
            </div>
          )}
        </section>

        {/* Recent Comments */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold text-text-primary">
              Comentarios Recientes
            </h2>
            <button
              onClick={() => navigate('/comments')}
              className="text-coffee hover:text-sand font-sans text-sm"
            >
              Ver todos →
            </button>
          </div>

          {recentComments.length > 0 ? (
            <div className="space-y-2">
              {recentComments.map((comment) => (
                <div
                  key={comment.id}
                  className="editorial-card p-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.loginName}`}
                      alt={comment.author?.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-sans font-medium text-sm text-text-primary">
                        {comment.author?.displayName}
                      </p>
                      <p className="text-text-secondary font-sans text-xs mt-1">
                        {comment.content}
                      </p>
                      <p className="text-text-secondary font-sans text-xs mt-2">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="editorial-card p-8 text-center">
              <p className="text-text-secondary font-sans text-sm">
                Aún no hay comentarios
              </p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
