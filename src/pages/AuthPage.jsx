import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const location = useLocation();
  const [mode, setMode] = useState(() => new URLSearchParams(location.search).get('modo') === 'registro' ? 'register' : 'login');
  const [form, setForm] = useState({ loginOrEmail: '', loginName: '', emailAddress: '', displayName: '', password: '' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMode(new URLSearchParams(location.search).get('modo') === 'registro' ? 'register' : 'login');
  }, [location.search]);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      if (mode === 'login') {
        await login({ loginOrEmail: form.loginOrEmail, password: form.password });
        navigate('/dashboard');
      } else {
        await register({ loginName: form.loginName, emailAddress: form.emailAddress, displayName: form.displayName, password: form.password });
        setMessage('Cuenta creada. Ahora inicia sesión.');
        setMode('login');
      }
    } catch (error) {
      setMessage(error.message || 'No se pudo completar la operación.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page auth-page">
      <div className="auth-card editorial-card">
        <span className="eyebrow">Acceso</span>
        <h1>{mode === 'login' ? 'Volver a tu biblioteca' : 'Crear cuenta'}</h1>
        <form onSubmit={submit} className="form-grid">
          {mode === 'register' && <><label>Usuario<input name="loginName" value={form.loginName} onChange={update} required /></label><label>Nombre visible<input name="displayName" value={form.displayName} onChange={update} required /></label><label>Correo<input name="emailAddress" type="email" value={form.emailAddress} onChange={update} required /></label></>}
          {mode === 'login' && <label>Usuario o correo<input name="loginOrEmail" value={form.loginOrEmail} onChange={update} required /></label>}
          <label>Contraseña<input name="password" type="password" value={form.password} onChange={update} required /></label>
          <button className="btn primary large" disabled={busy}>{busy ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Registrarme'}</button>
        </form>
        {message && <p className="form-message">{message}</p>}
        <button className="text-link naked" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Crear cuenta nueva' : 'Ya tengo cuenta'}</button>
      </div>
    </section>
  );
}
