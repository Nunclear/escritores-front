# Componentes Reutilizables

## Catálogo de Componentes

### 1. Shell

**Ubicación**: `src/components/Shell.jsx`

**Propósito**: Envoltorio principal de la aplicación que proporciona layout base.

**Props**:
- `children` (ReactNode) - Contenido a renderizar

**Estructura**:
```
Shell
├── Ambient backgrounds (decorativos)
├── Header
├── main (contenido dinámico)
└── Footer
```

**Uso**:
```jsx
<Shell>
  <HomePage />
</Shell>
```

---

### 2. Header

**Ubicación**: `src/components/Header.jsx`

**Propósito**: Encabezado y navegación principal.

**Características**:
- Logo
- Navegación (Inicio, Explorar, Autores, Comunidad)
- Toggle tema claro/oscuro
- Botón de acceso/perfil

---

### 3. StoryCard

**Ubicación**: `src/components/StoryCard.jsx`

**Propósito**: Componente card que muestra información resumida de una historia.

**Props**:
- `story` (Story) - Datos de la historia
- `onClick` (function) - Callback de click
- `showAuthor` (boolean) - Mostrar nombre del autor

**Información mostrada**:
- Portada (imagen)
- Título
- Autor
- Descripción breve
- Vistas
- Favoritos
- Rating promedio

---

### 4. FavoriteButton

**Ubicación**: `src/components/FavoriteButton.jsx`

**Propósito**: Botón para agregar/remover historias de favoritos.

**Props**:
- `storyId` (number) - ID de la historia
- `isFavorite` (boolean) - Estado inicial
- `onToggle` (function) - Callback de cambio

**Comportamiento**:
- Click sin autenticar → Redirige a login
- Click autenticado → Toggle favorito

---

### 5. RatingBox

**Ubicación**: `src/components/RatingBox.jsx`

**Propósito**: Componente para mostrar y permitir calificación.

**Props**:
- `storyId` (number) - ID de la historia
- `rating` (number) - Calificación actual (0-5)
- `onRate` (function) - Callback de cambio

**Características**:
- Estrellas interactivas
- Envío a API
- Feedback visual

---

### 6. CommentsThread

**Ubicación**: `src/components/CommentsThread.jsx`

**Propósito**: Hilo de comentarios con replies anidados.

**Props**:
- `chapterId` (number) - ID del capítulo
- `comments` (Comment[]) - Array de comentarios
- `onCommentCreate` (function) - Callback de nuevo comentario
- `onCommentDelete` (function) - Callback de eliminar

**Características**:
- Comentarios raíz
- Replies anidadas
- Editor de comentarios
- Borrado con confirmación

---

### 7. ChapterGroups

**Ubicación**: `src/components/ChapterGroups.jsx`

**Propósito**: Agrupa capítulos por arcos y volúmenes.

**Props**:
- `chapters` (Chapter[]) - Capítulos
- `arcs` (Arc[]) - Arcos
- `volumes` (Volume[]) - Volúmenes
- `onChapterSelect` (function) - Callback de selección

**Estructura**:
```
├─ Volumen 1
│  ├─ Arco 1
│  │  ├─ Capítulo 1
│  │  └─ Capítulo 2
│  └─ Arco 2
│     └─ Capítulo 3
├─ Volumen 2
...
```

---

### 8. RankingPanel

**Ubicación**: `src/components/RankingPanel.jsx`

**Propósito**: Muestra historias más vistas (ranking).

**Características**:
- Top historias por vistas
- Paginación
- Cards comprimidas

**Datos**: Obtiene de `/metrics/stories/top-viewed`

---

### 9. FavoritesPanel

**Ubicación**: `src/components/FavoritesPanel.jsx`

**Propósito**: Panel de historias favoritas del usuario.

**Props**:
- `userId` (number) - ID del usuario

**Características**:
- Lista de favoritos
- Remover de favoritos
- Filtros

---

### 10. WriterNav

**Ubicación**: `src/components/WriterNav.jsx`

**Propósito**: Navegación personalizada para escritores.

**Elementos**:
- Mis Historias
- Escribir
- Worldbuilding
- Métricas

---

### 11. WriterTabs

**Ubicación**: `src/components/WriterTabs.jsx`

**Propósito**: Sistema de pestañas para paneles de escritor.

