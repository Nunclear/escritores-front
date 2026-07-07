# Componentes Principales

## Componentes del Shell (Layout Base)

### Shell.jsx

Contenedor principal que envuelve toda la aplicación.

```jsx
export default function Shell({ children }) {
  return (
    <div className="app-shell">
      <div className="ambient one" />
      <div className="ambient two" />
      <Header />
      <main>{children}</main>
      <footer className="footer">...</footer>
    </div>
  );
}
```

**Props:**
- `children` - Contenido de la página

**Estilos:**
- Ambientes decorativos blur
- Header sticky
- Footer responsivo

---

### Header.jsx

Barra de navegación y autenticación.

```jsx
// Características:
- Logo y navegación
- Búsqueda de historias
- Botón de escritura (si autenticado)
- Toggle de tema
- Menú de usuario/login

// Estados:
- Anónimo: Links públicos + Login
- Usuario: Links privados + Avatar
- Staff: Links adicionales de moderación
- Admin: Link de admin panel
```

**Ubicación:** `src/components/Header.jsx`

---

## Componentes de Estado (ApiState)

### ApiState.jsx

Componentes para mostrar estados de carga, error y vacío.

```jsx
export function LoadingBlock() {
  return (
    <div className="state-block">
      <span className="spinner" />
      Cargando...
    </div>
  );
}

export function ErrorBlock({ error, onRetry }) {
  return (
    <div className="state-block error">
      <span>Error: {error?.message}</span>
      {onRetry && <button onClick={onRetry}>Reintentar</button>}
    </div>
  );
}

export function EmptyBlock({ title, text }) {
  return (
    <div className="state-block empty">
      <p>{title || 'Sin resultados'}</p>
      <small>{text}</small>
    </div>
  );
}
```

**Uso:**
```jsx
{loading && <LoadingBlock />}
{error && <ErrorBlock error={error} onRetry={retry} />}
{data.length === 0 && <EmptyBlock title="Sin historias" />}
{data && <StoryCard story={data[0]} />}
```

---

## Componentes de Contenido

### StoryCard.jsx

Card individual de historia.

```jsx
export default function StoryCard({ story }) {
  return (
    <article className="story-card">
      <div className="cover-wrap">
        <img src={story.coverImage} alt={story.title} />
        <span className="status-chip">{story.status}</span>
      </div>
      <div className="story-body">
        <div className="author-line">
          <img src={author.avatar} alt={author.name} />
          <span>{author.displayName}</span>
        </div>
        <h3>{story.title}</h3>
        <p>{story.description}</p>
        <div className="tag-row">
          {story.genres.map(g => <span key={g}>{g}</span>)}
        </div>
        <div className="card-meta">
          <span>{story.views} vistas</span>
          <span>{story.favoriteCount} favoritos</span>
          <span>⭐ {story.rating}</span>
        </div>
      </div>
    </article>
  );
}
```

**Props:**
- `story` - Objeto historia normalizado

**Estados:**
- Imagen de portada
- Badge de estado (draft, published, archived)
- Información de autor
- Metadata (vistas, favoritos, rating)

---

### CommentsThread.jsx

Sistema de comentarios con hilos de respuestas.

```jsx
export default function CommentsThread({ chapterId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    api.comments.byChapter(chapterId)
      .then(data => setComments(data))
      .finally(() => setLoading(false));
  }, [chapterId]);
  
  return (
    <section className="comments-section">
      <h3>Comentarios ({comments.length})</h3>
      
      {user && <CommentForm onSubmit={addComment} />}
      {!user && <LoginNote />}
      
      <ul className="comments-list">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </ul>
    </section>
  );
}
```

**Características:**
- Listar comentarios
- Mostrar respuestas en hilos
- Formulario para nuevo comentario
- Validación de autenticación

---

### RatingBox.jsx

Sistema de calificaciones para historias.

