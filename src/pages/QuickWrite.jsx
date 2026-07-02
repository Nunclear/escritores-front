import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine } from 'lucide-react';
import { api } from '../api/client';
import { ErrorBlock } from '../components/ApiState';

export default function QuickWrite() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', coverImageUrl: '', visibilityState: 'public', publicationState: 'draft', allowFeedback: true, allowScores: true });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try { const story = await api.stories.create({ ...form, startedOn: new Date().toISOString().slice(0, 10) }); navigate(`/editor/${story.id || story.storyId}`); }
    catch (err) { setError(err); }
    finally { setBusy(false); }
  }
  return <section className="page compact-page"><div className="section-heading wide compact"><span className="eyebrow">Escribir</span><h1>Crear una historia nueva.</h1><p>Define los datos iniciales y entra directo al editor para agregar tu primer capítulo.</p></div>{error && <ErrorBlock error={error} />}<form className="editorial-card settings-form" onSubmit={submit}><label>Título<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label><label>Descripción<textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label><label>Portada URL<input value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} /></label><div className="two-cols"><label>Visibilidad<select value={form.visibilityState} onChange={(e) => setForm({ ...form, visibilityState: e.target.value })}><option value="public">Pública</option><option value="private">Privada</option></select></label><label>Estado inicial<select value={form.publicationState} onChange={(e) => setForm({ ...form, publicationState: e.target.value })}><option value="draft">Borrador</option><option value="published">Publicada</option></select></label></div><button className="btn primary" disabled={busy}><PenLine size={16} /> {busy ? 'Guardando...' : 'Guardar y abrir editor'}</button></form></section>;
}
