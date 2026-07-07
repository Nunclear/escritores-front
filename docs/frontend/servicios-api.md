# Servicios y Cliente API

## Cliente HTTP Base

### Ubicación
`src/api/client.js`

### Configuración Base

```javascript
const RAW_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const API_ROOT = `${RAW_BASE_URL.replace(/\/$/, '')}`;

// URL Final: http://localhost:8080/api
```

---

## Función request() - Core

```javascript
export async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    params,
    headers = {},
    auth = true,              // Agregar token automáticamente
    isFormData = false         // Para archivos
  } = options;

  // Preparar headers
  const token = storage.getAccessToken();
  const finalHeaders = { ...headers };
  
  if (!isFormData) finalHeaders['Content-Type'] = 'application/json';
  if (auth && token) finalHeaders.Authorization = `Bearer ${token}`;

  // Realizar solicitud
  const response = await fetch(`${API_ROOT}${path}${toQuery(params)}`, {
    method,
    headers: finalHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  // Procesar respuesta
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  // Manejo de errores
  if (!response.ok) {
    throw new ApiError(
      payload?.message || payload?.error || `Error HTTP ${response.status}`,
      response.status,
      payload
    );
  }

  return payload;
}
```

---

## Almacenamiento Local

### Clases de Storage

```javascript
export const storage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token) => 
    token ? localStorage.setItem(ACCESS_TOKEN_KEY, token)
          : localStorage.removeItem(ACCESS_TOKEN_KEY),
  
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => 
    token ? localStorage.setItem(REFRESH_TOKEN_KEY, token)
          : localStorage.removeItem(REFRESH_TOKEN_KEY),
  
  getVisitorToken: () => {
    let token = localStorage.getItem(VISITOR_KEY);
    if (!token) {
      token = crypto?.randomUUID?.()
        || `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(VISITOR_KEY, token);
    }
    return token;
  },
  
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  },
  setUser: (user) => 
    user ? localStorage.setItem(USER_KEY, JSON.stringify(user))
         : localStorage.removeItem(USER_KEY),
  
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
```

---

## Servicios Disponibles

### Autenticación

```javascript
api.auth.register(data)           // POST /auth/register
api.auth.login(credentials)       // POST /auth/login
api.auth.refresh(refreshToken)    // POST /auth/refresh
api.auth.logout(refreshToken)     // POST /auth/logout
api.auth.me()                     // GET /auth/me
api.auth.forgotPassword(email)    // POST /auth/forgot-password
api.auth.resetPassword(data)      // POST /auth/reset-password
api.auth.verifyEmail(token)       // POST /auth/verify-email
api.auth.invalidateAllSessions()  // POST /auth/invalidate-all-sessions

// Ejemplo
const result = await api.auth.login({
  email: 'user@example.com',
  password: 'password123'
});
// Respuesta: { accessToken, refreshToken, user }
```

### Usuarios

```javascript
// Obtener
api.users.get(id)                    // GET /users/{id}
api.users.list(params)               // GET /users
api.users.publicProfile(id)          // GET /users/{id}/public-profile
api.users.authorStories(id, params)  // GET /users/{id}/stories
api.users.me()                       // GET /users/me
api.users.search(params)             // GET /users/search

// Actualizar
api.users.updateMe(data)             // PUT /users/me
api.users.updateAvatar(url)          // PATCH /users/me/avatar
api.users.changePassword(data)       // POST /users/me/change-password
api.users.changeEmail(data)          // POST /users/me/change-email
api.users.deactivateMe()             // POST /users/me/deactivate
```

### Historias

```javascript
// Obtener
api.stories.list(params)      // GET /stories
api.stories.search(params)    // GET /stories/search
api.stories.get(id)           // GET /stories/{id}
api.stories.getBySlug(slug)   // GET /stories/slug/{slug}
api.stories.mineDrafts(params)// GET /stories/me/drafts
api.stories.mineArchived(params) // GET /stories/me/archived
api.stories.byUser(id, params)   // GET /stories/user/{id}

// Gestionar
api.stories.create(data)      // POST /stories
api.stories.update(id, data)  // PUT /stories/{id}
api.stories.publish(id)       // POST /stories/{id}/publish
api.stories.unpublish(id)     // POST /stories/{id}/unpublish
api.stories.archive(id)       // POST /stories/{id}/archive
api.stories.restore(id)       // POST /stories/{id}/restore
api.stories.duplicate(id, title) // POST /stories/{id}/duplicate
api.stories.remove(id)        // DELETE /stories/{id}

