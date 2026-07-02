import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, BookOpen, FileText, PenLine } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';

const tabs = [
  { key: 'published', label: 'Publicadas', icon: BookOpen },
  { key: 'draft', label: 'Borradores', icon: FileText },
  { key: 'archived', label: 'Archivadas', icon: Archive },
];

function statusOf(story) {
  if (story.archivedAt || story.publicationState === 'archived') return 'archived';
  return story.publicationState || 'draft';
}

export default function MyStories() {
  const { user } = useAuth();
  const [active, setActive] = useState('published');
  const [stories, setStories] = useState([]);
  const [archived, setArchived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!user?.id) return;
    setLoading(true);
    Promise.allSettled([
      api.stories.byUser(user.id, { includeDrafts: true, page: 0, size: 60 }),
      api.stories.mineArchived({ page: 0, size: 60 }),
    ]).then(([allRes, archivedRes]) => {
      if (!mounted) return;
      if (allRes.status === 'fulfilled') setStories(pageContent(allRes.value)); else setError(allRes.reason);
      setArchived(archivedRes.status === 'fulfilled' ? pageContent(archivedRes.value) : []);
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [user?.id]);

  const visible = useMemo(() => {
    const list = active === 'archived' ? archived : stories;
    return list.filter((story) => active === 'archived' ? true : statusOf(story) === active);
  }, [active, stories, archived]);

  return (
    <section className="page my-stories-page compact-page">
      <div className="section-heading wide compact"><span className="eyebrow">Mis historias</span><h1>Panel del escritor.</h1><p>Administra publicadas, borradores y archivadas. Entra al editor para gestionar capítulos, mundos y multimedia.</p><Link className="btn primary" to="/escribir"><PenLine size={16} /> Crear nueva</Link></div>
      <div className="tabs-row">{tabs.map(({ key, label, icon: Icon }) => <button key={key} className={`tab-btn ${active === key ? 'active' : ''}`} onClick={() => setActive(key)}><Icon size={15} /> {label}</button>)}</div>
      {loading && <LoadingBlock label="Cargando tus historias..." />}
      {error && <ErrorBlock error={error} />}
      {!loading && !visible.length && !error && <EmptyBlock title="No hay historias en esta pestaña" text="Crea o publica contenido para verlo aquí." />}
      <div className="story-table editorial-card">
        {visible.map((story) => <Link className="story-table-row" to={`/editor/${story.id || story.storyId}`} key={story.id || story.storyId}><strong>{story.title}</strong><span>{statusOf(story)}</span><span>{story.chaptersCount ?? story.chapterCount ?? '—'} capítulos</span></Link>)}
      </div>
    </section>
  );
}
