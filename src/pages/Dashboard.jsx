import { useEffect, useState } from 'react';
import { BarChart3, BookOpen, Heart, MessageCircle, Users } from 'lucide-react';
import { api } from '../api/client';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    Promise.allSettled([api.dashboard.me(), api.dashboard.recentComments({ page: 0, size: 5 })])
      .then(([summaryRes, commentsRes]) => { if (!mounted) return; if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value); else setError(summaryRes.reason); setComments(commentsRes.status === 'fulfilled' ? (commentsRes.value?.content || []) : []); })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);
  if (loading) return <section className="page compact-page"><LoadingBlock label="Preparando tu panel..." /></section>;
  const cards = [['Historias', summary?.storiesCount, BookOpen], ['Borradores', summary?.draftStoriesCount, BarChart3], ['Favoritos recibidos', summary?.favoritesCount, Heart], ['Autores seguidos', summary?.followingCount, Users], ['Comentarios recientes', summary?.recentCommentsCount, MessageCircle]];
  return <section className="page dashboard-page compact-page">{error && <ErrorBlock error={error} />}<div className="section-heading wide compact"><span className="eyebrow">Dashboard</span><h1>Resumen general.</h1></div>{!summary && !error ? <EmptyBlock title="Sin resumen disponible" text="La API aún no devolvió métricas para tu usuario." /> : <div className="stats-grid compact-stats">{cards.map(([label, value, Icon]) => <div className="stat-card" key={label}><Icon /><span>{label}</span><strong>{value ?? '—'}</strong></div>)}</div>}<section className="editorial-card compact-panel"><h2>Comentarios recientes</h2>{comments.length ? comments.map((comment) => <p key={comment.id}>“{comment.content}”</p>) : <EmptyBlock title="Sin comentarios recientes" text="Cuando haya actividad, aparecerá aquí." />}</section></section>;
}
