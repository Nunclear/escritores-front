import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/AppShell';
import { EditorialButton } from '../../components/EditorialButton';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { storiesService, metricsService } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Plus, Edit2, Trash2, Eye, Heart } from 'lucide-react';

export function WriterDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load published stories
      const storiesResponse = await storiesService.getUserStories(user.id);
      setStories(storiesResponse.content || []);

      // Load drafts
      const draftsResponse = await storiesService.getDrafts();
      setDrafts(draftsResponse.content || []);

      // Load user stats
      const userStats = await metricsService.getUserMetrics(user.id);
      setStats(userStats);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta historia?')) {
      try {
        await storiesService.deleteStory(storyId);
        setStories(stories.filter((s) => s.id !== storyId));
      } catch (err) {
        console.error('Error deleting story:', err);
      }
    }
  };

  const StoryItem = ({ story, isDraft }) => (
    <Card hoverable className="mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-serif font-bold text-lg text-text-primary">
            {story.title}
          </h4>
          <p className="text-text-secondary text-sm font-sans line-clamp-2 my-2">
            {story.description}
          </p>
          <div className="flex gap-2 flex-wrap items-center">
            <Badge variant="secondary" size="sm">
              {story.chapterCount || 0} capítulos
            </Badge>
            {!isDraft && (
              <>
                <span className="text-text-secondary text-sm flex items-center gap-1">
                  <Eye size={16} /> {story.viewCount || 0}
                </span>
                <span className="text-text-secondary text-sm flex items-center gap-1">
                  <Heart size={16} /> {story.favoriteCount || 0}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <EditorialButton
            variant="secondary"
            size="sm"
            icon={Edit2}
            onClick={() => navigate(`/editor/${story.id}`)}
          >
            Editar
          </EditorialButton>
          {!isDraft && (
            <EditorialButton
              variant="secondary"
              size="sm"
              icon={BookOpen}
              onClick={() => navigate(`/story/${story.id}`)}
            >
              Ver
            </EditorialButton>
          )}
          <EditorialButton
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => handleDeleteStory(story.id)}
          />
        </div>
      </div>
    </Card>
  );

  const publishedTab = {
    label: 'Publicadas',
    content: loading ? (
      <LoadingState />
    ) : stories.length === 0 ? (
      <EmptyState
        title="Sin historias publicadas"
        message="Comienza creando tu primera historia"
      />
    ) : (
      <div>
        {stories.map((story) => (
          <StoryItem key={story.id} story={story} isDraft={false} />
        ))}
      </div>
    ),
  };

  const draftsTab = {
    label: 'Borradores',
    content: loading ? (
      <LoadingState />
    ) : drafts.length === 0 ? (
      <EmptyState
        title="Sin borradores"
        message="Los cambios no publicados aparecerán aquí"
      />
    ) : (
      <div>
        {drafts.map((draft) => (
          <StoryItem key={draft.id} story={draft} isDraft={true} />
        ))}
      </div>
    ),
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold text-text-primary">
              Mesa de trabajo
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              Gestiona tus historias y contenido
            </p>
          </div>
          <EditorialButton
            variant="primary"
            size="lg"
            icon={Plus}
            onClick={() => navigate('/editor/new')}
          >
            Nueva historia
          </EditorialButton>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card>
              <div>
                <p className="text-text-secondary text-sm font-sans">Historias</p>
                <p className="text-3xl font-serif font-bold text-text-primary">
                  {stats.totalStories || 0}
                </p>
              </div>
            </Card>
            <Card>
              <div>
                <p className="text-text-secondary text-sm font-sans">Vistas totales</p>
                <p className="text-3xl font-serif font-bold text-text-primary">
                  {stats.totalViews || 0}
                </p>
              </div>
            </Card>
            <Card>
              <div>
                <p className="text-text-secondary text-sm font-sans">Favoritos</p>
                <p className="text-3xl font-serif font-bold text-text-primary">
                  {stats.totalFavorites || 0}
                </p>
              </div>
            </Card>
            <Card>
              <div>
                <p className="text-text-secondary text-sm font-sans">Seguidores</p>
                <p className="text-3xl font-serif font-bold text-text-primary">
                  {stats.followers || 0}
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Stories */}
        <Tabs
          tabs={[publishedTab, draftsTab]}
          defaultTab={activeTab}
          onChange={setActiveTab}
        />
      </div>
    </AppShell>
  );
}

export default WriterDashboardPage;
