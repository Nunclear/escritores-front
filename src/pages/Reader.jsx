import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';
import ReportButton from '../components/ReportButton';
import CommentsThread from '../components/CommentsThread';
import RatingBox from '../components/RatingBox';
import FavoriteButton from '../components/FavoriteButton';

function splitContent(content) {
  if (!content) return [];
  return String(content).split(/\n{2,}/).map((line) => line.trim()).filter(Boolean);
}

export default function Reader() {
  const { storyId, chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    api.metrics.registerChapterView(storyId, chapterId).catch(() => null);

    Promise.allSettled([
      api.chapters.get(chapterId),
      api.stories.get(storyId),
      api.chapters.published(storyId),
    ]).then(([chapterRes, storyRes, chaptersRes]) => {
      if (!mounted) return;
      if (chapterRes.status === 'fulfilled') setChapter(chapterRes.value);
      else { setError(chapterRes.reason); setChapter(null); }
      setStory(storyRes.status === 'fulfilled' ? storyRes.value : null);
      setChapters(chaptersRes.status === 'fulfilled' ? pageContent(chaptersRes.value) : []);
    }).finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [storyId, chapterId]);

  const orderedChapters = useMemo(() => [...chapters].sort((a, b) => (a.positionIndex ?? 0) - (b.positionIndex ?? 0)), [chapters]);
  const currentIndex = orderedChapters.findIndex((item) => String(item.id) === String(chapterId));
  const previousChapter = currentIndex > 0 ? orderedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex >= 0 && currentIndex < orderedChapters.length - 1 ? orderedChapters[currentIndex + 1] : null;
  const paragraphs = splitContent(chapter?.content);

  if (loading) return <section className="page"><LoadingBlock label="Abriendo capítulo..." /></section>;
  if (!chapter) return <section className="page reader-page chapter-reading-page"><Link className="text-link back-link" to={`/historia/${storyId}`}><ArrowLeft size={16} /> Volver a la portada</Link><ErrorBlock error={error} /></section>;

  return (
    <section className="page reader-page chapter-reading-page">
      {error && <ErrorBlock error={error} />}
      <div className="reader-toolbar"><Link className="text-link back-link" to={`/historia/${storyId}`}><ArrowLeft size={16} /> Volver a la portada</Link><div className="reader-toolbar-actions"><FavoriteButton storyId={storyId} compact /><ReportButton type="chapter" targetId={chapterId} compact /></div></div>

      <article className="reading-pane editorial-card">
        <span className="eyebrow"><BookOpen size={15} /> {story?.title || 'Historia'} · capítulo {chapter?.positionIndex || ''}</span>
        <h1>{chapter?.title || 'Capítulo'}</h1>
        {chapter?.subtitle && <h2>{chapter.subtitle}</h2>}
        <div className="chapter-body">
          {paragraphs.length ? paragraphs.map((paragraph, index) => <p className={index === 0 ? 'dropcap' : ''} key={`${chapter?.id || 'chapter'}-${index}`}>{paragraph}</p>) : <EmptyBlock title="Capítulo sin contenido" text="El cuerpo del capítulo está vacío o aún no fue devuelto por la API." />}
        </div>
        <nav className="chapter-nav" aria-label="Navegación entre capítulos">
          {previousChapter ? <Link className="btn soft" to={`/leer/${storyId}/capitulo/${previousChapter.id}`}><ChevronLeft size={17} /> Anterior: {previousChapter.title}</Link> : <span className="btn ghost disabled"><ChevronLeft size={17} /> Primer capítulo</span>}
          {nextChapter ? <Link className="btn primary" to={`/leer/${storyId}/capitulo/${nextChapter.id}`}>Siguiente: {nextChapter.title} <ChevronRight size={17} /></Link> : <span className="btn ghost disabled">Último capítulo <ArrowRight size={17} /></span>}
        </nav>
      </article>

      <div className="chapter-actions-bottom"><ReportButton type="chapter" targetId={chapterId} /><RatingBox storyId={storyId} /></div>
      <CommentsThread storyId={storyId} chapterId={chapterId} />
    </section>
  );
}