// Ejemplo
const stories = await api.stories.list({
  page: 0,
  size: 12,
  sort: 'createdAt,desc',
  visibilityState: 'public',
  publicationState: 'published'
});
```

### Capítulos

```javascript
// Obtener
api.chapters.published(storyId)      // GET /chapters/story/{storyId}/published
api.chapters.byStory(storyId, includeDrafts)  // GET /chapters/story/{storyId}
api.chapters.get(id)                 // GET /chapters/{id}
api.chapters.search(params)          // GET /chapters/search
api.chapters.drafts(params)          // GET /chapters/me/drafts

// Gestionar
api.chapters.create(data)            // POST /chapters
api.chapters.update(id, data)        // PUT /chapters/{id}
api.chapters.publish(id)             // POST /chapters/{id}/publish
api.chapters.unpublish(id)           // POST /chapters/{id}/unpublish
api.chapters.archive(id)             // POST /chapters/{id}/archive
api.chapters.reorder(storyId, items) // POST /chapters/reorder
api.chapters.move(id, data)          // POST /chapters/{id}/move
api.chapters.remove(id)              // DELETE /chapters/{id}
```

### Comentarios

```javascript
api.comments.create(data)            // POST /comments
api.comments.get(id)                 // GET /comments/{id}
api.comments.byStory(storyId, params)// GET /comments/story/{storyId}
api.comments.byChapter(chapterId, params) // GET /comments/chapter/{chapterId}
api.comments.replies(id)             // GET /comments/{id}/replies
api.comments.update(id, data)        // PUT /comments/{id}
api.comments.remove(id)              // DELETE /comments/{id}

// Estructura comentario
{
  id: 123,
  body: "Excelente capítulo!",
  author: { id, displayName, avatar },
  createdAt: "2024-01-15T10:30:00Z",
  replies: [...]  // Comentarios anidados
}
```

### Calificaciones

```javascript
api.ratings.createOrUpdate(data)     // POST /ratings
api.ratings.get(id)                  // GET /ratings/{id}
api.ratings.byStory(storyId, params) // GET /ratings/story/{storyId}
api.ratings.average(storyId)         // GET /ratings/story/{storyId}/average
api.ratings.mineForStory(storyId)    // GET /ratings/story/{storyId}/me
api.ratings.remove(id)               // DELETE /ratings/{id}

// Ejemplo
const rating = await api.ratings.createOrUpdate({
  storyId: 10,
  score: 4.5  // 1-5
});
```

### Favoritos

```javascript
api.favorites.add(storyId)           // POST /favorites
api.favorites.remove(storyId)        // DELETE /favorites/{storyId}
api.favorites.mine(params)           // GET /favorites/me
api.favorites.isFavorite(storyId)    // GET /favorites/story/{storyId}/me
api.favorites.count(storyId)         // GET /favorites/story/{storyId}/count

// Ejemplo
await api.favorites.add(10);         // Agregar a favoritos
const isFav = await api.favorites.isFavorite(10);
const count = await api.favorites.count(10);
```

### Seguimiento

```javascript
api.follows.follow(userId)           // POST /follows
api.follows.unfollow(userId)         // DELETE /follows/{userId}
api.follows.following(params)        // GET /follows/me/following
api.follows.followers(userId, params)// GET /follows/user/{userId}/followers
api.follows.isFollowing(userId)      // GET /follows/user/{userId}/me
api.follows.count(userId)            // GET /follows/user/{userId}/count
```

### Worldbuilding

```javascript
// Personajes
api.characters.create(data)
api.characters.get(id)
api.characters.byStory(storyId, params)
api.characters.search(params)
api.characters.update(id, data)
api.characters.remove(id)

// Habilidades
api.skills.create(data)
api.skills.get(id)
api.skills.byStory(storyId, params)
api.skills.search(params)
api.skills.update(id, data)
api.skills.remove(id)

// Eventos
api.events.create(data)
api.events.get(id)
api.events.byStory(storyId, params)
api.events.byChapter(chapterId)
api.events.search(params)
api.events.update(id, data)
api.events.remove(id)

// Arcos
api.arcs.create(data)
api.arcs.get(id)
api.arcs.byStory(storyId)
api.arcs.update(id, data)
api.arcs.reorder(storyId, items)
api.arcs.remove(id)

