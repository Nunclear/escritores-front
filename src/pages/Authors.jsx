import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserRound } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';
import { getInitials, normalizeStory } from '../utils/story';

function shortBio(author) {
  const text = author.bioText || author.bio || author.description || 'Escritor de la comunidad. Explora sus historias públicas y su universo creativo.';
  return text.length > 105 ? `${text.slice(0, 105)}...` : text;
}

async function loadPublicAuthors() {
  const storiesPayload = await api.stories.list({ page: 0, size: 80, sort: 'createdAt,desc', visibilityState: 'public', publicationState: 'published' });
  const stories = pageContent(storiesPayload).map(normalizeStory);
  const authorIds = [...new Set(stories.map((story) => story.author?.id || story.ownerUserId || story.authorUserId).filter(Boolean).map(String))];
  const profiles = await Promise.allSettled(authorIds.map((id) => api.users.publicProfile(id)));
  return authorIds.map((id, index) => {
    const profile = profiles[index].status === 'fulfilled' ? profiles[index].value : null;
    const authorStories = stories.filter((story) => String(story.author?.id || story.ownerUserId || story.authorUserId) === id);
    const storyAuthor = authorStories.find((story) => story.author)?.author || {};
    return {
      id: Number(id),
      userId: Number(id),
      displayName: profile?.displayName || storyAuthor.displayName || `Autor #${id}`,
      loginName: profile?.loginName || storyAuthor.loginName || '',
      bioText: profile?.bioText || storyAuthor.bioText || storyAuthor.bio || '',
      avatarUrl: profile?.avatarUrl || storyAuthor.avatarUrl || '',
      followersCount: profile?.followersCount ?? storyAuthor.followersCount ?? 0,
      storiesCount: profile?.storiesCount ?? authorStories.length,
      sampleStories: authorStories.slice(0, 3),
    };
  }).filter((author) => author.id);
}

export default function Authors() {
  const [query, setQuery] = useState('');
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadAuthors() {
    setLoading(true);
    setError(null);
    try {
      const list = await loadPublicAuthors();
      setAuthors(list);
    } catch (err) {
      setError(err);
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAuthors(); }, []);

  const filteredAuthors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return authors;
    return authors.filter((author) => [
      author.displayName,
      author.loginName,
      author.bioText,
      ...(author.sampleStories || []).map((story) => story.title),
    ].filter(Boolean).join(' ').toLowerCase().includes(q));
  }, [authors, query]);

  return (
    <section className="page authors-page compact-page">
      <div className="section-heading wide compact"><span className="eyebrow">Autores</span><h1>Descubre escritores.</h1><p>El listado se arma desde las historias públicas y sus perfiles públicos, así no depende de una búsqueda privada de usuarios.</p></div>
      <form className="filters editorial-card compact-filters" onSubmit={(event) => event.preventDefault()}>
        <label className="search-field"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar autor por nombre, biografía o historia" /></label>
        <button className="btn primary" type="button" onClick={loadAuthors}>Actualizar</button>
      </form>
      {loading && <LoadingBlock label="Cargando escritores publicados..." />}
      {error && <ErrorBlock error={error} />}
      {!loading && !filteredAuthors.length && !error && <EmptyBlock title="Sin escritores publicados" text="Cuando existan historias públicas, sus autores aparecerán aquí." />}
      <div className="author-grid compact-authors">
        {filteredAuthors.map((author) => (
          <Link className="author-tile editorial-card author-tile-rich" to={`/autor/${author.id || author.userId}`} key={author.id || author.userId}>
            {author.avatarUrl ? <img src={author.avatarUrl} alt="" /> : <span className="avatar-fallback">{getInitials(author.displayName || author.loginName)}</span>}
            <div>
              <strong>{author.displayName || author.loginName}</strong>
              <small>{shortBio(author)}</small>
              <em>{author.followersCount || 0} seguidores · {author.storiesCount || 0} historias</em>
            </div>
            <UserRound size={16} />
          </Link>
        ))}
      </div>
    </section>
  );
}
