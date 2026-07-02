import { Link } from 'react-router-dom';
import { Heart, LogIn } from 'lucide-react';
import { getInitials, normalizeStory } from '../utils/story';

function FavoriteRow({ story }) {
  const item = normalizeStory(story);
  return (
    <Link className="favorite-item" to={`/historia/${item.id}`}>
      <div className="favorite-cover">
        {item.coverImageUrl ? <img src={item.coverImageUrl} alt="" /> : <span>{getInitials(item.title)}</span>}
      </div>
      <div>
        <strong>{item.title}</strong>
        <small>{item.author?.displayName || 'Autor'} · {item.genre || 'Narrativa'}</small>
      </div>
    </Link>
  );
}

export default function FavoritesPanel({ stories = [], isAuthenticated = false, loading = false }) {
  return (
    <aside className="favorites-panel editorial-card">
      <div className="panel-title compact-title">
        <Heart size={18} />
        <div><span className="eyebrow">Tus favoritas</span><h2>Biblioteca personal</h2></div>
      </div>

      {!isAuthenticated ? (
        <div className="side-empty">
          <LogIn size={20} />
          <p>Inicia sesión para ver aquí tus historias favoritas.</p>
          <Link className="btn soft" to="/acceso">Iniciar sesión</Link>
        </div>
      ) : loading ? (
        <div className="side-empty"><span className="spinner" /> <p>Cargando favoritas...</p></div>
      ) : stories.length ? (
        <div className="favorites-list">
          {stories.map((story, index) => <FavoriteRow story={story} key={story.id || story.storyId || index} />)}
        </div>
      ) : (
        <div className="side-empty"><Heart size={20} /><p>Aún no guardaste historias como favoritas.</p></div>
      )}
    </aside>
  );
}