**Props**:
- `tabs` (Tab[]) - Array de pestañas
- `activeTab` (string) - Pestaña activa
- `onTabChange` (function) - Callback de cambio

**Estructura**:
```
Tab {
  id: string,
  label: string,
  icon?: ReactNode,
  content: ReactNode
}
```

---

### 12. ThemeToggle

**Ubicación**: `src/components/ThemeToggle.jsx`

**Propósito**: Botón para alternar tema claro/oscuro.

**Características**:
- Guarda preferencia en localStorage
- Aplica clase `dark` a `html`
- Icono dinámico

---

### 13. ReportButton

**Ubicación**: `src/components/ReportButton.jsx`

**Propósito**: Botón para reportar contenido (historia, capítulo, comentario).

**Props**:
- `type` ('story' | 'chapter' | 'comment') - Tipo de contenido
- `id` (number) - ID del contenido
- `onReportSubmit` (function) - Callback

**Modal de reporte**:
- Selección de razón
- Campo de descripción
- Confirmación

---

### 14. ApiState

**Ubicación**: `src/components/ApiState.jsx`

**Propósito**: Componente de debug que muestra estado de API.

**Uso en desarrollo**: Ver respuestas y errores de API en tiempo real.

**Características**:
- Última solicitud
- Última respuesta
- Últimas 10 llamadas

---

### 15. Estados Visuales

#### LoadingState
Spinner y mensaje mientras se cargan datos.

#### ErrorState
Mensaje de error con botón "Reintentar".

#### EmptyState
Mensaje cuando no hay datos.

---

## Patrones Comunes

### Props Reutilizables

```jsx
// Standard props pattern
interface CardProps {
  data: T,
  onClick?: (item: T) => void,
  className?: string,
  isLoading?: boolean,
  error?: Error | null
}
```

### Manejo de Estado en Componentes

```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Renderizado condicional
{loading ? (
  <LoadingState />
) : error ? (
  <ErrorState onRetry={retry} />
) : data?.length === 0 ? (
  <EmptyState />
) : (
  <CardGrid data={data} />
)}
```

### Composición de Componentes

```jsx
<Shell>
  <Header />
  <main>
    <StoryCardGrid>
      {stories.map(story => (
        <StoryCard 
          key={story.id} 
          story={story}
          onClick={handleStoryClick}
        />
      ))}
    </StoryCardGrid>
  </main>
</Shell>
```

## Ejemplos de Uso

### Página de Inicio

```jsx
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import { api } from './api/client';

export default function HomePage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.stories.list()
      .then(setStories)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Shell>
      <RankingPanel />
      {loading ? (
        <LoadingState />
      ) : (
        <div className="grid">
          {stories.map(story => (
            <StoryCard 
              key={story.id} 
              story={story}
            />
          ))}
        </div>
      )}
    </Shell>
  );
}
```

### Portada de Historia

```jsx
export default function StoryCover() {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    Promise.all([
      api.stories.get(storyId),
      api.chapters.published(storyId)
    ]).then(([story, chapters]) => {
      setStory(story);
      setChapters(chapters);
    });
  }, [storyId]);

  if (!story) return <LoadingState />;

  return (
    <Shell>
      <div className="story-cover">
        <img src={story.cover} alt={story.title} />
        <h1>{story.title}</h1>
        <p>{story.description}</p>
        
        <RatingBox 
          storyId={storyId}
          rating={story.rating}
        />
        
        <FavoriteButton 
          storyId={storyId}
          isFavorite={story.isFavorite}
        />
        
        <ChapterGroups 
          chapters={chapters}
          onChapterSelect={handleChapterSelect}
        />
      </div>
    </Shell>
  );
}
```

## Composición Avanzada

### Higher-Order Components (HOC)

Aunque no se ve de forma explícita, `Protected` y `StaffOnly` actúan como HOCs:

```jsx
function ProtectedComponent({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/acceso" />;
}
```

### Compound Components

Ejemplo con `ChapterGroups`:

```jsx
<ChapterGroups chapters={chapters}>
  <ChapterGroups.Volume>
    <ChapterGroups.Arc>
      <ChapterGroups.Chapter />
    </ChapterGroups.Arc>
  </ChapterGroups.Volume>
</ChapterGroups>
```
