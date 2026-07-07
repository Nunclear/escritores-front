# Servicios de Consumo de API

## Cliente API Base

**Ubicación**: `src/api/client.js`

### Configuración Base

```js
const API_ROOT = `${import.meta.env.VITE_API_URL}/api`
// Ejemplo: http://localhost:8080/api
```

### Función `request()`

Función core que maneja todas las solicitudes HTTP:

```js
async function request(path, options = {}) {
  const { 
    method = 'GET', 
    body, 
    params, 
    headers = {}, 
    auth = true, 
    isFormData = false 
  } = options;
  
  // Lógica de solicitud...
}
```

**Parámetros**:
- `path` (string) - Ruta del endpoint (ej: `/stories`)
- `method` (string) - HTTP method (GET, POST, PUT, DELETE)
- `body` (object) - Datos a enviar
- `params` (object) - Parámetros de query
- `auth` (boolean) - Incluir token Bearer
- `isFormData` (boolean) - Enviar como FormData

**Retorna**: Promise<response>

---

## Estructura de Servicios

### auth

Servicios de autenticación.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `register(data)` | POST `/auth/register` | Registrar nuevo usuario |
| `login(data)` | POST `/auth/login` | Iniciar sesión |
| `refresh(refreshToken)` | POST `/auth/refresh` | Renovar access token |
| `logout(refreshToken)` | POST `/auth/logout` | Cerrar sesión |
| `me()` | GET `/auth/me` | Obtener usuario actual |
| `forgotPassword(email)` | POST `/auth/forgot-password` | Solicitar reset de password |
| `resetPassword(data)` | POST `/auth/reset-password` | Reset de password con token |
| `verifyEmail(token)` | POST `/auth/verify-email` | Verificar email |
| `invalidateAllSessions()` | POST `/auth/invalidate-all-sessions` | Cerrar todas las sesiones |

**Ejemplo**:
```js
const result = await api.auth.login({
  email: 'user@example.com',
  password: 'password123'
});
// Retorna: { accessToken, refreshToken, user }
```

---

### users

Servicios de usuarios.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `get(id)` | GET `/users/{id}` | Obtener usuario por ID |
| `list(params)` | GET `/users` | Listar usuarios |
| `publicProfile(id)` | GET `/users/{id}/public-profile` | Perfil público |
| `authorStories(id, params)` | GET `/users/{id}/stories` | Historias del autor |
| `me()` | GET `/users/me` | Usuario actual (detallado) |
| `updateMe(data)` | PUT `/users/me` | Actualizar perfil |
| `updateAvatar(url)` | PATCH `/users/me/avatar` | Cambiar avatar |
| `changePassword(data)` | POST `/users/me/change-password` | Cambiar contraseña |
| `changeEmail(data)` | POST `/users/me/change-email` | Cambiar email |
| `deactivateMe()` | POST `/users/me/deactivate` | Desactivar cuenta |
| `search(params)` | GET `/users/search` | Buscar usuarios |
| `publicSearch(params)` | GET `/users/search` | Búsqueda pública |

**Ejemplo**:
```js
const profile = await api.users.me();
// Retorna: { id, email, username, avatar, bio, ... }

const updated = await api.users.updateMe({
  username: 'newname',
  bio: 'Nueva biografía'
});
```

---

### stories

Servicios de historias.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `list(params)` | GET `/stories` | Listar historias |
| `search(params)` | GET `/stories/search` | Buscar historias |
| `get(id)` | GET `/stories/{id}` | Obtener historia |
| `getBySlug(slug)` | GET `/stories/slug/{slug}` | Por slug |
| `mineDrafts(params)` | GET `/stories/me/drafts` | Mis borradores |
| `mineArchived(params)` | GET `/stories/me/archived` | Mis archivadas |
| `byUser(userId, params)` | GET `/stories/user/{userId}` | Del usuario |
| `create(data)` | POST `/stories` | Crear historia |
| `update(id, data)` | PUT `/stories/{id}` | Actualizar |
| `publish(id)` | POST `/stories/{id}/publish` | Publicar |
| `unpublish(id)` | POST `/stories/{id}/unpublish` | Desunpublicar |
| `archive(id)` | POST `/stories/{id}/archive` | Archivar |
| `restore(id)` | POST `/stories/{id}/restore` | Restaurar |
| `duplicate(id, title)` | POST `/stories/{id}/duplicate` | Duplicar |
| `remove(id)` | DELETE `/stories/{id}` | Eliminar |

