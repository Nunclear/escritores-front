import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserRound, Users } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { ErrorBlock, LoadingBlock, EmptyBlock } from '../components/ApiState';

function toAuthor(story) {
  const authorId = story.ownerUserId || story.authorUserId || story.author?.id;
  return {
    id: authorId,
    displayName: story.author?.displayName || story.authorName || story.displayName || `Autor #${authorId}`,
    avatarUrl: story.author?.avatarUrl || story.avatarUrl,
    bioText: story.author?.bioText || 'Autor con historias públicas en Raíz de Palabras.',
    storiesCount: 1,
  };
}

export default function AuthorsPage() {
  const [query, setQuery] = useState('');
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    api.stories.list({ page: 0, size: 60, sort: 'createdAt,desc' })
      .then((payload) => {
        if (!mounted) return;
        const byId = new Map();
        pageContent(payload).forEach((story) => {
          const author = toAuthor(story);
          if (!author.id) return;
          const current = byId.get(String(author.id));
          byId.set(String(author.id), current ? { ...current, storiesCount: current.storiesCount + 1 } : author);
        });
        setAuthors([...byId.values()]);
      })
      .catch((err) => { if (mounted) { setError(err); setAuthors([]); } })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return authors;
    return authors.filter((author) => `${author.displayName} ${author.bioText}`.toLowerCase().includes(text));
  }, [authors, query]);

  return (
    <section className="page authors-page">
      <div className="section-heading wide">
        <span className="eyebrow">Autores</span>
        <h1>Voces públicas de la biblioteca.</h1>
        <p>Directorio construido desde las historias públicas disponibles en la API.</p>
      </div>
      <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar autor por nombre o biografía..." /></label>
      {error && <ErrorBlock error={error} />}
      {loading ? <LoadingBlock label="Cargando autores..." /> : filtered.length ? (
        <div className="author-grid">
          {filtered.map((author) => (
            <Link className="author-card editorial-card" to={`/autor/${author.id}`} key={author.id}>
              {author.avatarUrl ? <img src={author.avatarUrl} alt={`Avatar de ${author.displayName}`} /> : <span className="author-card-fallback"><UserRound /></span>}
              <div><h3>{author.displayName}</h3><p>{author.bioText}</p><small><Users size={14} /> {author.storiesCount} historias publicadas</small></div>
            </Link>
          ))}
        </div>
      ) : <EmptyBlock title="No hay autores disponibles" text="Cuando existan historias públicas con autor, aparecerán en este directorio." />}
    </section>
  );
}
