import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Archive, BarChart3, BookOpen, FileText, Heart, MessageCircle, PenLine, Plus, RefreshCcw, Settings, ShieldOff, Star, Trash2, Users } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';

const panelTabs = [
  { key: 'resumen', label: 'Resumen', icon: BarChart3 },
  { key: 'historias', label: 'Mis historias', icon: BookOpen },
  { key: 'actividad', label: 'Actividad lectora', icon: Heart },
  { key: 'configuracion', label: 'Configuración', icon: Settings },
];

const storyTabs = [
  { key: 'published', label: 'Publicadas' },
  { key: 'draft', label: 'Borradores' },
  { key: 'archived', label: 'Archivadas' },
];

function storyStatus(story) {
  if (story.archivedAt || story.publicationState === 'archived') return 'archived';
  return story.publicationState || 'draft';
}

function WriterSummary({ summary, comments }) {
  const cards = [
    ['Historias publicadas', summary?.publishedStoriesCount ?? summary?.storiesCount, BookOpen],
    ['Borradores activos', summary?.draftStoriesCount, FileText],
    ['Favoritos recibidos', summary?.favoritesReceivedCount ?? summary?.favoritesCount, Heart],
    ['Autores seguidos', summary?.followingCount, Users],
    ['Comentarios recientes', summary?.recentCommentsCount, MessageCircle],
  ];
  return (
    <>
      <div className="stats-grid compact-stats writer-stats">
        {cards.map(([label, value, Icon]) => <article className="stat-card" key={label}><Icon /><span>{label}</span><strong>{value ?? '—'}</strong></article>)}
      </div>
      <section className="editorial-card compact-panel writer-row-gap">
        <div className="compact-panel-head"><MessageCircle size={18} /><h2>Comentarios recientes</h2></div>
        {comments.length ? comments.map((comment) => <p key={comment.id}>“{comment.content}”</p>) : <EmptyBlock title="Sin comentarios recientes" text="Cuando tus lectores interactúen con tus textos aparecerá aquí." />}
      </section>
    </>
  );
}