**Ejemplo**:
```js
// Crear historia
const story = await api.stories.create({
  title: 'Mi Primera Historia',
  description: 'Descripción...',
  cover: 'url-de-portada'
});

// Buscar
const results = await api.stories.search({
  q: 'magia',
  genre: 'fantasy',
  page: 0,
  size: 20
});
```

---

### chapters

Servicios de capítulos.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `published(storyId)` | GET `/chapters/story/{storyId}/published` | Capítulos publicados |
| `byStory(storyId, includeDrafts)` | GET `/chapters/story/{storyId}` | Del story |
| `get(id)` | GET `/chapters/{id}` | Obtener capítulo |
| `search(params)` | GET `/chapters/search` | Buscar capítulos |
| `drafts(params)` | GET `/chapters/me/drafts` | Mis borradores |
| `create(data)` | POST `/chapters` | Crear capítulo |
| `update(id, data)` | PUT `/chapters/{id}` | Actualizar |
| `publish(id)` | POST `/chapters/{id}/publish` | Publicar |
| `unpublish(id)` | POST `/chapters/{id}/unpublish` | Desunpublicar |
| `archive(id)` | POST `/chapters/{id}/archive` | Archivar |
| `reorder(storyId, items)` | POST `/chapters/reorder` | Reordenar |
| `move(id, data)` | POST `/chapters/{id}/move` | Mover a otro story |
| `remove(id)` | DELETE `/chapters/{id}` | Eliminar |

**Ejemplo**:
```js
const chapter = await api.chapters.create({
  storyId: 42,
  title: 'Capítulo 1',
  content: 'Contenido del capítulo...',
  order: 1
});

// Publicar
await api.chapters.publish(chapter.id);
```

---

### comments

Servicios de comentarios.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `create(data)` | POST `/comments` | Crear comentario |
| `get(id)` | GET `/comments/{id}` | Obtener comentario |
| `byStory(storyId, params)` | GET `/comments/story/{storyId}` | De la historia |
| `byChapter(chapterId, params)` | GET `/comments/chapter/{chapterId}` | Del capítulo |
| `replies(id)` | GET `/comments/{id}/replies` | Respuestas |
| `update(id, data)` | PUT `/comments/{id}` | Actualizar |
| `remove(id)` | DELETE `/comments/{id}` | Eliminar |

**Ejemplo**:
```js
// Crear comentario
const comment = await api.comments.create({
  content: 'Excelente capítulo!',
  chapterId: 10,
  parentId: null  // null = comentario raíz
});

// Responder
const reply = await api.comments.create({
  content: 'Gracias!',
  chapterId: 10,
  parentId: comment.id
});

// Obtener todas las respuestas
const replies = await api.comments.replies(comment.id);
```

---

### ratings

Servicios de calificaciones.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `createOrUpdate(data)` | POST `/ratings` | Crear o actualizar |
| `get(id)` | GET `/ratings/{id}` | Obtener rating |
| `byStory(storyId, params)` | GET `/ratings/story/{storyId}` | De la historia |
| `average(storyId)` | GET `/ratings/story/{storyId}/average` | Promedio |
| `mineForStory(storyId)` | GET `/ratings/story/{storyId}/me` | Mi rating |
| `remove(id)` | DELETE `/ratings/{id}` | Eliminar |

**Ejemplo**:
```js
// Calificar
const rating = await api.ratings.createOrUpdate({
  storyId: 42,
  score: 5,
  review: 'Obra maestra'
});

// Obtener promedio
const avg = await api.ratings.average(42);
// Retorna: { average: 4.5, count: 20 }
```

---

### favorites

Servicios de favoritos.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `add(storyId)` | POST `/favorites` | Agregar favorito |
| `remove(storyId)` | DELETE `/favorites/{storyId}` | Remover |
| `mine(params)` | GET `/favorites/me` | Mis favoritos |
| `isFavorite(storyId)` | GET `/favorites/story/{storyId}/me` | Es favorito? |
| `count(storyId)` | GET `/favorites/story/{storyId}/count` | Cantidad |

