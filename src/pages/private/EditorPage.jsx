import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/AppShell';
import { EditorialButton } from '../../components/EditorialButton';
import { TextInput, TextArea, SelectInput, CheckboxInput } from '../../components/FormInputs';
import { Tabs } from '../../components/ui/Tabs';
import { Alert } from '../../components/ui/Alert';
import { LoadingState } from '../../components/LoadingState';
import { storiesService, chaptersService } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Save, Eye, Trash2, Plus } from 'lucide-react';

export function EditorPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [storyData, setStoryData] = useState({
    title: '',
    description: '',
    genre: '',
    isPublished: false,
  });
  const [chapterData, setChapterData] = useState({
    title: '',
    content: '',
    isPublished: false,
  });

  const genres = [
    { value: 'fantasia', label: 'Fantasía' },
    { value: 'romance', label: 'Romance' },
    { value: 'ciencia-ficcion', label: 'Ciencia Ficción' },
    { value: 'misterio', label: 'Misterio' },
    { value: 'drama', label: 'Drama' },
  ];

  useEffect(() => {
    if (storyId && storyId !== 'new') {
      loadStory();
    } else {
      setLoading(false);
    }
  }, [storyId]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const data = await storiesService.getStoryById(storyId);
      setStory(data);
      setStoryData({
        title: data.title,
        description: data.description,
        genre: data.genre,
        isPublished: data.isPublished,
      });

      const chaptersData = await chaptersService.listChapters(storyId);
      setChapters(chaptersData.content || []);
      if (chaptersData.content?.length > 0) {
        setCurrentChapter(chaptersData.content[0]);
        const chapterDetail = await chaptersService.getChapter(
          storyId,
          chaptersData.content[0].id
        );
        setChapterData({
          title: chapterDetail.title,
          content: chapterDetail.content,
          isPublished: chapterDetail.isPublished,
        });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error cargando la historia' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStory = async () => {
    setSaving(true);
    try {
      if (storyId && storyId !== 'new') {
        await storiesService.updateStory(storyId, storyData);
        setMessage({ type: 'success', text: 'Historia guardada' });
      } else {
        const newStory = await storiesService.createStory(storyData);
        navigate(`/editor/${newStory.id}`);
        setMessage({ type: 'success', text: 'Historia creada' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al guardar' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChapter = async () => {
    if (!story) return;
    setSaving(true);
    try {
      if (currentChapter?.id) {
        await chaptersService.updateChapter(story.id, currentChapter.id, chapterData);
      } else {
        const newChapter = await chaptersService.createChapter(story.id, chapterData);
        setCurrentChapter(newChapter);
        setChapters([...chapters, newChapter]);
      }
      setMessage({ type: 'success', text: 'Capítulo guardado' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al guardar el capítulo' });
    } finally {
      setSaving(false);
    }
  };

  const handleNewChapter = () => {
    setCurrentChapter(null);
    setChapterData({ title: '', content: '', isPublished: false });
  };

  if (loading) return <LoadingState />;

  const storyTab = {
    label: 'Información de la historia',
    content: (
      <div className="space-y-4">
        {message && (
          <Alert
            type={message.type}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        )}
        <TextInput
          label="Título"
          value={storyData.title}
          onChange={(e) =>
            setStoryData({ ...storyData, title: e.target.value })
          }
          required
        />
        <TextArea
          label="Descripción"
          value={storyData.description}
          onChange={(e) =>
            setStoryData({ ...storyData, description: e.target.value })
          }
          rows={4}
        />
        <SelectInput
          label="Género"
          options={genres}
          value={storyData.genre}
          onChange={(e) =>
            setStoryData({ ...storyData, genre: e.target.value })
          }
        />
        <CheckboxInput
          label="Publicar historia"
          checked={storyData.isPublished}
          onChange={(e) =>
            setStoryData({ ...storyData, isPublished: e.target.checked })
          }
        />
        <div className="flex gap-2">
          <EditorialButton
            variant="primary"
            loading={saving}
            onClick={handleSaveStory}
            icon={Save}
          >
            Guardar historia
          </EditorialButton>
          {story && (
            <EditorialButton
              variant="secondary"
              onClick={() => navigate(`/story/${story.id}`)}
              icon={Eye}
            >
              Ver publicada
            </EditorialButton>
          )}
        </div>
      </div>
    ),
  };

  const chapterTab = {
    label: 'Capítulos',
    content: story ? (
      <div className="space-y-4">
        {message && (
          <Alert
            type={message.type}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        )}
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-lg font-bold">
            {currentChapter ? `Capítulo: ${currentChapter.title}` : 'Nuevo capítulo'}
          </h3>
          <EditorialButton
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={handleNewChapter}
          >
            Nuevo capítulo
          </EditorialButton>
        </div>

        <TextInput
          label="Título del capítulo"
          value={chapterData.title}
          onChange={(e) =>
            setChapterData({ ...chapterData, title: e.target.value })
          }
          required
        />
        <TextArea
          label="Contenido"
          value={chapterData.content}
          onChange={(e) =>
            setChapterData({ ...chapterData, content: e.target.value })
          }
          rows={15}
        />
        <CheckboxInput
          label="Publicar capítulo"
          checked={chapterData.isPublished}
          onChange={(e) =>
            setChapterData({ ...chapterData, isPublished: e.target.checked })
          }
        />
        <EditorialButton
          variant="primary"
          loading={saving}
          onClick={handleSaveChapter}
          icon={Save}
        >
          Guardar capítulo
        </EditorialButton>

        {chapters.length > 0 && (
          <div className="mt-8">
            <h4 className="font-serif font-bold mb-3">Capítulos de esta historia</h4>
            <div className="space-y-2">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setCurrentChapter(ch)}
                  className={`w-full text-left px-4 py-2 rounded transition-colors ${
                    currentChapter?.id === ch.id
                      ? 'bg-coffee text-surface'
                      : 'hover:bg-surface-secondary'
                  }`}
                >
                  {ch.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    ) : (
      <Alert
        type="info"
        title="Guarda la historia primero"
        message="Necesitas crear la historia antes de agregar capítulos"
      />
    ),
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-text-primary mb-6">
          {story ? `Editar: ${story.title}` : 'Nueva historia'}
        </h1>

        <Tabs tabs={[storyTab, chapterTab]} />
      </div>
    </AppShell>
  );
}

export default EditorPage;
