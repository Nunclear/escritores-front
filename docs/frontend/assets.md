# Rendering de Datos e Imágenes

## Renderizado de Datos desde API

### Patrón Básico de Renderizado Condicional

```jsx
function StoryList() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.stories.list()
      .then(setStories)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  // Estados de renderizado
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (stories.length === 0) return <EmptyState />;

  return (
    <div className="grid">
      {stories.map(story => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}
```

---

## Manejo de Imágenes

### Portadas de Historias

```jsx
function StoryCard({ story }) {
  return (
    <div className="story-card">
      <img
        src={story.cover || '/placeholder.png'}
        alt={story.title}
        className="story-image"
        onError={(e) => {
          e.target.src = '/placeholder.png';
        }}
      />
      <h3>{story.title}</h3>
    </div>
  );
}
```

**Características**:
- URL de portada desde API
- Fallback a imagen placeholder si falla
- Alt text para accesibilidad

### Avatar de Usuarios

```jsx
function UserAvatar({ user }) {
  return (
    <img
      src={user.avatar || '/default-avatar.png'}
      alt={user.username}
      className="avatar"
      title={user.username}
    />
  );
}
```

### Lazy Loading de Imágenes

```jsx
function OptimizedImage({ src, alt, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"  // Native lazy loading
      {...props}
    />
  );
}
```

---

## Paginación

### Componente de Paginación

```jsx
function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="btn-prev"
      >
        ← Anterior
      </button>

      <div className="page-info">
        Página {page + 1} de {totalPages}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages - 1}
        className="btn-next"
      >
        Siguiente →
      </button>
    </div>
  );
}
```

### Uso en Componente

```jsx
function StoriesWithPagination() {
  const [page, setPage] = useState(0);
  const [stories, setStories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.stories.list({ page, size: 20 })
      .then(response => {
        setStories(response.content);
        setTotalPages(Math.ceil(response.totalElements / 20));
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      {loading ? (
        <LoadingState />
      ) : (
        <>
          <StoryGrid stories={stories} />
          <Pagination 
            page={page} 
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </>
  );
}
```

---

## Filtrado y Búsqueda

### Búsqueda en Tiempo Real (con Debounce)

```jsx
function SearchStories() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setLoading(true);
        api.stories.search({ q: query })
          .then(setResults)
          .finally(() => setLoading(false));
      } else {
        setResults([]);
      }
    }, 300);  // Espera 300ms después de que deja de escribir

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <input
        type="text"
        placeholder="Buscar historias..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      {loading && <LoadingState />}
      {results.length > 0 && <StoryGrid stories={results} />}
      {query && results.length === 0 && !loading && (
        <EmptyState message="No se encontraron historias" />
      )}
    </>
  );
}
```

### Filtros Múltiples

```jsx
function FilteredStories() {
  const [filters, setFilters] = useState({
    genre: '',
    status: 'published',
    sortBy: 'createdAt,desc'
  });
  const [stories, setStories] = useState([]);

  useEffect(() => {
    api.stories.search(filters)
      .then(setStories);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="filtered-view">
      <div className="filters">
        <select
          value={filters.genre}
          onChange={(e) => handleFilterChange('genre', e.target.value)}
        >
          <option value="">Todos los géneros</option>
          <option value="fantasy">Fantasy</option>
          <option value="scifi">Sci-Fi</option>
          <option value="romance">Romance</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="published">Publicadas</option>
          <option value="draft">Borradores</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
        >
          <option value="createdAt,desc">Más Recientes</option>
          <option value="createdAt,asc">Más Antiguos</option>
          <option value="views,desc">Más Vistas</option>
          <option value="rating,desc">Mejor Calificadas</option>
        </select>
      </div>

      <StoryGrid stories={stories} />
    </div>
  );
}
```

---

## Rendering de Contenido Complejo

### Capítulos con Agrupación

