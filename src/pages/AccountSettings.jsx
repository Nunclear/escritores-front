import { useState } from 'react';
import { KeyRound, Mail, PowerOff } from 'lucide-react';
import { api } from '../api/client';
import { ErrorBlock } from '../components/ApiState';

export default function AccountSettings() {
  const [password, setPassword] = useState({ oldPassword: '', newPassword: '' });
  const [email, setEmail] = useState({ newEmailAddress: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  async function changePassword(event) { event.preventDefault(); setMessage(''); setError(null); try { await api.users.changePassword(password); setMessage('Contraseña actualizada.'); setPassword({ oldPassword: '', newPassword: '' }); } catch (err) { setError(err); } }
  async function changeEmail(event) { event.preventDefault(); setMessage(''); setError(null); try { await api.users.changeEmail(email); setMessage('Solicitud de cambio de correo enviada.'); setEmail({ newEmailAddress: '', password: '' }); } catch (err) { setError(err); } }
  async function deactivate() { setMessage(''); setError(null); try { await api.users.deactivateMe(); setMessage('Cuenta desactivada correctamente.'); } catch (err) { setError(err); } }

  return <section className="page compact-page"><div className="section-heading wide compact"><span className="eyebrow">Configuración</span><h1>Cuenta y seguridad.</h1></div>{error && <ErrorBlock error={error} />}{message && <p className="form-message settings-message">{message}</p>}<div className="settings-grid"><form className="editorial-card settings-form" onSubmit={changePassword}><h2><KeyRound size={18} /> Cambiar contraseña</h2><label>Contraseña actual<input type="password" value={password.oldPassword} onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })} required /></label><label>Nueva contraseña<input type="password" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} required /></label><button className="btn primary">Guardar contraseña</button></form><form className="editorial-card settings-form" onSubmit={changeEmail}><h2><Mail size={18} /> Cambiar correo</h2><label>Nuevo correo<input type="email" value={email.newEmailAddress} onChange={(e) => setEmail({ ...email, newEmailAddress: e.target.value })} required /></label><label>Contraseña<input type="password" value={email.password} onChange={(e) => setEmail({ ...email, password: e.target.value })} required /></label><button className="btn soft">Solicitar cambio</button></form><div className="editorial-card settings-form danger-zone"><h2><PowerOff size={18} /> Desactivar cuenta</h2><p>Esta acción cambia el estado de tu cuenta según la API del backend.</p><button className="btn ghost" onClick={deactivate}>Desactivar cuenta</button></div></div></section>;
}
