import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <section className="page profile-page">
      <div className="author-hero editorial-card">
        {user?.avatarUrl ? <img className="author-avatar-big" src={user.avatarUrl} alt="Avatar" /> : <div className="author-avatar-big avatar-placeholder"><UserRound size={54} /></div>}
        <div>
          <span className="eyebrow">Perfil</span>
          <h1>{user?.displayName || user?.loginName || 'Usuario'}</h1>
          <p>{user?.bioText || 'Actualiza tu biografía desde el backend o el panel de usuario cuando esté disponible.'}</p>
          {user?.id && <Link className="btn soft" to={`/autor/${user.id}`}>Ver perfil público</Link>}
        </div>
      </div>
    </section>
  );
}