```jsx
export default function RatingBox({ storyId }) {
  const [rating, setRating] = useState(null);
  const { user } = useAuth();
  
  const handleRate = async (score) => {
    const result = await api.ratings.createOrUpdate({
      storyId,
      score
    });
    setRating(score);
  };
  
  return (
    <div className="rating-box">
      <h3>Califica esta historia</h3>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            className={star <= (rating || 0) ? 'active' : ''}
          >
            ⭐
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

### FavoritesPanel.jsx

Panel mostrando historias favoritas del usuario.

```jsx
export default function FavoritesPanel() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    api.favorites.mine()
      .then(data => setFavorites(data))
      .finally(() => setLoading(false));
  }, []);
  
  return (
    <section className="compact-panel">
      <h2>Mis Favoritos</h2>
      {loading && <LoadingBlock />}
      {favorites.map(story => (
        <Link key={story.id} to={`/historia/${story.id}`}>
          {story.title} - {story.author.displayName}
        </Link>
      ))}
    </section>
  );
}
```

---

### RankingPanel.jsx

Panel mostrando historias top vistas.

```jsx
export default function RankingPanel() {
  const [stories, setStories] = useState([]);
  
  useEffect(() => {
    api.metrics.topViewed({ size: 10 })
      .then(data => setStories(data));
  }, []);
  
  return (
    <aside className="ranking-panel">
      <div className="panel-title">
        <Flame size={20} />
        <h3>Top 10 Historias</h3>
      </div>
      <div className="ranking-list">
        {stories.map((story, index) => (
          <Link key={story.id} className="ranking-item" 
            to={`/historia/${story.id}`}>
            <strong>{index + 1}</strong>
            <span>{story.title}</span>
            <small>{story.views} vistas</small>
          </Link>
        ))}
      </div>
    </aside>
  );
}
```

---

## Componentes de Utilidad

### FavoriteButton.jsx

Botón para agregar/remover de favoritos.

```jsx
export default function FavoriteButton({ storyId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    if (user) {
      api.favorites.isFavorite(storyId)
        .then(res => setIsFavorite(res.isFavorite))
        .catch(() => setIsFavorite(false));
    }
  }, [storyId, user]);
  
  const toggleFavorite = async () => {
    setLoading(true);
    try {
      if (isFavorite) {
        await api.favorites.remove(storyId);
      } else {
        await api.favorites.add(storyId);
      }
      setIsFavorite(!isFavorite);
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <button 
      onClick={toggleFavorite} 
      disabled={loading}
      className={isFavorite ? 'favorited' : ''}
    >
      <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
      {isFavorite ? 'Favorito' : 'Agregar a favoritos'}
    </button>
  );
}
```

---

### ReportButton.jsx

Botón para reportar contenido.

```jsx
export default function ReportButton({ type, targetId }) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  
  const handleReport = async () => {
    await api.reports[type]({
      targetId,
      reason,
      reportedAt: new Date()
    });
    setShowModal(false);
  };
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        <Flag size={18} /> Reportar
      </button>
      
      {showModal && (
        <ReportModal
          onClose={() => setShowModal(false)}
          onSubmit={handleReport}
        />
      )}
    </>
  );
}
```

---

### ThemeToggle.jsx

Toggle para cambiar entre temas claro/oscuro.

```jsx
export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };
  
  return (
    <button onClick={toggleTheme} title="Cambiar tema">
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
```

---

## Componentes de Navegación

### WriterNav.jsx

Navegación específica para escritores.

```jsx
export default function WriterNav() {
  return (
    <nav className="writer-nav">
      <Link to="/escritor">Mi Estudio</Link>
      <Link to="/escribir">Escribir</Link>
      <Link to="/mis-historias">Mis Historias</Link>
      <Link to="/favoritos">Favoritos</Link>
      <Link to="/siguiendo">Siguiendo</Link>
      <Link to="/mi-perfil">Perfil</Link>
    </nav>
  );
}
```

---

### WriterTabs.jsx

Tabs para el panel del escritor.

```jsx
export default function WriterTabs({ activeTab, onTabChange }) {
  return (
    <div className="writer-tabs">
      {[
        { id: 'published', label: 'Publicadas' },
        { id: 'drafts', label: 'Borradores' },
        { id: 'archived', label: 'Archivadas' }
      ].map(tab => (
        <button
          key={tab.id}
          className={activeTab === tab.id ? 'active' : ''}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

---

## Componentes de Grupo

### ChapterGroups.jsx

Agrupa capítulos por arcos y volúmenes.

```jsx
export default function ChapterGroups({ storyId }) {
  const [chapters, setChapters] = useState([]);
  const [arcs, setArcs] = useState([]);
  const [volumes, setVolumes] = useState([]);
  
  useEffect(() => {
    Promise.all([
      api.chapters.published(storyId),
      api.arcs.byStory(storyId),
      api.volumes.byStory(storyId)
    ]).then(([chaps, arcsData, volsData]) => {
      setChapters(chaps);
      setArcs(arcsData);
      setVolumes(volsData);
    });
  }, [storyId]);
  
  return (
    <div className="chapter-groups">
      {arcs.map(arc => (
        <section key={arc.id} className="chapter-group">
          <h3>{arc.title}</h3>
          <ul className="chapter-list">
            {chapters
              .filter(ch => ch.arcId === arc.id)
              .map(ch => (
                <ChapterRow key={ch.id} chapter={ch} />
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

---

## Patrones de Componentes

### Componente con Carga y Error

```jsx
export default function MiComponente({ id }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let mounted = true;
    
    api.getData(id)
      .then(data => {
        if (mounted) setData(data);
      })
      .catch(err => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
      
    return () => { mounted = false; };
  }, [id]);
  
  if (loading) return <LoadingBlock />;
  if (error) return <ErrorBlock error={error} />;
  if (!data) return <EmptyBlock />;
  
  return <div>{/* Contenido */}</div>;
}
```

---

**Última actualización**: Enero 2024