```jsx
function ChapterList({ chapters, arcs, volumes }) {
  // Agrupar capítulos por volumen y arco
  const grouped = volumes.map(volume => ({
    ...volume,
    arcs: arcs
      .filter(arc => arc.volumeId === volume.id)
      .map(arc => ({
        ...arc,
        chapters: chapters.filter(ch => ch.arcId === arc.id)
      }))
  }));

  return (
    <div className="chapters-list">
      {grouped.map(volume => (
        <div key={volume.id} className="volume">
          <h2>{volume.title}</h2>
          
          {volume.arcs.map(arc => (
            <div key={arc.id} className="arc">
              <h3>{arc.title}</h3>
              
              <ul className="chapters">
                {arc.chapters.map(chapter => (
                  <li key={chapter.id}>
                    <a href={`/leer/${chapter.storyId}/capitulo/${chapter.id}`}>
                      {chapter.number}. {chapter.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Comentarios Anidados

```jsx
function CommentThread({ comments, level = 0 }) {
  return (
    <div className={`comments level-${level}`}>
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          <div className="comment-header">
            <strong>{comment.author.username}</strong>
            <small>{formatDate(comment.createdAt)}</small>
          </div>
          
          <p className="comment-content">{comment.content}</p>
          
          {comment.replies && comment.replies.length > 0 && (
            <CommentThread comments={comment.replies} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## Activos Estáticos

### Ubicación de Archivos

```
public/
├── favicon.svg          # Icono del sitio
├── icons.svg            # Sprite de iconos SVG
├── image.png            # Imagen genérica
└── [otros activos]
```

### Referencia en Componentes

```jsx
// Favicon (en index.html)
<link rel="icon" href="/favicon.svg" />

// Imágenes
<img src="/image.png" alt="Description" />

// Sprite SVG
<svg>
  <use href="/icons.svg#icon-name" />
</svg>
```

### Importar Activos en JavaScript

```jsx
import logoSvg from '/public/favicon.svg';

function Header() {
  return <img src={logoSvg} alt="Logo" />;
}
```

---

## Formatos de Datos Comunes

### Respuesta de Lista (Paginada)

```js
{
  content: [
    { id: 1, title: "..." },
    { id: 2, title: "..." }
  ],
  page: 0,
  size: 20,
  totalElements: 150,
  totalPages: 8,
  first: true,
  last: false
}
```

**Acceso**:
```jsx
const items = response.content || response;  // A veces es array directo
```

### Respuesta de Objeto Único

```js
{
  id: 1,
  title: "Mi Historia",
  description: "...",
  author: { id: 1, username: "..." },
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

### Respuesta de Error

```js
{
  message: "Descripción del error",
  error: "Error Code",
  status: 400,
  timestamp: "2024-01-15T10:30:00Z",
  path: "/api/stories/999"
}
```

---

## Utilidad: Función pageContent

```js
export function pageContent(payload, fallback = []) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  return fallback;
}
```

**Uso**:
```jsx
const items = pageContent(apiResponse);  // Maneja ambos formatos
```

---

## Formatos de Fecha

### Función de Formato

```jsx
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Ejemplo: "15 de enero de 2024, 10:30"
```

### Tiempo Relativo

```jsx
function timeAgo(isoDate) {
  const seconds = Math.floor((new Date() - new Date(isoDate)) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `hace ${interval} años`;
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `hace ${interval} meses`;
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `hace ${interval} días`;
  
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `hace ${interval} horas`;
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `hace ${interval} minutos`;
  
  return 'hace unos segundos';
}

// Ejemplo: "hace 2 horas"
```

---

## Mejores Prácticas

### 1. Siempre Usar Key en Listas

```jsx
// ✅ Correcto
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// ❌ Evitar: key = index
{items.map((item, i) => (
  <div key={i}>{item.name}</div>
))}
```

### 2. Fallbacks para Imágenes

```jsx
<img
  src={story.cover || '/default-cover.jpg'}
  onError={(e) => e.target.src = '/default-cover.jpg'}
  alt={story.title}
/>
```

### 3. Lazy Loading

```jsx
<img
  src="url"
  loading="lazy"
  alt="description"
/>
```

### 4. Responsive Images

```jsx
<img
  srcSet="
    /image-small.jpg 480w,
    /image-medium.jpg 768w,
    /image-large.jpg 1024w
  "
  src="/image-medium.jpg"
  alt="description"
/>
```
