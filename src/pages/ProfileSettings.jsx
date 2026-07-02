import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ErrorBlock, LoadingBlock } from '../components/ApiState';

export default function ProfileSettings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ displayName: '', bioText: '', avatarUrl: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    api.users.me().then((me) => setForm({ displayName: me.displayName || '', bioText: me.bioText || '', avatarUrl: me.avatarUrl || '' })).catch(setError).finally(() => setLoading(false));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    setError(null);
    try { await api.users.updateMe(form); setMessage('Perfil actualizado correctamente.'); }
    catch (err) { setError(err); }
  }

  return <section className="page compact-page"><div className="section-heading wide compact"><span className="eyebrow">Mi perfil</span><h1>Editar presencia pública.</h1><p>Actualiza tu nombre visible, biografía y avatar.</p></div>{loading ? <LoadingBlock /> : <form className="editorial-card settings-form" onSubmit={submit}><label>Nombre visible<input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} /></label><label>Biografía<textarea rows="5" value={form.bioText} onChange={(e) => setForm({ ...form, bioText: e.target.value })} /></label><label>Avatar URL<input value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} /></label><button className="btn primary"><Save size={16} /> Guardar perfil</button>{message && <p className="form-message">{message}</p>}</form>}{error && <ErrorBlock error={error} />}</section>;
}
