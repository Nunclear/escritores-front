import { useEffect, useMemo, useState } from 'react';
import { Archive, BarChart3, CheckCircle2, Clock, FileWarning, Megaphone, Shield, Trash2, UserCog, Users } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';

const tabs = [
  ['resumen', 'Resumen'],
  ['usuarios', 'Usuarios'],
  ['historias', 'Historias'],
  ['capitulos', 'Capítulos'],
  ['historial', 'Historial'],
  ['avisos', 'Avisos'],
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('resumen');
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState([]);
  const [users, setUsers] = useState([]);
  const [stories, setStories] = useState([]);
  const [chaptersStoryId, setChaptersStoryId] = useState('');
  const [chapters, setChapters] = useState([]);
  const [historyUserId, setHistoryUserId] = useState('');
  const [history, setHistory] = useState([]);
  const [notice, setNotice] = useState({ title: '', messageText: '', startsAt: '', endsAt: '', isEnabled: true });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    const results = await Promise.allSettled([
      api.adminDashboard.summary(),
      api.adminDashboard.activity({ page: 0, size: 12 }),
      api.users.list({ page: 0, size: 20, sort: 'createdAt,desc' }),
      api.stories.list({ page: 0, size: 20, sort: 'createdAt,desc' }),
    ]);
    if (results[0].status === 'fulfilled') setSummary(results[0].value);
    if (results[1].status === 'fulfilled') setActivity(pageContent(results[1].value));
    if (results[2].status === 'fulfilled') setUsers(pageContent(results[2].value));
    if (results[3].status === 'fulfilled') setStories(pageContent(results[3].value));
    setError(results.find((item) => item.status === 'rejected')?.reason || null);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const cards = useMemo(() => [
    ['Usuarios', summary?.usersCount, Users],
    ['Historias', summary?.storiesCount, BarChart3],
    ['Reportes pendientes', summary?.pendingReportsCount, FileWarning],
    ['Sanciones activas', summary?.activeSanctionsCount, Shield],
    ['Avisos vigentes', summary?.activeNoticesCount, Megaphone],
  ], [summary]);

  async function action(label, fn) {
    setMessage('');
    try {
      await fn();
      setMessage(label);
      await load();
    } catch (err) {
      setMessage(err.message || 'No se pudo completar la acción.');
    }
  }

  async function loadChapters(event) {
    event.preventDefault();
    setMessage('');
    try {
      const data = await api.chapters.byStory(chaptersStoryId, true);
      setChapters(pageContent(data));
    } catch (err) { setMessage(err.message || 'No se pudieron cargar capítulos.'); }
  }

  async function loadHistory(event) {
    event.preventDefault();
    setMessage('');
    try {
      const data = await api.adminUsers.history(historyUserId);
      setHistory(pageContent(data?.events || data));
    } catch (err) { setMessage(err.message || 'No se pudo cargar el historial.'); }
  }

  async function createNotice(event) {
    event.preventDefault();
    await action('Aviso creado correctamente.', () => api.globalNotices.create({ ...notice, startsAt: notice.startsAt || null, endsAt: notice.endsAt || null }));
    setNotice({ title: '', messageText: '', startsAt: '', endsAt: '', isEnabled: true });
  }

  return (
    <section className="page compact-page staff-page">
      <div className="section-heading wide">
        <span className="eyebrow">Panel del administrador</span>
        <h1>Control total de la plataforma.</h1>
        <p>Gestiona usuarios, roles, estados de cuenta, recursos editoriales, avisos globales y auditoría del sistema.</p>
      </div>

      {loading && <LoadingBlock label="Cargando panel administrativo..." />}
      {error && <ErrorBlock error={error} />}
      {message && <div className="state-block"><CheckCircle2 size={18} /> {message}</div>}

      <div className="tabs-row staff-tabs">
        {tabs.map(([key, label]) => <button key={key} className={`tab-btn ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>{label}</button>)}
      </div>

      {activeTab === 'resumen' && (
        <>
          <div className="metrics-grid staff-summary-grid">
            {cards.map(([label, value, Icon]) => <div className="stat-card" key={label}><Icon /><span>{label}</span><strong>{value ?? '—'}</strong></div>)}
          </div>
          <section className="editorial-card compact-panel writer-row-gap">
            <div className="compact-panel-head"><Clock size={18} /><h2>Actividad reciente</h2></div>
            {!activity.length ? <EmptyBlock title="Sin actividad reciente" text="No hay eventos administrativos para mostrar." /> : activity.map((item, index) => <div className="mini-action-row" key={`${item.referenceId || index}-${item.createdAt}`}><span>{item.type || 'EVENTO'} · referencia #{item.referenceId || '—'}</span><small>{item.createdAt || ''}</small></div>)}
          </section>
        </>
      )}

      {activeTab === 'usuarios' && (
        <section className="editorial-card compact-panel">
          <div className="compact-panel-head"><UserCog size={18} /><h2>Gestión de usuarios</h2></div>
          {!users.length ? <EmptyBlock title="No hay usuarios para mostrar" text="La API no devolvió resultados." /> : users.map((user) => (
            <article className="staff-row" key={user.id}>
              <div><strong>{user.displayName || user.loginName || `Usuario #${user.id}`}</strong><small>#{user.id} · rol: {user.accessLevel || 'user'} · estado: {user.accountState || 'active'}</small></div>
              <div className="story-actions">
                <select defaultValue={user.accessLevel || 'user'} onChange={(e) => action('Rol actualizado.', () => api.adminUsers.setAccessLevel(user.id, e.target.value))}><option value="user">user</option><option value="moderator">moderator</option><option value="admin">admin</option></select>
                <select defaultValue={user.accountState || 'active'} onChange={(e) => action('Estado actualizado.', () => api.adminUsers.setAccountState(user.id, e.target.value))}><option value="active">active</option><option value="suspended">suspended</option><option value="restricted">restricted</option><option value="review">review</option></select>
                <button className="btn ghost" onClick={() => { setHistoryUserId(user.id); setActiveTab('historial'); }}>Historial</button>
              </div>
            </article>
          ))}
        </section>
      )}

      {activeTab === 'historias' && (
        <section className="editorial-card compact-panel">
          <div className="compact-panel-head"><Archive size={18} /><h2>Recursos: historias</h2></div>
          {!stories.length ? <EmptyBlock title="No hay historias" text="No se encontraron historias públicas en la consulta actual." /> : stories.map((story) => (
            <article className="staff-row" key={story.id}>
              <div><strong>{story.title || `Historia #${story.id}`}</strong><small>#{story.id} · autor #{story.ownerUserId || '—'} · {story.publicationState || '—'} · {story.visibilityState || '—'}</small><p>{story.description || ''}</p></div>
              <div className="story-actions">
                <button className="btn soft" onClick={() => action('Historia publicada.', () => api.stories.publish(story.id))}>Publicar</button>
                <button className="btn ghost" onClick={() => action('Historia despublicada.', () => api.stories.unpublish(story.id))}>Despublicar</button>
                <button className="btn ghost" onClick={() => action('Historia archivada.', () => api.stories.archive(story.id))}>Archivar</button>
                <button className="btn ghost danger-btn" onClick={() => action('Historia eliminada.', () => api.stories.remove(story.id))}><Trash2 size={14} /> Eliminar</button>
              </div>
            </article>
          ))}
        </section>
      )}

      {activeTab === 'capitulos' && (
        <section className="editorial-card compact-panel">
          <div className="compact-panel-head"><Archive size={18} /><h2>Recursos: capítulos por historia</h2></div>
          <form className="filters compact-filters admin-inline-form" onSubmit={loadChapters}><label>ID de historia<input value={chaptersStoryId} onChange={(e) => setChaptersStoryId(e.target.value)} required /></label><button className="btn primary">Cargar capítulos</button></form>
          {!chapters.length ? <EmptyBlock title="Sin capítulos cargados" text="Ingresa el ID de una historia para revisar sus capítulos." /> : chapters.map((chapter) => (
            <article className="staff-row" key={chapter.id}>
              <div><strong>{chapter.title || `Capítulo #${chapter.id}`}</strong><small>#{chapter.id} · posición {chapter.positionIndex || '—'} · {chapter.publicationState || '—'}</small></div>
              <div className="story-actions">
                <button className="btn soft" onClick={() => action('Capítulo publicado.', () => api.chapters.publish(chapter.id))}>Publicar</button>
                <button className="btn ghost" onClick={() => action('Capítulo despublicado.', () => api.chapters.unpublish(chapter.id))}>Despublicar</button>
                <button className="btn ghost" onClick={() => action('Capítulo archivado.', () => api.chapters.archive(chapter.id))}>Archivar</button>
                <button className="btn ghost danger-btn" onClick={() => action('Capítulo eliminado.', () => api.chapters.remove(chapter.id))}><Trash2 size={14} /> Eliminar</button>
              </div>
            </article>
          ))}
        </section>
      )}

      {activeTab === 'historial' && (
        <section className="editorial-card compact-panel">
          <div className="compact-panel-head"><Clock size={18} /><h2>Historial de cambios de usuario</h2></div>
          <form className="filters compact-filters admin-inline-form" onSubmit={loadHistory}><label>ID de usuario<input value={historyUserId} onChange={(e) => setHistoryUserId(e.target.value)} required /></label><button className="btn primary">Ver historial</button></form>
          {!history.length ? <EmptyBlock title="Sin historial cargado" text="Busca un usuario para ver cambios de rol o estado." /> : history.map((item, index) => <div className="mini-action-row" key={index}><span>{item.changedField}: {item.oldValue || '—'} → {item.newValue || '—'}</span><small>{item.changedAt || ''}</small></div>)}
        </section>
      )}

      {activeTab === 'avisos' && (
        <form className="editorial-card compact-panel compact-form" onSubmit={createNotice}>
          <div className="compact-panel-head"><Megaphone size={18} /><h2>Crear aviso global</h2></div>
          <label>Título<input value={notice.title} onChange={(e) => setNotice({ ...notice, title: e.target.value })} required /></label>
          <label>Mensaje<textarea rows="4" value={notice.messageText} onChange={(e) => setNotice({ ...notice, messageText: e.target.value })} required /></label>
          <div className="two-cols compact-two"><label>Inicio<input type="datetime-local" value={notice.startsAt} onChange={(e) => setNotice({ ...notice, startsAt: e.target.value })} /></label><label>Fin<input type="datetime-local" value={notice.endsAt} onChange={(e) => setNotice({ ...notice, endsAt: e.target.value })} /></label></div>
          <button className="btn primary">Crear aviso</button>
        </form>
      )}
    </section>
  );
}