function StoryCreateForm({ onCreated }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', coverImageUrl: '', visibilityState: 'public', publicationState: 'draft', allowFeedback: true, allowScores: true });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const created = await api.stories.create({ ...form, startedOn: new Date().toISOString().slice(0, 10) });
      onCreated?.(created);
      navigate(`/editor/${created.id}`);
    } catch (error) {
      setMessage(error.message || 'No se pudo crear la historia.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="editorial-card settings-form compact-form" onSubmit={submit}>
      <h2><Plus size={17} /> Crear nueva historia</h2>
      <label>Título<input name="title" value={form.title} onChange={update} required placeholder="Título de la obra" /></label>
      <label>Descripción<textarea name="description" value={form.description} onChange={update} rows="3" placeholder="Sinopsis breve" /></label>
      <label>Portada URL<input name="coverImageUrl" value={form.coverImageUrl} onChange={update} placeholder="https://..." /></label>
      <div className="two-cols compact-two">
        <label>Visibilidad<select name="visibilityState" value={form.visibilityState} onChange={update}><option value="public">Pública</option><option value="private">Privada</option><option value="unlisted">Solo con enlace</option></select></label>
        <label>Estado inicial<select name="publicationState" value={form.publicationState} onChange={update}><option value="draft">Borrador</option><option value="published">Publicada</option></select></label>
      </div>
      <button className="btn primary" disabled={busy}>{busy ? 'Creando...' : 'Crear y abrir editor'}</button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
}

function MyStoriesManager({ user }) {
  const [active, setActive] = useState('published');
  const [stories, setStories] = useState([]);
  const [archived, setArchived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  async function load() {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    const [allRes, archivedRes] = await Promise.allSettled([
      api.stories.byUser(user.id, { includeDrafts: true, page: 0, size: 100 }),
      api.stories.mineArchived({ page: 0, size: 100 }),
    ]);
    if (allRes.status === 'fulfilled') setStories(pageContent(allRes.value)); else setError(allRes.reason);
    setArchived(archivedRes.status === 'fulfilled' ? pageContent(archivedRes.value) : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [user?.id]);

  const visible = useMemo(() => {
    const source = active === 'archived' ? archived : stories;
    return source.filter((story) => active === 'archived' ? true : storyStatus(story) === active);
  }, [active, stories, archived]);

  async function act(story, kind) {
    const id = story.id || story.storyId;
    setActionMessage('');
    try {
      if (kind === 'publish') await api.stories.publish(id);
      if (kind === 'unpublish') await api.stories.unpublish(id);
      if (kind === 'archive') await api.stories.archive(id);
      if (kind === 'restore') await api.stories.restore(id);
      if (kind === 'duplicate') await api.stories.duplicate(id, `${story.title || 'Historia'} copia`);
      if (kind === 'delete') {
        if (!confirm('¿Eliminar esta historia definitivamente?')) return;
        await api.stories.remove(id);
      }
      setActionMessage('Acción aplicada correctamente.');
      await load();
    } catch (error) {
      setActionMessage(error.message || 'No se pudo aplicar la acción.');
    }
  }

  return (
    <div className="writer-split">
      <div>
        <div className="tabs-row">{storyTabs.map((tab) => <button className={`tab-btn ${active === tab.key ? 'active' : ''}`} key={tab.key} onClick={() => setActive(tab.key)}>{tab.label}</button>)}</div>
        {loading && <LoadingBlock label="Cargando historias..." />}
        {error && <ErrorBlock error={error} />}
        {!loading && !visible.length && !error && <EmptyBlock title="No hay historias" text="Crea una obra o cambia de pestaña." />}
        <div className="story-action-list">
          {visible.map((story) => {
            const id = story.id || story.storyId;
            const status = storyStatus(story);
            return (
              <article className="editorial-card story-action-card" key={id}>
                <div>
                  <Link to={`/editor/${id}`}><strong>{story.title}</strong></Link>
                  <small>{status} · {story.chaptersCount ?? story.chapterCount ?? '—'} capítulos</small>
                  {story.description && <p>{story.description}</p>}
                </div>
                <div className="story-actions">
                  <Link className="btn soft" to={`/editor/${id}`}>Editar</Link>
                  {status !== 'published' && <button className="btn ghost" onClick={() => act(story, 'publish')}>Publicar</button>}
                  {status === 'published' && <button className="btn ghost" onClick={() => act(story, 'unpublish')}>Despublicar</button>}
                  {status !== 'archived' && <button className="btn ghost" onClick={() => act(story, 'archive')}>Archivar</button>}
                  {status === 'archived' && <button className="btn ghost" onClick={() => act(story, 'restore')}>Restaurar</button>}
                  <button className="btn ghost" onClick={() => act(story, 'duplicate')}>Duplicar</button>
                  <button className="btn ghost danger-btn" onClick={() => act(story, 'delete')}><Trash2 size={14} /> Eliminar</button>
                </div>
              </article>
            );
          })}
        </div>
        {actionMessage && <p className="form-message">{actionMessage}</p>}
      </div>
      <StoryCreateForm onCreated={load} />
    </div>
  );
}

function ReaderActivity() {
  const [data, setData] = useState({ favorites: [], following: [], comments: [], ratings: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  useEffect(() => {
    let mounted = true;
    Promise.allSettled([
      api.favorites.mine({ page: 0, size: 30 }),
      api.follows.following({ page: 0, size: 30 }),
      api.dashboard.recentComments({ page: 0, size: 20 }),
      api.dashboard.ratings({ page: 0, size: 20 }),
    ]).then(([favorites, following, comments, ratings]) => {
      if (!mounted) return;
      setData({
        favorites: favorites.status === 'fulfilled' ? pageContent(favorites.value) : [],
        following: following.status === 'fulfilled' ? pageContent(following.value) : [],
        comments: comments.status === 'fulfilled' ? pageContent(comments.value) : [],
        ratings: ratings.status === 'fulfilled' ? pageContent(ratings.value) : [],
      });
    }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  async function removeFavorite(item) {
    const id = item.storyId || item.id;
    await api.favorites.remove(id);
    setData((prev) => ({ ...prev, favorites: prev.favorites.filter((fav) => (fav.storyId || fav.id) !== id) }));
    setMessage('Favorito eliminado.');
  }
  async function unfollow(item) {
    const id = item.userId || item.followedUserId || item.id;
    await api.follows.unfollow(id);
    setData((prev) => ({ ...prev, following: prev.following.filter((author) => (author.userId || author.followedUserId || author.id) !== id) }));
    setMessage('Autor eliminado de seguidos.');
  }

  if (loading) return <LoadingBlock label="Cargando actividad lectora..." />;
  return (
    <div className="writer-activity-grid">
      {message && <p className="form-message full-span">{message}</p>}
      <section className="editorial-card compact-panel"><h2>Favoritos</h2>{data.favorites.length ? data.favorites.map((item) => <div className="mini-action-row" key={item.storyId || item.id}><span>{item.title || `Historia #${item.storyId || item.id}`}</span><button className="text-link naked" onClick={() => removeFavorite(item)}>Quitar</button></div>) : <EmptyBlock title="Sin favoritos" />}</section>
      <section className="editorial-card compact-panel"><h2>Siguiendo</h2>{data.following.length ? data.following.map((item) => <div className="mini-action-row" key={item.userId || item.id}><span>{item.displayName || item.loginName || `Autor #${item.userId || item.id}`}</span><button className="text-link naked" onClick={() => unfollow(item)}>Dejar de seguir</button></div>) : <EmptyBlock title="No sigues autores" />}</section>
      <section className="editorial-card compact-panel"><h2>Comentarios recientes</h2>{data.comments.length ? data.comments.map((item) => <p key={item.id}>“{item.content}”</p>) : <EmptyBlock title="Sin comentarios" />}</section>
      <section className="editorial-card compact-panel"><h2>Calificaciones emitidas</h2>{data.ratings.length ? data.ratings.map((item) => <p key={item.id}><Star size={14} /> Historia #{item.storyId}: {item.scoreValue}/5</p>) : <EmptyBlock title="Sin calificaciones" />}</section>
    </div>
  );
}

function AccountConfiguration({ logout }) {
  const [profile, setProfile] = useState({ displayName: '', bioText: '', avatarUrl: '' });
  const [password, setPassword] = useState({ oldPassword: '', newPassword: '' });
  const [email, setEmail] = useState({ newEmailAddress: '', password: '' });
  const [message, setMessage] = useState('');
  useEffect(() => { api.users.me().then((me) => setProfile({ displayName: me.displayName || '', bioText: me.bioText || '', avatarUrl: me.avatarUrl || '' })).catch(() => {}); }, []);
  async function saveProfile(event) { event.preventDefault(); setMessage(''); try { await api.users.updateMe(profile); setMessage('Perfil actualizado.'); } catch (error) { setMessage(error.message); } }
  async function savePassword(event) { event.preventDefault(); setMessage(''); try { await api.users.changePassword(password); setPassword({ oldPassword: '', newPassword: '' }); setMessage('Contraseña actualizada.'); } catch (error) { setMessage(error.message); } }
  async function saveEmail(event) { event.preventDefault(); setMessage(''); try { await api.users.changeEmail(email); setEmail({ newEmailAddress: '', password: '' }); setMessage('Cambio de correo solicitado.'); } catch (error) { setMessage(error.message); } }
  async function deactivate() { if (!confirm('¿Desactivar tu cuenta?')) return; try { await api.users.deactivateMe(); await logout(); } catch (error) { setMessage(error.message); } }
  async function invalidate() { try { await api.auth.invalidateAllSessions(); await logout(); } catch (error) { setMessage(error.message); } }
  return (
    <div className="settings-grid">
      {message && <p className="form-message full-span">{message}</p>}
      <form className="editorial-card settings-form" onSubmit={saveProfile}><h2>Perfil público</h2><label>Nombre visible<input value={profile.displayName} onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} /></label><label>Biografía<textarea rows="4" value={profile.bioText} onChange={(e) => setProfile({ ...profile, bioText: e.target.value })} /></label><label>Avatar URL<input value={profile.avatarUrl} onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })} /></label><button className="btn primary">Guardar perfil</button></form>
      <form className="editorial-card settings-form" onSubmit={savePassword}><h2>Cambiar contraseña</h2><label>Contraseña actual<input type="password" value={password.oldPassword} onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })} /></label><label>Nueva contraseña<input type="password" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} /></label><button className="btn primary">Actualizar contraseña</button></form>
      <form className="editorial-card settings-form" onSubmit={saveEmail}><h2>Cambiar correo</h2><label>Nuevo correo<input type="email" value={email.newEmailAddress} onChange={(e) => setEmail({ ...email, newEmailAddress: e.target.value })} /></label><label>Contraseña<input type="password" value={email.password} onChange={(e) => setEmail({ ...email, password: e.target.value })} /></label><button className="btn primary">Solicitar cambio</button></form>
      <section className="editorial-card settings-form danger-zone"><h2><ShieldOff size={17} /> Seguridad</h2><button className="btn ghost" onClick={invalidate} type="button"><RefreshCcw size={15} /> Cerrar sesión en todos los dispositivos</button><button className="btn ghost danger-btn" onClick={deactivate} type="button">Desactivar cuenta</button></section>
    </div>
  );
}

export default function WriterPanel() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState('resumen');
  const [summary, setSummary] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.allSettled([api.dashboard.me(), api.dashboard.recentComments({ page: 0, size: 5 })])
      .then(([summaryRes, commentsRes]) => {
        if (!mounted) return;
        if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value); else setError(summaryRes.reason);
        setComments(commentsRes.status === 'fulfilled' ? pageContent(commentsRes.value) : []);
      }).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <section className="page compact-page writer-panel-page">
      <div className="section-heading wide compact"><span className="eyebrow">Panel del escritor</span><h1>Tu escritorio creativo.</h1><p>Resumen, historias, actividad lectora y configuración en un solo espacio privado.</p></div>
      <div className="writer-panel-layout">
        <aside className="editorial-card writer-sidebar">
          {panelTabs.map(({ key, label, icon: Icon }) => <button key={key} className={`writer-nav-item ${active === key ? 'active' : ''}`} onClick={() => setActive(key)}><Icon size={16} /> {label}</button>)}
          <Link className="writer-nav-item" to="/escribir"><PenLine size={16} /> Escribir rápido</Link>
        </aside>
        <div className="writer-main">
          {loading && active === 'resumen' && <LoadingBlock label="Cargando resumen..." />}
          {error && active === 'resumen' && <ErrorBlock error={error} />}
          {active === 'resumen' && !loading && <WriterSummary summary={summary} comments={comments} />}
          {active === 'historias' && <MyStoriesManager user={user} />}
          {active === 'actividad' && <ReaderActivity />}
          {active === 'configuracion' && <AccountConfiguration logout={logout} />}
        </div>
      </div>
    </section>
  );
}
