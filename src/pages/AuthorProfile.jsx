import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, HeartHandshake, LibraryBig, UserPlus, Users } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { useAuth } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';
import { getInitials } from '../utils/story';

function AuthorAvatar({ profile, authorId }) {
  if (profile?.avatarUrl) return <img className="author-avatar-big" src={profile.avatarUrl} alt={`Avatar de ${profile?.displayName || 'autor'}`} />;
  return <div className="author-avatar-big avatar-panel">{getInitials(profile?.displayName || `Autor ${authorId}`)}</div>;
}

export default function AuthorProfile() {
  const { authorId } = useParams();
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stories, setStories] = useState([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setMessage('');
    const calls = [
      api.users.publicProfile(authorId),
      api.users.authorStories(authorId, { page: 0, size: 20 }),
      api.engagement.followersCount(authorId),
      isAuthenticated ? api.engagement.isFollowing(authorId).catch(() => ({ following: false })) : Promise.resolve({ following: false }),
    ];

    Promise.allSettled(calls).then(([profileRes, storiesRes, followersRes, followingRes]) => {
      if (!mounted) return;
      if (profileRes.status !== 'fulfilled') {
        setError(profileRes.reason);
        setProfile(null);
        setStories([]);
        return;
      }
      const baseProfile = profileRes.value;
      setProfile({
        ...baseProfile,
        followersCount: followersRes.status === 'fulfilled' ? (followersRes.value?.count ?? followersRes.value ?? baseProfile.followersCount) : baseProfile.followersCount,
      });
      setStories(storiesRes.status === 'fulfilled' ? pageContent(storiesRes.value) : []);
      setFollowing(followingRes.status === 'fulfilled' ? Boolean(followingRes.value?.following) : false);
    }).finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [authorId, isAuthenticated]);

  async function toggleFollow() {
    setBusy(true);
    setMessage('');
    try {
      if (following) {
        await api.engagement.unfollow(authorId);
        setFollowing(false);
        setProfile((item) => ({ ...item, followersCount: Math.max(0, (item.followersCount || 1) - 1) }));
        setMessage('Dejaste de seguir a este autor.');
      } else {
        await api.engagement.follow(Number(authorId));
        setFollowing(true);
        setProfile((item) => ({ ...item, followersCount: (item.followersCount || 0) + 1 }));
        setMessage('Ahora sigues a este autor.');
      }
    } catch (err) {
      setMessage(err.message || 'No se pudo actualizar el seguimiento.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <section className="page"><LoadingBlock label="Cargando perfil público..." /></section>;
  if (!profile) return <section className="page author-profile-page"><ErrorBlock error={error} /></section>;

  return (
    <section className="page author-profile-page">
      {error && <ErrorBlock error={error} />}
      <div className="author-hero editorial-card">
        <AuthorAvatar profile={profile} authorId={authorId} />
        <div>
          <span className="eyebrow">Perfil público de autor</span>
          <h1>{profile?.displayName || `Autor #${authorId}`}</h1>
          <p>{profile?.bioText || 'Este autor todavía no agregó una biografía pública.'}</p>
          <div className="author-stats">
            <div><Users /><span>Seguidores</span><strong>{profile?.followersCount ?? 0}</strong></div>
            <div><LibraryBig /><span>Historias publicadas</span><strong>{profile?.storiesCount ?? stories.length}</strong></div>
            <div><BookOpen /><span>Catálogo visible</span><strong>{stories.length}</strong></div>
          </div>
          {isAuthenticated ? (
            <button className={`btn ${following ? 'soft' : 'primary'}`} onClick={toggleFollow} disabled={busy}><UserPlus size={17} /> {following ? 'Siguiendo' : 'Seguir autor'}</button>
          ) : (
            <Link className="btn soft" to="/acceso"><HeartHandshake size={17} /> Inicia sesión para seguir al autor</Link>
          )}
          {message && <p className="form-message">{message}</p>}
        </div>
      </div>

      <div className="section-heading wide"><span className="eyebrow">Historias públicas</span><h2>Obras disponibles de {profile?.displayName || 'este autor'}.</h2></div>
      {stories.length ? <div className="cards-grid">
        {stories.map((story) => <StoryCard key={story.id || story.storyId} story={{ ...story, author: { id: profile.id, displayName: profile.displayName, avatarUrl: profile.avatarUrl } }} />)}
      </div> : <EmptyBlock title="Este autor aún no tiene historias públicas" text="Cuando publique obras visibles, aparecerán en este perfil." />}
    </section>
  );
}
