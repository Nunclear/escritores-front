# Raíz de Palabras

Plataforma profesional para escritores y lectores hecha con React + Vite. Incluye feed público, ranking de más vistas, filtros, portada de historia, sala de lectura, autenticación, estudio del escritor, modo oscuro y cliente API configurable.

## Configuración

`.env.production`:

```env
VITE_API_URL=http://localhost:8080
```

El cliente usa automáticamente:

```txt
http://localhost:8080/api
```

## Ejecutar

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Funcionalidad pública solicitada

### Página de inicio

- Feed público sin login.
- Historias recientes por `/stories`.
- Búsqueda por título/descripción por `/stories/search?q=...`.
- Filtros por género y estado de publicación.
- Ranking de más vistas por `/metrics/stories/top-viewed`.
- Cards con portada, título, autor, descripción, vistas, favoritos y rating.
- Click en card hacia `/historia/:storyId`.

### Portada de historia

- Portada grande, título, descripción y autor enlazado.
- Promedio de calificaciones por `/ratings/story/{storyId}/average`.
- Total de favoritos por `/favorites/story/{storyId}/count`.
- Visitas públicas tomadas del ranking y registro de visita por `/metrics/views/story`.
- Lista de capítulos publicados por `/chapters/story/{storyId}/published`.
- Agrupación por arcos y volúmenes usando `/arcs/story/{storyId}` y `/volumes/story/{storyId}`.
- Botón para empezar desde el primer capítulo o saltar a cualquier capítulo.

## Rutas

- `/` Inicio público.
- `/historia/:storyId` Portada de historia.
- `/leer/:storyId/capitulo/:chapterId` Lector de capítulo.
- `/autor/:authorId` Perfil público preparado.
- `/acceso` Login/registro.
- `/escritor` Estudio de escritura.
- `/dashboard` Panel privado.

## Actualización de lectura y perfil público

Nuevas pantallas incluidas:

- `/leer/:storyId/capitulo/:chapterId`: lectura limpia de capítulo con título, subtítulo, cuerpo, navegación anterior/siguiente, comentarios por capítulo, respuestas en hilos y calificación de historia.
- `/autor/:authorId`: perfil público del autor con avatar, biografía, seguidores, historias publicadas, catálogo público y botón para seguir si el usuario está autenticado.

Endpoints usados en estas pantallas:

- `GET /chapters/{id}`
- `GET /chapters/story/{storyId}/published`
- `GET /comments/chapter/{chapterId}`
- `POST /comments`
- `POST /ratings`
- `GET /users/{id}/public-profile`
- `GET /users/{id}/stories`
- `POST /follows`
- `DELETE /follows/{followedUserId}`
- `GET /follows/user/{userId}/count`
- `GET /follows/user/{userId}/me`
