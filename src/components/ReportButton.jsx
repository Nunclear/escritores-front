import { useState } from 'react';
import { Flag, Send, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const COPY = {
  story: {
    title: 'Reportar lectura inadecuada',
    label: 'Reportar lectura',
    placeholder: 'Describe por qué esta lectura debería ser revisada...',
    success: 'Reporte de lectura enviado. Moderación verificará si corresponde tomar acción.',
  },
  chapter: {
    title: 'Reportar capítulo inadecuado',
    label: 'Reportar capítulo',
    placeholder: 'Describe qué parte del capítulo incumple las normas...',
    success: 'Reporte de capítulo enviado. Moderación verificará si corresponde tomar acción.',
  },
  comment: {
    title: 'Reportar comentario inadecuado',
    label: 'Reportar comentario',
    placeholder: 'Describe por qué este comentario es inapropiado...',
    success: 'Reporte de comentario enviado. Moderación verificará si corresponde tomar acción.',
  },
};

const REASON_GROUPS = {
  story: [
    ['copy', 'Copy / plagio', 'Posible copia, plagio o vulneración de derechos de autor'],
    ['tema', 'Tema inadecuado', 'La lectura trata temas no permitidos o mal señalizados'],
    ['odio', 'Odio / discriminación', 'Contenido de odio, acoso o discriminación'],
    ['sexual_violento', 'Sexual o violento', 'Contenido sexual, violento o explícito inapropiado'],
    ['spam', 'Spam', 'Autopromoción abusiva o contenido engañoso'],
    ['otro', 'Otro', 'Otro motivo que requiere revisión'],
  ],
  chapter: [
    ['copy', 'Copy / plagio', 'Posible copia o plagio en este capítulo'],
    ['tema', 'Tema inadecuado', 'El capítulo trata un tema no permitido o mal señalizado'],
    ['odio', 'Odio / discriminación', 'Lenguaje de odio, acoso o discriminación'],
    ['sexual_violento', 'Sexual o violento', 'Contenido sexual, violento o explícito inapropiado'],
    ['otro', 'Otro', 'Otro motivo que requiere revisión'],
  ],
  comment: [
    ['acoso', 'Acoso', 'Insulto, hostigamiento o ataque personal'],
    ['odio', 'Odio / discriminación', 'Discurso de odio o discriminación'],
    ['spam', 'Spam', 'Publicidad, enlaces repetidos o autopromoción abusiva'],
    ['spoiler', 'Spoiler malicioso', 'Revela información importante con mala intención'],
    ['otro', 'Otro', 'Otro motivo que requiere revisión'],
  ],
};

export default function ReportButton({ type, targetId, compact = false, className = '' }) {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const reasons = REASON_GROUPS[type] || REASON_GROUPS.story;
  const [reasonKey, setReasonKey] = useState(reasons[0][0]);
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const copy = COPY[type] || COPY.story;
  const selected = reasons.find(([key]) => key === reasonKey) || reasons[0];

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setError('');
    const reasonText = details.trim() ? `${selected[1]}: ${selected[2]}. Detalle: ${details.trim()}` : `${selected[1]}: ${selected[2]}`;
    const payload = { reasonText };
    if (type === 'story') payload.storyId = Number(targetId);
    if (type === 'chapter') payload.chapterId = Number(targetId);
    if (type === 'comment') payload.commentId = Number(targetId);

    try {
      await api.reports[type](payload);
      setMessage(copy.success);
      setDetails('');
    } catch (err) {
      setError(err.message || 'No se pudo enviar el reporte.');
    } finally {
      setBusy(false);
    }
  }

  if (!targetId) return null;

  return (
    <>
      <button className={`${compact ? 'text-link naked report-inline' : 'btn ghost'} ${className}`} type="button" onClick={() => setOpen(true)}>
        <Flag size={compact ? 14 : 16} /> {compact ? 'Reportar' : copy.label}
      </button>

      {open && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={copy.title}>
          <div className="report-modal editorial-card">
            <button className="modal-close" type="button" onClick={() => setOpen(false)} aria-label="Cerrar reporte"><X size={18} /></button>
            <span className="eyebrow"><Flag size={14} /> Revisión de comunidad</span>
            <h2>{copy.title}</h2>
            <p>Selecciona la causa. El moderador o administrador verificará si el reporte es real o falso antes de decidir qué hacer.</p>

            {!isAuthenticated ? (
              <div className="login-note report-login">
                Debes iniciar sesión para reportar contenido. Así evitamos reportes anónimos abusivos.
                <Link className="btn primary" to="/acceso" onClick={() => setOpen(false)}>Iniciar sesión</Link>
              </div>
            ) : (
              <form className="form-grid" onSubmit={submit}>
                <div className="report-reason-tabs" role="tablist" aria-label="Causas del reporte">
                  {reasons.map(([key, label, description]) => (
                    <button key={key} type="button" className={`report-reason-tab ${reasonKey === key ? 'active' : ''}`} onClick={() => setReasonKey(key)} title={description}>
                      {label}
                    </button>
                  ))}
                </div>
                <div className="report-cause-box">
                  <strong>{selected[1]}</strong>
                  <span>{selected[2]}</span>
                </div>
                <label>Detalle opcional
                  <textarea value={details} onChange={(event) => setDetails(event.target.value)} placeholder={copy.placeholder} rows="4" maxLength="800" />
                </label>
                <button className="btn primary" disabled={busy} type="submit"><Send size={16} /> {busy ? 'Enviando...' : 'Enviar reporte'}</button>
              </form>
            )}
            {message && <p className="form-message success-message">{message}</p>}
            {error && <p className="form-message error-message">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}