**Ejemplo**:
```js
// Agregar a favoritos
await api.favorites.add(42);

// Remover de favoritos
await api.favorites.remove(42);

// Obtener mis favoritos
const favorites = await api.favorites.mine({ page: 0, size: 20 });
```

---

### follows

Servicios de seguimientos.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `follow(userId)` | POST `/follows` | Seguir usuario |
| `unfollow(userId)` | DELETE `/follows/{userId}` | Dejar de seguir |
| `following(params)` | GET `/follows/me/following` | A quién sigo |
| `followers(userId, params)` | GET `/follows/user/{userId}/followers` | Seguidores |
| `isFollowing(userId)` | GET `/follows/user/{userId}/me` | ¿Lo sigo? |
| `count(userId)` | GET `/follows/user/{userId}/count` | Cantidad seguidores |

**Ejemplo**:
```js
// Seguir autor
await api.follows.follow(123);

// Verificar si lo sigo
const amFollowing = await api.follows.isFollowing(123);

// Obtener seguidores
const followers = await api.follows.followers(123, { page: 0, size: 50 });
```

---

### metrics

Servicios de métricas.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `story(storyId)` | GET `/metrics/story/{storyId}` | Métricas story |
| `chapter(chapterId)` | GET `/metrics/chapter/{chapterId}` | Métricas capítulo |
| `author(userId)` | GET `/metrics/author/{userId}` | Métricas autor |
| `topViewed(params)` | GET `/metrics/stories/top-viewed` | Top por vistas |
| `registerStoryView(storyId)` | POST `/metrics/views/story` | Registrar vista |
| `registerChapterView(storyId, chapterId)` | POST `/metrics/views/chapter` | Registrar vista |

**Ejemplo**:
```js
// Registrar que el usuario abrió una historia
await api.metrics.registerStoryView(42);

// Obtener top 10 historias
const top = await api.metrics.topViewed({ size: 10 });

// Métricas de una historia
const metrics = await api.metrics.story(42);
// Retorna: { views, likes, comments, rating, ... }
```

---

### Servicios Adicionales

#### characters (Personajes)
```js
api.characters.create(data)
api.characters.get(id)
api.characters.byStory(storyId, params)
api.characters.update(id, data)
api.characters.remove(id)
```

#### arcs (Arcos)
```js
api.arcs.create(data)
api.arcs.byStory(storyId)
api.arcs.update(id, data)
api.arcs.reorder(storyId, items)
api.arcs.remove(id)
```

#### volumes (Volúmenes)
```js
api.volumes.create(data)
api.volumes.byStory(storyId)
api.volumes.update(id, data)
api.volumes.reorder(storyId, items)
api.volumes.move(id, data)
```

#### reports (Reportes)
```js
api.reports.story(data)
api.reports.chapter(data)
api.reports.comment(data)
api.reports.user(data)
api.reports.pending(params)
api.reports.list(params)
api.reports.resolve(id, text)
api.reports.reject(id, text)
```

#### admin (Administración)
```js
api.adminUsers.setAccessLevel(id, level)
api.adminUsers.setAccountState(id, state)
api.adminDashboard.summary()
api.adminDashboard.activity(params)
```

---

## Manejo de Errores

### ApiError

```js
class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;     // HTTP status (401, 404, 500)
    this.payload = payload;   // Response body
  }
}
```

**Uso**:
```js
try {
  await api.stories.get(999);
} catch (err) {
  if (err.status === 404) {
    console.log('Historia no encontrada');
  } else if (err.status === 401) {
    console.log('No autenticado');
  }
}
```

---

## Patrones Comunes

### Con Componentes React

```jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  api.stories.list()
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
```

### Con Formularios

```jsx
async function handleSubmit(formData) {
  try {
    const story = await api.stories.create(formData);
    showSuccess('Historia creada');
    navigate(`/historia/${story.id}`);
  } catch (err) {
    showError(err.message);
  }
}
```

### Solicitudes en Paralelo

```js
const [stories, users, metrics] = await Promise.all([
  api.stories.list(),
  api.users.list(),
  api.metrics.topViewed()
]);
```
