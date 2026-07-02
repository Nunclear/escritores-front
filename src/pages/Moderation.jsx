import { useEffect, useMemo, useState } from 'react';
import { Activity, Bell, CheckCircle2, EyeOff, FileWarning, Megaphone, ShieldAlert, UserX, XCircle } from 'lucide-react';
import { api, pageContent } from '../api/client';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';

const tabs = [
  ['reportes', 'Reportes'],
  ['sanciones', 'Sanciones'],
  ['avisos', 'Avisos globales'],
  ['actividad', 'Actividad'],
  ['usuarios', 'Usuarios'],
];

function ReportTarget({ report }) {
  if (report.storyId) return <span>Lectura / historia #{report.storyId}</span>;
  if (report.chapterId) return <span>Capítulo #{report.chapterId}</span>;
  if (report.commentId) return <span>Comentario #{report.commentId}</span>;
  if (report.targetUserId) return <span>Usuario #{report.targetUserId}</span>;
  return <span>Recurso no especificado</span>;
}

function ReportDecision({ report, action }) {
  const [note, setNote] = useState('');
  const text = note.trim() || 'Decisión tomada desde el panel de moderación';

  async function markFalse() {
    await action('Reporte marcado como falso / sin infracción. No se tomó acción.', () => api.reports.reject(report.id, `Reporte falso o no comprobado. ${text}`));
  }

  async function reviewOnly() {
    await action('Reporte marcado como revisado. Queda documentado sin acción inmediata.', () => api.reports.review(report.id, `Revisado. ${text}`));
  }

  async function hideOrUnpublish() {
    if (report.commentId) {
      await action('Reporte comprobado: comentario ocultado y reporte resuelto.', async () => {
        await api.moderation.hideComment(report.commentId, report.reasonText || text);
        return api.reports.resolve(report.id, `Reporte real. Comentario ocultado. ${text}`);
      });
      return;
    }
    if (report.chapterId) {
      await action('Reporte comprobado: capítulo despublicado y reporte resuelto.', async () => {
        await api.chapters.unpublish(report.chapterId);
        return api.reports.resolve(report.id, `Reporte real. Capítulo despublicado. ${text}`);
      });
      return;
    }
    if (report.storyId) {
      await action('Reporte comprobado: lectura despublicada y reporte resuelto.', async () => {
        await api.stories.unpublish(report.storyId);
        return api.reports.resolve(report.id, `Reporte real. Lectura despublicada. ${text}`);
      });
      return;
    }
    await action('Reporte resuelto sin recurso accionable.', () => api.reports.resolve(report.id, `Reporte real, sin recurso accionable. ${text}`));
  }

  return (
    <div className="moderation-decision-box">
      <label>Nota de verificación
        <textarea rows="2" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ej.: no se comprobó plagio, comentario sí contiene insultos, requiere seguimiento..." />
      </label>
      <div className="story-actions moderation-decision-actions">
        <button className="btn soft" type="button" onClick={reviewOnly}><CheckCircle2 size={14} /> Revisar sin acción</button>
        <button className="btn ghost" type="button" onClick={markFalse}><XCircle size={14} /> Es falso / no hacer nada</button>
        <button className="btn primary" type="button" onClick={hideOrUnpublish}><EyeOff size={14} /> Es real: ocultar/despublicar</button>
      </div>
    </div>
  );
}

function useModerationData() {
  const [state, setState] = useState({ reports: [], reviewedReports: [], sanctions: [], notices: [], activity: [], users: [], loading: true, error: null });

  async function load() {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    const results = await Promise.allSettled([
      api.reports.pending({ page: 0, size: 20 }),
      api.reports.list({ statusName: 'reviewed', page: 0, size: 10 }),
      api.sanctions.active({ page: 0, size: 20 }),
      api.globalNotices.active(),
      api.adminDashboard.activity({ page: 0, size: 20 }),
      api.adminUsers.byState({ accountState: 'suspended', page: 0, size: 20 }),
    ]);
    setState({
      reports: results[0].status === 'fulfilled' ? pageContent(results[0].value) : [],
      reviewedReports: results[1].status === 'fulfilled' ? pageContent(results[1].value) : [],
      sanctions: results[2].status === 'fulfilled' ? pageContent(results[2].value) : [],
      notices: results[3].status === 'fulfilled' ? pageContent(results[3].value) : [],
      activity: results[4].status === 'fulfilled' ? pageContent(results[4].value) : [],
      users: results[5].status === 'fulfilled' ? pageContent(results[5].value) : [],
      loading: false,
      error: results.find((item) => item.status === 'rejected')?.reason || null,
    });
  }

  useEffect(() => { load(); }, []);
  return { ...state, reload: load };
}

