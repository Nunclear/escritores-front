import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Eye, Heart, Star, UserRound } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { getInitials, groupChapters, normalizeStory } from '../utils/story';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';
import ChapterGroups from '../components/ChapterGroups';
import ReportButton from '../components/ReportButton';
import FavoriteButton from '../components/FavoriteButton';

function Cover({ story }) {
  if (story?.coverImageUrl) return <img src={story.coverImageUrl} alt={`Portada de ${story.title}`} />;
  return <div className="cover-placeholder large"><BookOpen size={52} /><span>Sin portada</span></div>;
}

function AuthorAvatar({ author, id }) {
  if (author?.avatarUrl) return <img src={author.avatarUrl} alt="" />;
  return <span className="avatar-fallback">{getInitials(author?.displayName || `Autor ${id}`)}</span>;
}

export default function StoryCover() {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [author, setAuthor] = useState(null);
  const [rating, setRating] = useState(null);
  const [favoriteCount, setFavoriteCount] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [arcs, setArcs] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    api.metrics.registerStoryView(storyId).catch(() => null);

    Promise.allSettled([
      api.stories.get(storyId),
      api.chapters.published(storyId),
      api.arcs.byStory(storyId),
      api.volumes.byStory(storyId),
      api.engagement.averageRating(storyId),
      api.engagement.favoriteCount(storyId),
      api.metrics.topViewed({ page: 0, size: 50 }),
    ]).then(([storyRes, chaptersRes, arcsRes, volumesRes, ratingRes, favRes, rankingRes]) => {
      if (!mounted) return;
      if (storyRes.status !== 'fulfilled') {
        setError(storyRes.reason);
        setStory(null);
        setChapters([]);
        setArcs([]);
        setVolumes([]);
        return;
      }
      const normalized = normalizeStory(storyRes.value);
      setStory(normalized);
      setChapters(chaptersRes.status === 'fulfilled' ? pageContent(chaptersRes.value) : []);
      setArcs(arcsRes.status === 'fulfilled' ? pageContent(arcsRes.value) : []);
      setVolumes(volumesRes.status === 'fulfilled' ? pageContent(volumesRes.value) : []);
      setRating(ratingRes.status === 'fulfilled' ? ratingRes.value : null);
      setFavoriteCount(favRes.status === 'fulfilled' ? (favRes.value?.count ?? favRes.value) : null);
      const rankingItem = rankingRes.status === 'fulfilled' ? pageContent(rankingRes.value).find((item) => String(item.storyId || item.id) === String(storyId)) : null;
      setMetrics({ views: rankingItem?.views ?? normalized.views ?? null });

      const authorId = normalized.author?.id || normalized.ownerUserId;
      if (authorId) api.users.publicProfile(authorId).then((profile) => mounted && setAuthor(profile)).catch(() => mounted && setAuthor(normalized.author));
      else setAuthor(normalized.author);
    }).finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [storyId]);

  const groups = useMemo(() => groupChapters(chapters, arcs, volumes), [chapters, arcs, volumes]);
  const firstChapter = chapters.slice().sort((a, b) => (a.positionIndex ?? 0) - (b.positionIndex ?? 0))[0];

  if (loading) return <section className="page"><LoadingBlock label="Preparando portada de historia..." /></section>;
  if (!story) return <section className="page story-cover-page"><ErrorBlock error={error} /></section>;

  return (
    <section className="page story-cover-page">
      {error && <ErrorBlock error={error} />}
      <div className="story-cover-hero editorial-card">
        <div className="big-cover"><Cover story={story} /></div>
        <div className="story-cover-copy">
          <span className="eyebrow">Portada de historia</span>
          <h1>{story.title}</h1>
          <p>{story.description}</p>
          <Link className="author-profile" to={`/autor/${author?.id || story.ownerUserId || story.author?.id || 0}`}><AuthorAvatar author={author || story.author} id={story.ownerUserId || story.id} /><span><small>Autor</small><strong>{author?.displayName || story.author?.displayName || 'Autor'}</strong></span><UserRound size={17} /></Link>
          <div className="story-metrics">
            <div><Star /><span>Calificación</span><strong>{rating?.averageScore ?? '—'}</strong><small>{rating?.ratingsCount ?? 0} reseñas</small></div>
            <div><Eye /><span>Vistas</span><strong>{metrics?.views ?? '—'}</strong><small>Total público</small></div>
            <div><Heart /><span>Favoritos</span><strong>{favoriteCount ?? '—'}</strong><small>Lectores guardaron</small></div>
          </div>
          <div className="hero-actions">
            {firstChapter && <Link className="btn primary large" to={`/leer/${story.id}/capitulo/${firstChapter.id}`}>Empezar desde el primer capítulo <ArrowRight size={18} /></Link>}
            <a className="btn soft large" href="#capitulos">Ver capítulos</a>
            <FavoriteButton storyId={story.id} onChange={(delta) => setFavoriteCount((value) => Math.max(0, Number(value || 0) + delta))} />
            <ReportButton type="story" targetId={story.id} />
          </div>
        </div>
      </div>
      <div className="section-heading wide" id="capitulos"><span className="eyebrow">Capítulos disponibles</span><h2>Lee en orden o salta al capítulo que quieras.</h2><p>Si la historia usa volúmenes o arcos, los capítulos se agrupan automáticamente con la información pública de la API.</p></div>
      {chapters.length ? <ChapterGroups groups={groups} storyId={story.id} /> : <EmptyBlock title="Esta historia aún no tiene capítulos publicados" text="Cuando el autor publique capítulos, aparecerán en esta portada." />}
    </section>
  );
}
