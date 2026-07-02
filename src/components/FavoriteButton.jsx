import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function FavoriteButton({ storyId, onChange, compact = false }) {
  const { isAuthenticated } = useAuth();
  const [favorite, setFavorite] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    setMessage('');
    if (!isAuthenticated || !storyId) return;
    api.engagement.isFavorite(storyId)
      .then((payload) => mounted && setFavorite(Boolean(payload?.favorite ?? payload?.isFavorite)))
      .catch(() => mounted && setFavorite(false));
    return () => { mounted = false; };
  }, [storyId, isAuthenticated]);

  async function toggleFavorite() {
    if (!isAuthenticated) return;
    setBusy(true);
    setMessage('');
    try {
      if (favorite) {
        await api.engagement.unfavorite(storyId);
        setFavorite(false);
        onChange?.(-1);
        setMessage('Quitada de favoritos.');
      } else {
        await api.engagement.favorite(storyId);
        setFavorite(true);
        onChange?.(1);
        setMessage('Agregada a favoritos.');
      }
    } catch (error) {
      setMessage(error.message || 'No se pudo actualizar favorito.');
    } finally {
      setBusy(false);
    }
  }

  if (!storyId) return null;

  if (!isAuthenticated) {
    return (
      <Link className={compact ? 'text-link naked' : 'btn soft'} to="/acceso">
        <Heart size={compact ? 14 : 16} /> Guardar en favoritos
      </Link>
    );
  }

  return (
    <span className="favorite-control">
      <button className={`${compact ? 'text-link naked' : favorite ? 'btn primary' : 'btn soft'}`} onClick={toggleFavorite} disabled={busy} type="button" aria-pressed={favorite}>
        <Heart size={compact ? 14 : 16} fill={favorite ? 'currentColor' : 'none'} />
        {busy ? 'Guardando...' : favorite ? 'En favoritos' : 'Marcar favorito'}
      </button>
      {message && <small>{message}</small>}
    </span>
  );
}
