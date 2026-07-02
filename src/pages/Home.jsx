import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Filter, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, pageContent } from '../api/client';
import { normalizeStory } from '../utils/story';
import StoryCard from '../components/StoryCard';
import RankingPanel from '../components/RankingPanel';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';

const visibilityOptions = [
  { label: 'Públicas', value: 'public' },
  { label: 'Todas visibles', value: '' },
];
const stateOptions = [
  { label: 'Publicadas', value: 'published' },
  { label: 'Borradores públicos', value: 'draft' },
  { label: 'Todas', value: '' },
];
const sortOptions = [
  { label: 'Más recientes', value: 'createdAt,desc' },
  { label: 'Más antiguas', value: 'createdAt,asc' },
  { label: 'Más vistas', value: 'views,desc' },
  { label: 'Mejor calificadas', value: 'averageScore,desc' },
];

function CompactStoryList({ title, stories, rank = false }) {
  return (
    <section className="compact-panel editorial-card">
      <div className="compact-panel-head"><span className="eyebrow">{rank ? 'Ranking' : 'Novedades'}</span><h2>{title}</h2></div>
      {stories.length ? (
        <div className="compact-list">
          {stories.slice(0, 10).map((story, index) => {
            const item = normalizeStory(story);
            return <Link to={`/historia/${item.id}`} className="compact-story-row" key={`${title}-${item.id || index}`}><strong>{rank ? index + 1 : String(index + 1).padStart(2, '0')}</strong><span>{item.title}</span><small>{item.author?.displayName || item.authorName || 'Autor'}</small></Link>;
          })}
        </div>
      ) : <EmptyBlock title="Sin historias" text="La API aún no devolvió resultados para esta sección." />}
    </section>
  );
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [visibilityState, setVisibilityState] = useState('public');
  const [publicationState, setPublicationState] = useState('published');
  const [sort, setSort] = useState('createdAt,desc');
  const [page, setPage] = useState(0);
  const [stories, setStories] = useState([]);
  const [latest, setLatest] = useState([]);
  const [topViewed, setTopViewed] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { setPage(0); }, [query, visibilityState, publicationState, sort]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    const params = { page, size: 12, sort };
    if (query.trim()) params.q = query.trim();
    if (visibilityState) params.visibilityState = visibilityState;
    if (publicationState) params.publicationState = publicationState;

    Promise.allSettled([
      query.trim() ? api.stories.search(params) : api.stories.list(params),
      api.metrics.topViewed({ page: 0, size: 10 }),
      api.stories.list({ page: 0, size: 10, sort: 'createdAt,desc', visibilityState: 'public', publicationState: 'published' }),
    ]).then(([feedRes, topRes, latestRes]) => {
      if (!mounted) return;
      if (feedRes.status === 'fulfilled') {
        setStories(pageContent(feedRes.value).map(normalizeStory));
        setPagination({ totalPages: feedRes.value?.totalPages || 0, totalElements: feedRes.value?.totalElements || 0 });
      } else {
        setError(feedRes.reason);
        setStories([]);
      }
      setTopViewed(topRes.status === 'fulfilled' ? pageContent(topRes.value).map(normalizeStory) : []);
      setLatest(latestRes.status === 'fulfilled' ? pageContent(latestRes.value).map(normalizeStory) : []);
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [query, visibilityState, publicationState, sort, page]);

  const canPrev = page > 0;
  const canNext = pagination.totalPages ? page + 1 < pagination.totalPages : stories.length === 12;
  const resultTitle = useMemo(() => query.trim() ? `Resultados para “${query.trim()}”` : 'Historias públicas', [query]);

  return (
    <section className="page home-page compact-page">
      <div className="home-hero editorial-card compact-hero">
        <div>
          <span className="eyebrow">Raíz de Palabras</span>
          <h1>Lectura, escritura y mundos narrativos en un solo lugar.</h1>
          <p>Descubre historias, sigue autores y comienza a publicar capítulos con una experiencia editorial limpia y cálida.</p>
          <div className="hero-actions"><Link to="/acceso?modo=registro" className="btn primary">Registrarme</Link><Link to="/explorar" className="btn soft">Explorar historias <ArrowRight size={16} /></Link></div>
        </div>
        <div className="quote-panel"><Sparkles size={22} /><p>“Toda historia empieza como una raíz: invisible, insistente, viva.”</p></div>
      </div>

      <div className="filters editorial-card compact-filters">
        <label className="search-field"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por título o descripción" /></label>
        <label><Filter size={15} /> Visibilidad<select value={visibilityState} onChange={(e) => setVisibilityState(e.target.value)}>{visibilityOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label>Estado<select value={publicationState} onChange={(e) => setPublicationState(e.target.value)}>{stateOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label>Orden<select value={sort} onChange={(e) => setSort(e.target.value)}>{sortOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      </div>

      {error && <ErrorBlock error={error} />}
      <div className="home-two-columns">
        <CompactStoryList title="Top 10 más vistas" stories={topViewed} rank />
        <CompactStoryList title="10 últimas publicadas" stories={latest} />
      </div>

      <div className="section-heading compact"><span className="eyebrow">Catálogo paginado</span><h2>{resultTitle}</h2><p>{pagination.totalElements ? `${pagination.totalElements} historias encontradas` : 'Resultados de la API pública'}</p></div>
      {loading ? <LoadingBlock /> : stories.length ? <div className="cards-grid compact-grid">{stories.map((story) => <StoryCard story={story} key={story.id} />)}</div> : <EmptyBlock title="No hay historias públicas" text="Ajusta los filtros o publica contenido desde el backend." />}
      <div className="pagination-row"><button className="btn ghost" disabled={!canPrev} onClick={() => setPage((value) => Math.max(0, value - 1))}>Anterior</button><span>Página {page + 1}{pagination.totalPages ? ` de ${pagination.totalPages}` : ''}</span><button className="btn ghost" disabled={!canNext} onClick={() => setPage((value) => value + 1)}>Siguiente</button></div>
    </section>
  );
}
