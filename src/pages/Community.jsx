import { useEffect, useState } from 'react';
import { Megaphone, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api, pageContent } from '../api/client';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';
import { normalizeStory } from '../utils/story';

export default function Community() {
  const [notices, setNotices] = useState([]);
  const [topStories, setTopStories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([
      api.notices.active(),
      api.metrics.topViewed({ page: 0, size: 10 }),
      api.users.publicSearch?.({ q: '', page: 0, size: 6 }) || api.users.search({ q: '', page: 0, size: 6 }),
    ]).then(([noticeRes, topRes, authorsRes]) => {
      if (!mounted) return;
      if (noticeRes.status === 'fulfilled') setNotices(pageContent(noticeRes.value)); else setError(noticeRes.reason);
      setTopStories(topRes.status === 'fulfilled' ? pageContent(topRes.value).map(normalizeStory) : []);
      setAuthors(authorsRes.status === 'fulfilled' ? pageContent(authorsRes.value) : []);
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <section className="page community-page compact-page">
      <div className="section-heading wide compact"><span className="eyebrow">Comunidad</span><h1>Avisos, rankings y autores activos.</h1><p>Un espacio informativo con comunicados del equipo y actividad pública de la plataforma.</p></div>
      {loading && <LoadingBlock label="Cargando comunidad..." />}
      {error && <ErrorBlock error={error} />}
      <div className="community-grid">
        <section className="editorial-card compact-panel"><div className="compact-panel-head"><Megaphone /><h2>Comunicados activos</h2></div>{!loading && notices.length === 0 ? <EmptyBlock title="Sin comunicados" text="No hay avisos activos en este momento." /> : <div className="notice-list compact-list">{notices.map((notice) => <article className="notice-card mini" key={notice.id}><strong>{notice.title}</strong><p>{notice.messageText}</p></article>)}</div>}</section>
        <section className="editorial-card compact-panel"><div className="compact-panel-head"><Trophy /><h2>Más vistas</h2></div><div className="compact-list">{topStories.map((story, index) => <Link className="compact-story-row" to={`/historia/${story.id}`} key={story.id || index}><strong>{index + 1}</strong><span>{story.title}</span><small>{story.views ?? story.totalViews ?? '—'} vistas</small></Link>)}</div></section>
        <section className="editorial-card compact-panel"><div className="compact-panel-head"><Users /><h2>Autores destacados</h2></div><div className="compact-list">{authors.map((author) => <Link className="compact-story-row" to={`/autor/${author.id || author.userId}`} key={author.id || author.userId}><strong>{String(author.displayName || author.loginName || 'A').slice(0, 1)}</strong><span>{author.displayName || author.loginName}</span><small>{author.followersCount ?? '—'} seguidores</small></Link>)}</div></section>
      </div>
    </section>
  );
}
