import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartOff, Star, UserMinus } from 'lucide-react';
import { api, pageContent } from '../api/client';
import WriterNav from '../components/WriterNav';
import StoryCard from '../components/StoryCard';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';
import { getInitials } from '../utils/story';

export default function ReaderActivity() {
  const [tab, setTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [following, setFollowing] = useState([]);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true); setError(null);
    const [favRes, folRes, comRes, ratRes] = await Promise.allSettled([
      api.favorites.mine({ page: 0, size: 60 }), api.follows.following({ page: 0, size: 60 }), api.dashboard.recentComments({ page: 0, size: 30 }), api.dashboard.ratings({ page: 0, size: 30 }),
    ]);
    if (favRes.status === 'fulfilled') setFavorites(pageContent(favRes.value)); else setError(favRes.reason);
    setFollowing(folRes.status === 'fulfilled' ? pageContent(folRes.value) : []);
    setComments(comRes.status === 'fulfilled' ? pageContent(comRes.value) : []);
    setRatings(ratRes.status === 'fulfilled' ? pageContent(ratRes.value) : []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function removeFavorite(id) { await api.favorites.remove(id); setFavorites((list) => list.filter((item) => String(item.storyId || item.id) !== String(id))); }
  async function unfollow(id) { await api.follows.unfollow(id); setFollowing((list) => list.filter((item) => String(item.userId || item.id) !== String(id))); }

  return <section className="page writer-panel compact-page"><WriterNav /><div className="writer-main"><div className="section-heading wide compact"><span className="eyebrow">Actividad del lector</span><h1>Tu interacción con otras historias.</h1><p>Favoritos, autores seguidos, comentarios recientes y calificaciones emitidas.</p></div>{loading && <LoadingBlock />}{error && <ErrorBlock error={error} />}<div className="tabs-row"><button className={`tab-btn ${tab === 'favorites' ? 'active' : ''}`} onClick={() => setTab('favorites')}>Favoritos</button><button className={`tab-btn ${tab === 'following' ? 'active' : ''}`} onClick={() => setTab('following')}>Siguiendo</button><button className={`tab-btn ${tab === 'comments' ? 'active' : ''}`} onClick={() => setTab('comments')}>Comentarios recientes</button><button className={`tab-btn ${tab === 'ratings' ? 'active' : ''}`} onClick={() => setTab('ratings')}>Calificaciones emitidas</button></div>{tab === 'favorites' && <div className="cards-grid compact-grid">{favorites.map((item) => <div className="stack-card" key={item.storyId || item.id}><StoryCard story={{ ...item, id: item.storyId || item.id }} /><button className="btn ghost full" onClick={() => removeFavorite(item.storyId || item.id)}><HeartOff size={15} /> Quitar favorito</button></div>)}{!favorites.length && !loading && <EmptyBlock title="No tienes favoritos" text="Guarda historias para verlas aquí." />}</div>}{tab === 'following' && <div className="author-grid compact-authors">{following.map((author) => { const id = author.userId || author.id; return <article className="author-tile editorial-card" key={id}>{author.avatarUrl ? <img src={author.avatarUrl} alt="" /> : <span className="avatar-fallback">{getInitials(author.displayName || author.loginName)}</span>}<Link to={`/autor/${id}`}><strong>{author.displayName || author.loginName || 'Autor'}</strong><small>{author.bioText || 'Autor seguido'}</small></Link><button className="icon-button" onClick={() => unfollow(id)} title="Dejar de seguir"><UserMinus size={15} /></button></article>; })}{!following.length && !loading && <EmptyBlock title="Aún no sigues autores" text="Explora perfiles y empieza a seguir escritores." />}</div>}{tab === 'comments' && <div className="editorial-card compact-panel"><h2>Comentarios recientes</h2>{comments.length ? comments.map((comment) => <p key={comment.id}>“{comment.content}” <small>{comment.createdAt || ''}</small></p>) : !loading && <EmptyBlock title="Sin comentarios" text="Tu historial aparecerá aquí." />}</div>}{tab === 'ratings' && <div className="editorial-card compact-panel"><h2>Calificaciones emitidas</h2>{ratings.length ? ratings.map((rating) => <div className="compact-story-row" key={rating.id}><strong><Star size={13} /></strong><span>Historia #{rating.storyId}</span><small>{rating.scoreValue} estrellas</small></div>) : !loading && <EmptyBlock title="Sin calificaciones" text="Cuando califiques historias aparecerán aquí." />}</div>}</div></section>;
}
