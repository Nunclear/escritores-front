import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppShell } from '../../components/AppShell';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import EditorialButton from '../../components/ui/EditorialButton';
import { chaptersService } from '../../services/chaptersService';
import { storiesService } from '../../services/storiesService';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, Save, Eye, AlignLeft, Type } from 'lucide-react';

export default function ChapterEditorPage() {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [story, setStory] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    publicationState: 'DRAFT',
  });
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const storyData = await storiesService.getStory(storyId);
        setStory(storyData);

        if (chapterId && chapterId !== 'nuevo') {
          const chapterData = await chaptersService.getChapter(storyId, chapterId);
          setChapter(chapterData);
          setFormData({
            title: chapterData.title || '',
            content: chapterData.content || '',
            description: chapterData.description || '',
            publicationState: chapterData.publicationState || 'DRAFT',
          });
          setWordCount(chapterData.content?.split(/\s+/).length || 0);
          setCharCount(chapterData.content?.length || 0);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (storyId) {
      loadData();
    }
  }, [storyId, chapterId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'content') {
      const words = value.split(/\s+/).filter((w) => w.length > 0).length;
      setWordCount(words);
      setCharCount(value.length);
    }
  };

  const handleSaveChapter = async () => {
    try {
      setSaving(true);

      if (chapterId && chapterId !== 'nuevo') {
        await chaptersService.updateChapter(storyId, chapterId, formData);
      } else {
        await chaptersService.createChapter(storyId, formData);
      }

      alert('Capítulo guardado correctamente');
      navigate(`/app/historia/${storyId}`);
    } catch (err) {
      console.error('Error saving chapter:', err);
      alert('Error al guardar el capítulo');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishChapter = async () => {
    try {
      setSaving(true);
      const updateData = { ...formData, publicationState: 'PUBLISHED' };

      if (chapterId && chapterId !== 'nuevo') {
        await chaptersService.updateChapter(storyId, chapterId, updateData);
      } else {
        await chaptersService.createChapter(storyId, updateData);
      }

      alert('Capítulo publicado correctamente');
      navigate(`/app/historia/${storyId}`);
    } catch (err) {
      console.error('Error publishing chapter:', err);
      alert('Error al publicar el capítulo');
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
          <ErrorState message={error?.message || 'Información no encontrada'} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to={`/app/historia/${storyId}`}
            className="flex items-center gap-2 text-[var(--color-brown)] hover:text-[var(--color-text)] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-sans font-semibold">{story.title}</span>
          </Link>

          <div className="flex gap-3">
            <EditorialButton
              variant="secondary"
              onClick={handleSaveChapter}
              isLoading={saving}
              className="flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Guardar
            </EditorialButton>
            <EditorialButton
              onClick={handlePublishChapter}
              isLoading={saving}
              className="flex items-center gap-2"
            >
              <Eye className="w-5 h-5" />
              {chapterId && chapterId !== 'nuevo' ? 'Actualizar' : 'Publicar'}
            </EditorialButton>
          </div>
        </div>

        {/* Editor Form */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
              Título del Capítulo
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ej: El Inicio del Viaje"
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
              Descripción (Opcional)
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Una breve descripción de lo que pasará en este capítulo..."
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
            />
          </div>

          {/* Content Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-sans font-semibold text-[var(--color-text)]">
                Contenido
              </label>
              <div className="flex gap-4 text-xs text-[var(--color-muted)] font-sans">
                <span>{wordCount} palabras</span>
                <span>{charCount} caracteres</span>
              </div>
            </div>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Escribe el contenido de tu capítulo aquí..."
              rows="20"
              className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] placeholder-[var(--color-muted)] font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)] resize-none"
            />
          </div>

          {/* Publication State */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-[var(--color-light-accent)]">
            <div className="flex-1">
              <p className="font-sans font-semibold text-[var(--color-text)]">
                Estado de Publicación
              </p>
              <p className="text-sm text-[var(--color-muted)] font-sans">
                {formData.publicationState === 'DRAFT'
                  ? 'Este capítulo está como borrador. Solo tú puedes verlo.'
                  : 'Este capítulo está visible para los lectores.'}
              </p>
            </div>
            <select
              name="publicationState"
              value={formData.publicationState}
              onChange={handleInputChange}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
            >
              <option value="DRAFT">Borrador</option>
              <option value="PUBLISHED">Publicado</option>
            </select>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
