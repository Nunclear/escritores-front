import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AtSign, BookOpen, Mail, Save, UserRound } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ApiState';
import { getInitials } from '../utils/story';

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ displayName: '', bioText: '', avatarUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    api.users.me()
      .then((data) => {
        if (!mounted) return;
        setProfile(data);
        setForm({ displayName: data?.displayName || '', bioText: data?.bioText || '', avatarUrl: data?.avatarUrl || '' });
      })
      .catch((err) => mounted && setError(err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updated = await api.users.updateMe(form);
      setProfile((current) => ({ ...current, ...updated, ...form }));
      setMessage('Perfil actualizado correctamente.');
    } catch (err) {
      setMessage(err.message || 'No se pudo actualizar el perfil.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <section className="page"><LoadingBlock label="Cargando perfil de usuario..." /></section>;
  if (error) return <section className="page user-profile-page"><ErrorBlock error={error} /></section>;
  if (!profile) return <section className="page user-profile-page"><EmptyBlock title="No se encontró tu perfil" text="Vuelve a iniciar sesión para cargar tus datos." /></section>;

  const displayName = profile.displayName || user?.displayName || 'Usuario';

  return (
    <section className="page user-profile-page compact-page">
      <div className="user-profile-layout">
        <aside className="editorial-card profile-summary-card">
          {profile.avatarUrl ? <img className="profile-avatar-large" src={profile.avatarUrl} alt={`Avatar de ${displayName}`} /> : <div className="profile-avatar-large avatar-panel small-panel">{getInitials(displayName)}</div>}
          <span className="eyebrow">Perfil de usuario</span>
          <h1>{displayName}</h1>
          <p>{profile.bioText || 'Agrega una biografía para presentarte ante lectores y autores.'}</p>
          <div className="profile-mini-meta">
            <span><AtSign size={15} /> {profile.loginName || user?.loginName || 'usuario'}</span>
            <span><Mail size={15} /> {profile.emailAddress || 'correo privado'}</span>
            <span><UserRound size={15} /> {profile.accessLevel || 'user'}</span>
          </div>
          <Link className="btn soft" to={`/autor/${profile.id || user?.id}`}><BookOpen size={16} /> Ver perfil público</Link>
        </aside>

        <form className="editorial-card profile-form-card" onSubmit={save}>
          <span className="eyebrow">Editar datos visibles</span>
          <h2>Tu presencia en Raíz de Palabras</h2>
          <label>Nombre visible<input name="displayName" value={form.displayName} onChange={update} placeholder="Tu nombre de autor o lector" /></label>
          <label>Biografía<textarea name="bioText" value={form.bioText} onChange={update} rows="6" placeholder="Cuenta qué escribes, qué lees o qué mundos te interesan." /></label>
          <label>URL de avatar<input name="avatarUrl" value={form.avatarUrl} onChange={update} placeholder="https://..." /></label>
          <button className="btn primary" disabled={saving}><Save size={17} /> {saving ? 'Guardando...' : 'Guardar cambios'}</button>
          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </section>
  );
}
