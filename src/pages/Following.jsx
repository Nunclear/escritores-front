import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserMinus } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';
import { getInitials } from '../utils/story';

export default function Following() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => { api.follows.following({ page: 0, size: 40 }).then((payload) => setAuthors(pageContent(payload))).catch(setError).finally(() => setLoading(false)); }, []);
  async function unfollow(id) { await api.follows.unfollow(id); setAuthors((list) => list.filter((a) => String(a.userId || a.id) !== String(id))); }
  return <section className="page compact-page"><div className="section-heading wide compact"><span className="eyebrow">Siguiendo</span><h1>Autores que sigues.</h1></div>{loading && <LoadingBlock />}{error && <ErrorBlock error={error} />}{!loading && !authors.length && !error && <EmptyBlock title="Aún no sigues autores" text="Explora perfiles y empieza a seguir escritores." />}<div className="author-grid compact-authors">{authors.map((author) => { const id = author.userId || author.id; return <article className="author-tile editorial-card" key={id}>{author.avatarUrl ? <img src={author.avatarUrl} alt="" /> : <span className="avatar-fallback">{getInitials(author.displayName || author.loginName)}</span>}<Link to={`/autor/${id}`}><strong>{author.displayName || author.loginName}</strong><small>{author.bioText || 'Autor de la plataforma'}</small></Link><button className="btn ghost" onClick={() => unfollow(id)}><UserMinus size={15} /></button></article>; })}</div></section>;
}
