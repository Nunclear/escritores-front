import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppShell } from '../../components/AppShell';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import EditorialButton from '../../components/ui/EditorialButton';
import { storiesService } from '../../services/storiesService';
import { chaptersService } from '../../services/chaptersService';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, Plus, BookOpen, Save, Eye, Lock } from 'lucide-react';

export default function StoryEditorPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    visibilityState: 'PRIVATE',
  });
  const [activeTab, setActiveTab] = useState('info'); // info, chapters, structure

  useEffect(() => {
    const loadStory = async () => {
      try {
        setLoading(true);
        setError(null);

        const storyData = await storiesService.getStory(storyId);
        setStory(storyData);
        setFormData({
          title: storyData.title || '',
          description: storyData.description || '',
          genre: storyData.genre || '',
          visibilityState: storyData.visibilityState || 'PRIVATE',
        });

        const chaptersData = await chaptersService.getChapters(storyId, { size: 100 });
        setChapters(chaptersData.content || []);
      } catch (err) {
        console.error('Error loading story:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (storyId) {
      loadStory();
    }
  }, [storyId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveStory = async () => {
    try {
      setSaving(true);
      await storiesService.updateStory(storyId, formData);
      alert('Historia guardada correctamente');
    } catch (err) {
      console.error('Error saving story:', err);
      alert('Error al guardar la historia');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishStory = async () => {
    try {
      setSaving(true);
      await storiesService.publishStory(storyId);
      alert('Historia publicada correctamente');
      window.location.reload();
    } catch (err) {
      console.error('Error publishing story:', err);
      alert('Error al publicar la historia');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <LoadingState />
        </div>
      </AppShell>
    );
  }

  if (error || !story) {
    return (
      <AppShell>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <ErrorState message={error?.message || 'Historia no encontrada'} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-2 text-[var(--color-brown)] hover:text-[var(--color-text)] transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-sans font-semibold">Mis Historias</span>
          </Link>

          <div className="flex gap-3">
            <EditorialButton
              variant="secondary"
              onClick={handleSaveStory}
              isLoading={saving}
              className="flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Guardar
            </EditorialButton>
            {story.publicationState !== 'PUBLISHED' && (
              <EditorialButton
                onClick={handlePublishStory}
                isLoading={saving}
                className="flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Publicar
              </EditorialButton>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-[var(--color-border)] mb-8 pb-4">
          {[
            { value: 'info', label: 'Información' },
            { value: 'chapters', label: 'Capítulos' },
            { value: 'structure', label: 'Estructura' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 font-sans font-semibold text-sm rounded-lg transition-all ${
                activeTab === tab.value
                  ? 'bg-[var(--color-brown)] text-white'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                  Título de la Historia
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nombre de tu obra..."
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
                />
              </div>

              <div>
                <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                  Género
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
                >
                  <option value="">Seleccionar género...</option>
                  <option value="Romance">Romance</option>
                  <option value="Fantasía">Fantasía</option>
                  <option value="Misterio">Misterio</option>
                  <option value="Poesía">Poesía</option>
                  <option value="Drama">Drama</option>
                  <option value="Ciencia Ficción">Ciencia Ficción</option>
                  <option value="Suspense">Suspense</option>
                </select>
              </div>

              <div>
                <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                  Visibilidad
                </label>
                <select
                  name="visibilityState"
                  value={formData.visibilityState}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
                >
                  <option value="PRIVATE">Privada</option>
                  <option value="PUBLIC">Pública</option>
                  <option value="SHARED">Compartida</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Cuéntale a los lectores de qué trata tu historia..."
                rows="8"
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)] resize-none"
              />
            </div>
          </div>
        )}

        {/* Chapters Tab */}
        {activeTab === 'chapters' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-[var(--color-text)]">
                Capítulos ({chapters.length})
              </h2>
              <EditorialButton
                variant="secondary"
                onClick={() => navigate(`/app/historia/${storyId}/capitulo/nuevo`)}
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nuevo Capítulo
              </EditorialButton>
            </div>

            {chapters.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-[var(--color-muted)] mx-auto mb-4" />
                <p className="text-[var(--color-muted)] font-sans mb-6">
                  Aún no tienes capítulos. ¡Comienza a escribir tu historia!
                </p>
                <EditorialButton
                  onClick={() => navigate(`/app/historia/${storyId}/capitulo/nuevo`)}
                >
                  Crear Primer Capítulo
                </EditorialButton>
              </div>
            ) : (
              <div className="space-y-3">
                {chapters.map((chapter, index) => (
                  <Link
                    key={chapter.id}
                    to={`/app/historia/${storyId}/capitulo/${chapter.id}`}
                    className="flex items-center justify-between p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-[var(--shadow-soft)] transition-all group"
                  >
                    <div className="flex-1">
                      <p className="font-sans text-sm text-[var(--color-muted)]">
                        Capítulo {index + 1}
                      </p>
                      <h3 className="font-serif font-bold text-[var(--color-text)]">
                        {chapter.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[var(--color-muted)] font-sans">
                        {chapter.readTime || 0} min
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          chapter.publicationState === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {chapter.publicationState === 'PUBLISHED' ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Structure Tab */}
        {activeTab === 'structure' && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-[var(--color-text)] mb-6">
              Estructura de la Historia
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                to={`/app/historia/${storyId}/personajes`}
                className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-[var(--shadow-soft)] transition-all"
              >
                <div className="text-4xl mb-3">👥</div>
                <h3 className="font-serif font-bold text-lg text-[var(--color-text)] mb-2">
                  Personajes
                </h3>
                <p className="text-sm text-[var(--color-muted)] font-sans">
                  Crea y gestiona los personajes de tu historia
                </p>
              </Link>

              <Link
                to={`/app/historia/${storyId}/objetos`}
                className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-[var(--shadow-soft)] transition-all"
              >
                <div className="text-4xl mb-3">🗝️</div>
                <h3 className="font-serif font-bold text-lg text-[var(--color-text)] mb-2">
                  Objetos
                </h3>
                <p className="text-sm text-[var(--color-muted)] font-sans">
                  Define objetos importantes en tu narrativa
                </p>
              </Link>

              <Link
                to={`/app/historia/${storyId}/arcos`}
                className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-[var(--shadow-soft)] transition-all"
              >
                <div className="text-4xl mb-3">📈</div>
                <h3 className="font-serif font-bold text-lg text-[var(--color-text)] mb-2">
                  Arcos
                </h3>
                <p className="text-sm text-[var(--color-muted)] font-sans">
                  Organiza tu historia en arcos narrativos
                </p>
              </Link>

              <Link
                to={`/app/historia/${storyId}/volumenes`}
                className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-[var(--shadow-soft)] transition-all"
              >
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-serif font-bold text-lg text-[var(--color-text)] mb-2">
                  Volúmenes
                </h3>
                <p className="text-sm text-[var(--color-muted)] font-sans">
                  Agrupa capítulos en volúmenes
                </p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