// Volúmenes
api.volumes.create(data)
api.volumes.get(id)
api.volumes.byStory(storyId)
api.volumes.update(id, data)
api.volumes.reorder(storyId, items)
api.volumes.move(id, data)
api.volumes.remove(id)
```

### Métricas

```javascript
api.metrics.story(storyId)           // GET /metrics/story/{storyId}
api.metrics.chapter(chapterId)       // GET /metrics/chapter/{chapterId}
api.metrics.author(userId)           // GET /metrics/author/{userId}
api.metrics.topViewed(params)        // GET /metrics/stories/top-viewed
api.metrics.registerStoryView(storyId)     // POST /metrics/views/story
api.metrics.registerChapterView(storyId, chapterId) // POST /metrics/views/chapter
```

### Reportes

```javascript
api.reports.story(data)              // POST /reports/story
api.reports.chapter(data)            // POST /reports/chapter
api.reports.comment(data)            // POST /reports/comment
api.reports.user(data)               // POST /reports/user
api.reports.pending(params)          // GET /reports/pending
api.reports.list(params)             // GET /reports
api.reports.get(id)                  // GET /reports/{id}
api.reports.assign(id, reviewedBy)   // POST /reports/{id}/assign
api.reports.review(id, text)         // POST /reports/{id}/review
api.reports.resolve(id, text)        // POST /reports/{id}/resolve
api.reports.reject(id, text)         // POST /reports/{id}/reject
api.reports.history(params)          // GET /reports/history
```

### Moderación

```javascript
api.moderation.hideComment(id, reason)     // POST /moderation/comments/{id}/hide
api.moderation.restoreComment(id)          // POST /moderation/comments/{id}/restore
api.moderation.hiddenComments(params)      // GET /moderation/comments/hidden
api.moderation.reportedComments(params)    // GET /moderation/comments/reported
api.moderation.commentQueue(params)        // GET /moderation/comments/queue
```

### Panel Admin

```javascript
api.adminUsers.setAccessLevel(id, level)   // PATCH /admin/users/{id}/access-level
api.adminUsers.setAccountState(id, state)  // PATCH /admin/users/{id}/account-state
api.adminUsers.byRole(params)              // GET /admin/users/by-role
api.adminUsers.byState(params)             // GET /admin/users/by-state
api.adminUsers.history(id)                 // GET /admin/users/{id}/history

api.globalNotices.create(data)             // POST /global-notices
api.globalNotices.get(id)                  // GET /global-notices/{id}
api.globalNotices.active()                 // GET /global-notices/active
api.globalNotices.history(params)          // GET /global-notices/history
api.globalNotices.update(id, data)         // PUT /global-notices/{id}
api.globalNotices.enable(id)               // POST /global-notices/{id}/enable
api.globalNotices.disable(id)              // POST /global-notices/{id}/disable
api.globalNotices.archive(id)              // POST /global-notices/{id}/archive
```

---

## Manejo de Errores

### Clase ApiError

```javascript
export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}
```

### Uso en Try/Catch

```javascript
try {
  const data = await api.stories.list();
} catch (error) {
  if (error.status === 401) {
    // Token inválido/expirado
    console.error('Sesión expirada');
  } else if (error.status === 403) {
    // Sin permisos
    console.error('Acceso denegado');
  } else if (error.status === 404) {
    // No encontrado
    console.error('Recurso no existe');
  } else if (error.status === 500) {
    // Error del servidor
    console.error('Error del servidor');
  } else {
    // Otro error
    console.error('Error:', error.message);
  }
}
```

---

## Utilidades Auxiliares

### pageContent()

Extrae el contenido de diferentes formatos de respuesta:

```javascript
export function pageContent(payload, fallback = []) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  return fallback;
}

// Uso
const stories = pageContent(response);  // Saca array del contenedor
```

### toQuery()

Convierte parámetros en query string:

```javascript
function toQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '')
      query.append(key, value);
  });
  const text = query.toString();
  return text ? `?${text}` : '';
}

// Resultado
toQuery({ page: 1, size: 12 })  // "?page=1&size=12"
```

---

## Ejemplo Completo de Uso

```jsx
import { useState, useEffect } from 'react';
import { api, pageContent } from '../api/client';

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(null);

    api.stories.list({
      page,
      size: 12,
      sort: 'createdAt,desc'
    })
      .then(response => {
        if (mounted) {
          setStories(pageContent(response));
        }
      })
      .catch(err => {
        if (mounted) {
          console.error('Error:', err.message);
          setError(err);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [page]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (stories.length === 0) return <div>Sin historias</div>;

  return (
    <div>
      {stories.map(story => (
        <div key={story.id}>{story.title}</div>
      ))}
      <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>
        Anterior
      </button>
      <button onClick={() => setPage(p => p + 1)}>Siguiente</button>
    </div>
  );
}
```

---

**Última actualización**: Enero 2024
