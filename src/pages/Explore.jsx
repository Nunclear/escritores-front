import { useEffect, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { api, pageContent } from '../api/client';
import StoryCard from '../components/StoryCard';
import { normalizeStory } from '../utils/story';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';

const sortOptions = [
  { label: 'Fecha reciente', value: 'createdAt,desc' },
  { label: 'Fecha antigua', value: 'createdAt,asc' },
  { label: 'Vistas', value: 'views,desc' },
];

export default function Explore() {
  const [query, setQuery] = useState('');
  const [visibilityState, setVisibilityState] = useState('public');
  const [publicationState, setPublicationState] = useState('published');
  const [sort, setSort] = useState('createdAt,desc');
  const [page, setPage] = useState(0);
  const [stories, setStories] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 0 });
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
    api.stories.search(params)
      .then((payload) => { if (mounted) { setStories(pageContent(payload).map(normalizeStory)); setMeta({ totalPages: payload?.totalPages || 0 }); } })
      .catch((err) => { if (mounted) { setError(err); setStories([]); } })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [query, visibilityState, publicationState, sort, page]);

  return (
    <section className="page compact-page">
      <div className="section-heading wide compact"><span className="eyebrow">Explorar historias</span><h1>Descubre nuevas lecturas.</h1><p>Busca por título o descripción y ordena por fecha o vistas.</p></div>
      <div className="filters editorial-card compact-filters">
        <label className="search-field"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Título o descripción" /></label>
        <label><Filter size={15} /> Visibilidad<select value={visibilityState} onChange={(e) => setVisibilityState(e.target.value)}><option value="public">Públicas</option><option value="">Todas visibles</option></select></label>
        <label>Estado<select value={publicationState} onChange={(e) => setPublicationState(e.target.value)}><option value="published">Publicadas</option><option value="draft">Borradores públicos</option><option value="">Todas</option></select></label>
        <label>Orden<select value={sort} onChange={(e) => setSort(e.target.value)}>{sortOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      </div>
      {error && <ErrorBlock error={error} />}
      {loading ? <LoadingBlock /> : stories.length ? <div className="cards-grid compact-grid">{stories.map((story) => <StoryCard key={story.id} story={story} />)}</div> : <EmptyBlock title="Sin resultados" text="No encontramos historias con esos filtros." />}
      <div className="pagination-row"><button className="btn ghost" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Anterior</button><span>Página {page + 1}{meta.totalPages ? ` de ${meta.totalPages}` : ''}</span><button className="btn ghost" disabled={meta.totalPages ? page + 1 >= meta.totalPages : stories.length < 12} onClick={() => setPage((p) => p + 1)}>Siguiente</button></div>
    </section>
  );
}