export default function Moderation() {
  const [activeTab, setActiveTab] = useState('reportes');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState({ title: '', messageText: '', isEnabled: true, startsAt: '', endsAt: '' });
  const [sanction, setSanction] = useState({ targetUserId: '', reasonText: '', endsAt: '' });
  const { reports, reviewedReports, sanctions, notices, activity, users, loading, error, reload } = useModerationData();

  const summary = useMemo(() => [
    ['Reportes pendientes', reports.length, FileWarning],
    ['Reportes revisados', reviewedReports.length, CheckCircle2],
    ['Sanciones activas', sanctions.length, ShieldAlert],
    ['Avisos activos', notices.length, Megaphone],
    ['Cuentas suspendidas', users.length, UserX],
  ], [reports.length, reviewedReports.length, sanctions.length, notices.length, users.length]);

  async function action(label, fn) {
    setMessage('');
    try {
      await fn();
      setMessage(label);
      await reload();
    } catch (err) {
      setMessage(err.message || 'No se pudo completar la acción.');
    }
  }

  async function createNotice(event) {
    event.preventDefault();
    await action('Aviso global creado correctamente.', () => api.globalNotices.create({
      ...notice,
      startsAt: notice.startsAt || null,
      endsAt: notice.endsAt || null,
    }));
    setNotice({ title: '', messageText: '', isEnabled: true, startsAt: '', endsAt: '' });
  }

  async function createSanction(event) {
    event.preventDefault();
    const payload = { targetUserId: Number(sanction.targetUserId), reasonText: sanction.reasonText };
    await action('Sanción emitida correctamente.', () => sanction.endsAt
      ? api.sanctions.temporaryBan({ ...payload, startsAt: new Date().toISOString(), endsAt: sanction.endsAt })
      : api.sanctions.warning(payload)
    );
    setSanction({ targetUserId: '', reasonText: '', endsAt: '' });
  }

  return (
    <section className="page compact-page staff-page">
      <div className="section-heading wide">
        <span className="eyebrow">Panel del moderador</span>
        <h1>Verificar reportes antes de actuar.</h1>
        <p>Los reportes se revisan como reales o falsos. El moderador puede no hacer nada, ocultar un comentario, despublicar una lectura/capítulo o resolver el caso.</p>
      </div>

      {loading && <LoadingBlock label="Cargando herramientas de moderación..." />}
      {error && <ErrorBlock error={error} />}
      {message && <div className="state-block"><CheckCircle2 size={18} /> {message}</div>}

      <div className="metrics-grid staff-summary-grid">
        {summary.map(([label, value, Icon]) => <div className="stat-card" key={label}><Icon /><span>{label}</span><strong>{value}</strong></div>)}
      </div>

      <div className="tabs-row staff-tabs">
        {tabs.map(([key, label]) => <button key={key} className={`tab-btn ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>{label}</button>)}
      </div>

      {activeTab === 'reportes' && (
        <div className="staff-split reports-split">
          <section className="editorial-card compact-panel">
            <div className="compact-panel-head"><FileWarning size={18} /><h2>Reportes pendientes de verificación</h2></div>
            {!reports.length ? <EmptyBlock title="No hay reportes pendientes" text="La cola de moderación está limpia." /> : (
              <div className="staff-list">
                {reports.map((report) => (
                  <article className="staff-row report-review-row" key={report.id}>
                    <div>
                      <strong>Reporte #{report.id}</strong>
                      <small><ReportTarget report={report} /> · {report.statusName || 'pending'} · reportado por usuario #{report.reporterUserId || '—'}</small>
                      <p>{report.reasonText || 'Sin motivo adicional.'}</p>
                      <ReportDecision report={report} action={action} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
          <section className="editorial-card compact-panel">
            <div className="compact-panel-head"><CheckCircle2 size={18} /><h2>Revisados recientemente</h2></div>
            {!reviewedReports.length ? <EmptyBlock title="Sin reportes revisados" text="Los casos marcados como revisados aparecerán aquí." /> : reviewedReports.map((report) => (
              <div className="mini-action-row" key={report.id}><span>Reporte #{report.id} · <ReportTarget report={report} /></span><small>{report.statusName}</small></div>
            ))}
          </section>
        </div>
      )}

      {activeTab === 'sanciones' && (
        <div className="staff-split">
          <form className="editorial-card compact-panel compact-form" onSubmit={createSanction}>
            <div className="compact-panel-head"><ShieldAlert size={18} /><h2>Emitir sanción</h2></div>
            <label>ID de usuario<input value={sanction.targetUserId} onChange={(e) => setSanction({ ...sanction, targetUserId: e.target.value })} required /></label>
            <label>Motivo<textarea rows="3" value={sanction.reasonText} onChange={(e) => setSanction({ ...sanction, reasonText: e.target.value })} required /></label>
            <label>Fin de baneo temporal opcional<input type="datetime-local" value={sanction.endsAt} onChange={(e) => setSanction({ ...sanction, endsAt: e.target.value })} /></label>
            <button className="btn primary">Emitir sanción</button>
          </form>
          <section className="editorial-card compact-panel">
            <div className="compact-panel-head"><UserX size={18} /><h2>Sanciones activas</h2></div>
            {!sanctions.length ? <EmptyBlock title="Sin sanciones activas" text="No hay medidas vigentes." /> : sanctions.map((item) => (
              <div className="mini-action-row" key={item.id}><span>#{item.id} · usuario {item.targetUserId} · {item.sanctionKind}</span><button className="btn ghost" onClick={() => action('Sanción levantada.', () => api.sanctions.lift(item.id, 'Levantada por moderación'))}>Levantar</button></div>
            ))}
          </section>
        </div>
      )}

      {activeTab === 'avisos' && (
        <div className="staff-split">
          <form className="editorial-card compact-panel compact-form" onSubmit={createNotice}>
            <div className="compact-panel-head"><Bell size={18} /><h2>Crear aviso global</h2></div>
            <label>Título<input value={notice.title} onChange={(e) => setNotice({ ...notice, title: e.target.value })} required /></label>
            <label>Mensaje<textarea rows="4" value={notice.messageText} onChange={(e) => setNotice({ ...notice, messageText: e.target.value })} required /></label>
            <div className="two-cols compact-two"><label>Inicio<input type="datetime-local" value={notice.startsAt} onChange={(e) => setNotice({ ...notice, startsAt: e.target.value })} /></label><label>Fin<input type="datetime-local" value={notice.endsAt} onChange={(e) => setNotice({ ...notice, endsAt: e.target.value })} /></label></div>
            <button className="btn primary">Publicar aviso</button>
          </form>
          <section className="editorial-card compact-panel">
            <div className="compact-panel-head"><Megaphone size={18} /><h2>Avisos activos</h2></div>
            {!notices.length ? <EmptyBlock title="Sin avisos activos" text="No hay comunicados visibles." /> : notices.map((item) => <div className="notice-card mini" key={item.id}><div><strong>{item.title}</strong><p>{item.messageText}</p></div></div>)}
          </section>
        </div>
      )}

      {activeTab === 'actividad' && (
        <section className="editorial-card compact-panel">
          <div className="compact-panel-head"><Activity size={18} /><h2>Actividad reciente del sistema</h2></div>
          {!activity.length ? <EmptyBlock title="Sin actividad reciente" text="Aún no hay eventos del sistema para mostrar." /> : activity.map((item, index) => <div className="mini-action-row" key={`${item.referenceId || index}-${item.createdAt}`}><span>{item.type || 'EVENTO'} · referencia #{item.referenceId || '—'}</span><small>{item.createdAt || ''}</small></div>)}
        </section>
      )}

      {activeTab === 'usuarios' && (
        <section className="editorial-card compact-panel">
          <div className="compact-panel-head"><UserX size={18} /><h2>Usuarios por estado de cuenta</h2></div>
          {!users.length ? <EmptyBlock title="Sin cuentas suspendidas" text="No se encontraron usuarios suspendidos en la consulta actual." /> : users.map((user) => <div className="mini-action-row" key={user.id}><span>{user.loginName || user.displayName || `Usuario #${user.id}`} · {user.accountState}</span><button className="btn ghost" onClick={() => action('Cuenta activada.', () => api.adminUsers.setAccountState(user.id, 'active'))}>Activar</button></div>)}
        </section>
      )}
    </section>
  );
}
