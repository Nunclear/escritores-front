# Próximos Pasos - Desarrollo de Plataforma Escritores

## Fase Actual: ✅ 70% Completado

Fundación sólida completada:
- ✅ Design System Editorial
- ✅ 20+ Componentes Reutilizables
- ✅ 12 Servicios API + Cliente Axios
- ✅ AuthContext + ProtectedRoute
- ✅ 38 Rutas definidas
- ✅ 5 Páginas funcionales
- ✅ Servidor compilando sin errores

---

## Próximas Prioridades (Orden Recomendado)

### 1️⃣ PÁGINAS DE LECTURA (Impacto Alto - Funcionalidad Crítica)

**Archivos a crear:**
- `src/pages/StoryDetailPage.jsx` - Detalle de historia
- `src/pages/ChapterReaderPage.jsx` - Lector de capítulo
- `src/components/StoryHero.jsx` - Componente hero para historias
- `src/components/ChapterList.jsx` - Lista de capítulos

**Componentes necesarios:**
- StoryHero (portada grande, título, autor, descripción, acciones)
- ChapterList (lista ordenable, con estados)
- CommentSection (comentarios paginados)
- RatingWidget (calificación interactiva)
- MediaGallery (galería de multimedia)

**Endpoints a consumir:**
```javascript
// StoryDetailPage
- GET /stories/{id}
- GET /stories/slug/{slug}
- GET /chapters/story/{storyId}/published
- GET /ratings/story/{storyId}/average
- GET /favorites/story/{storyId}/me
- POST /favorites
- DELETE /favorites/{storyId}
- POST /ratings

// ChapterReaderPage
- GET /chapters/{id}
- GET /chapters/story/{storyId}/published
- POST /metrics/views/chapter
- GET /comments/chapter/{chapterId}
- POST /comments
```

**Componentes de soporte a reutilizar:**
- EditorialButton
- StatusBadge
- PaginationControls
- LoadingState / ErrorState / EmptyState
- PublicNavbar

**Checklist:**
- [ ] Crear StoryHero component
- [ ] Crear ChapterList component
- [ ] Crear CommentSection component
- [ ] Crear RatingWidget component
- [ ] Implementar StoryDetailPage
- [ ] Implementar ChapterReaderPage
- [ ] Agregar rutas en AppRoutes.jsx
- [ ] Probar con datos reales de API
- [ ] Responsive en móvil/tablet/desktop
- [ ] Documentar en EXAMPLES.md

---

### 2️⃣ EDITOR DE HISTORIA (Impacto Alto - Core Feature)

**Archivos a crear:**
- `src/pages/StoryEditorPage.jsx` - Editor principal de historia
- `src/components/StoryEditorForm.jsx` - Formulario de historia
- `src/components/CoverImageUploader.jsx` - Uploader de portada

**Características:**
- Formulario con campos: título, descripción, portada, visibilidad, categoría
- Preview de portada
- Draft autosave
- Botones: Guardar Borrador, Publicar, Archivar
- Indicador de cambios sin guardar
- Feedback visual de estado

**Endpoints:**
```javascript
- POST /stories (create)
- GET /stories/{id} (read)
- PUT /stories/{id} (update)
- POST /stories/{id}/publish
- POST /stories/{id}/unpublish
- POST /stories/{id}/archive
- POST /media/upload (para portada)
```

**Checklist:**
- [ ] Crear StoryEditorForm component
- [ ] Implementar CoverImageUploader
- [ ] Crear StoryEditorPage
- [ ] Validación de formularios
- [ ] Auto-save en localStorage
- [ ] Manejo de errores
- [ ] Agregar ruta a AppRoutes
- [ ] Tests de formulario
- [ ] Documentación

---

### 3️⃣ GESTOR DE CAPÍTULOS (Impacto Alto - Core Feature)

**Archivos a crear:**
- `src/pages/ChaptersManagerPage.jsx` - Gestor de capítulos
- `src/pages/ChapterEditorPage.jsx` - Editor de capítulo
- `src/components/ChapterForm.jsx` - Formulario de capítulo
- `src/components/ChapterDragDrop.jsx` - Reordenamient Drag & Drop

**Características:**
- Lista de capítulos con drag & drop para reordenar
- Editar, publicar, despublicar, archivar capítulos
- Editor de texto para contenido
- Contador de palabras y tiempo de lectura
- Adjuntar media (imágenes, etc)
- Versiones y historial

**Endpoints:**
```javascript
- POST /chapters (create)
- GET /chapters/story/{storyId}
- PUT /chapters/{id} (update)
- POST /chapters/{id}/publish
- POST /chapters/{id}/unpublish
- POST /chapters/{id}/archive
- POST /chapters/reorder
- POST /chapters/{id}/move
- DELETE /chapters/{id}
- POST /media/upload
- GET /media/chapter/{chapterId}
```

**Checklist:**
- [ ] Crear ChapterForm component
- [ ] Implementar drag & drop (React Beautiful DND o similar)
- [ ] Crear ChaptersManagerPage
- [ ] Crear ChapterEditorPage
- [ ] Contador de palabras
- [ ] Adjuntos de media
- [ ] Validación
- [ ] Auto-save
- [ ] Rutas en AppRoutes
- [ ] Tests

---

### 4️⃣ WORLDBUILDING (Impacto Medio - Feature Diferenciador)

**Archivos a crear:**
- `src/pages/WorldbuildingPage.jsx` - Hub de worldbuilding
- `src/pages/CharactersPage.jsx` - Galería de personajes
- `src/pages/EventsPage.jsx` - Mapa de eventos
- `src/pages/SkillsPage.jsx` - Catálogo de habilidades
- `src/components/CharacterCard.jsx`
- `src/components/EventTimeline.jsx`
- `src/components/SkillMatrix.jsx`

**Características:**
- Galería de personajes con filtros
- Timeline de eventos
- Catálogo de habilidades
- Asignación de habilidades a personajes
- Búsqueda y filtrado
- Detalles expandibles

**Endpoints:**
```javascript
// Characters
- POST /characters
- GET /characters/{id}
- GET /characters/story/{storyId}
- PUT /characters/{id}
- DELETE /characters/{id}
- GET /characters/search

// Skills
- POST /skills
- GET /skills/{id}
- GET /skills/story/{storyId}
- PUT /skills/{id}
- DELETE /skills/{id}
- POST /character-skills

// Events
- POST /events
- GET /events/{id}
- GET /events/story/{storyId}
- PUT /events/{id}
- DELETE /events/{id}

// Arcs & Volumes
- POST /arcs / /volumes
- GET /arcs/story / /volumes/story
- POST /arcs/reorder / /volumes/reorder
```

**Checklist:**
- [ ] Crear CharacterCard component
- [ ] Crear CharacterForm component
- [ ] Implementar CharactersPage
- [ ] Crear EventTimeline component
- [ ] Implementar EventsPage
- [ ] Crear SkillMatrix component
- [ ] Implementar SkillsPage
- [ ] Filtros y búsqueda
- [ ] Modal detalle
- [ ] Rutas
- [ ] Tests

---

### 5️⃣ USUARIO: PERFIL Y CONFIGURACIÓN (Impacto Medio)

**Archivos a crear:**
- `src/pages/UserProfilePage.jsx` - Perfil de usuario
- `src/pages/SettingsPage.jsx` - Configuración personal
- `src/pages/UserPublicProfilePage.jsx` - Perfil público
- `src/components/ProfileForm.jsx`
- `src/components/AvatarUploader.jsx`

**Características:**
- Editar avatar, nombre, biografía
- Cambiar contraseña
- Cambiar email
- Privacidad y notificaciones
- Perfil público con historias
- Seguidores/seguidos

**Endpoints:**
```javascript
- GET /auth/me
- PUT /users/me
- GET /users/{id}/public-profile
- GET /users/{id}/stories
- GET /follows/user/{userId}
- POST /follows
- DELETE /follows/{userId}
```

**Checklist:**
- [ ] Crear ProfileForm component
- [ ] Crear AvatarUploader component
- [ ] Implementar UserProfilePage
- [ ] Implementar SettingsPage
- [ ] Implementar UserPublicProfilePage
- [ ] Validaciones
- [ ] Auto-save
- [ ] Rutas
- [ ] Tests

---

### 6️⃣ FAVORITOS Y SEGUIMIENTO (Impacto Bajo - Buena UX)

**Archivos a crear:**
- `src/pages/FavoritesPage.jsx`
- `src/pages/FollowingPage.jsx`
- `src/components/FavoriteButton.jsx`
- `src/components/FollowButton.jsx`

**Características:**
- Lista de historias favoritas
- Lista de autores seguidos
- Botones de favorito/seguimiento reutilizables
- Filtros y ordenamiento
- Paginación

**Endpoints:**
```javascript
- GET /favorites/me
- POST /favorites
- DELETE /favorites/{storyId}
- GET /follows/me/following
- POST /follows
- DELETE /follows/{userId}
```

**Checklist:**
- [ ] Crear FavoriteButton component
- [ ] Crear FollowButton component
- [ ] Implementar FavoritesPage
- [ ] Implementar FollowingPage
- [ ] Paginación
- [ ] Rutas
- [ ] Tests

---

### 7️⃣ PÁGINAS DE MODERACIÓN (Impacto Medio - Admin Only)

**Archivos a crear:**
- `src/pages/ModerationPage.jsx` - Dashboard
- `src/pages/ReportsPage.jsx` - Gestión de reportes
- `src/pages/SanctionsPage.jsx` - Gestión de sanciones
- `src/components/ReportsList.jsx`
- `src/components/SanctionForm.jsx`

**Características:**
- Dashboard con estadísticas
- Lista de reportes pendientes
- Detalles del reporte
- Acciones: revisar, resolver
- Aplicar sanciones a usuarios
- Historial de sanciones

**Endpoints:**
```javascript
- GET /reports
- GET /reports/{id}
- PUT /reports/{id}
- GET /sanctions
- POST /sanctions
- PUT /sanctions/{id}
- DELETE /sanctions/{id}
- GET /comments/hidden
- POST /comments/{id}/hide
```

**Checklist:**
- [ ] Crear ReportsList component
- [ ] Crear SanctionForm component
- [ ] Implementar ModerationPage
- [ ] Implementar ReportsPage
- [ ] Implementar SanctionsPage
- [ ] Filtros de estado
- [ ] Rutas protegidas
- [ ] Tests

---

### 8️⃣ PÁGINAS ADMIN (Impacto Medio - Admin Only)

**Archivos a crear:**
- `src/pages/AdminPage.jsx` - Dashboard admin
- `src/pages/UsersManagementPage.jsx` - Gestión de usuarios
- `src/pages/GlobalNoticesPage.jsx` - Comunicados globales
- `src/components/UsersList.jsx`
- `src/components/NoticeForm.jsx`

**Características:**
- Dashboard con estadísticas globales
- Búsqueda y filtrado de usuarios
- Suspender/banear usuarios
- Crear comunicados globales
- Historial de cambios

**Endpoints:**
```javascript
- GET /admin/users
- POST /admin/users/{id}/suspend
- POST /admin/users/{id}/ban
- GET /global-notices
- POST /global-notices
- PUT /global-notices/{id}
- DELETE /global-notices/{id}
```

**Checklist:**
- [ ] Crear UsersList component
- [ ] Crear NoticeForm component
- [ ] Implementar AdminPage
- [ ] Implementar UsersManagementPage
- [ ] Implementar GlobalNoticesPage
- [ ] Rutas protegidas ADMIN
- [ ] Tests

---

## Tareas Transversales

### Testing 🧪
```
- [ ] Instalar Jest + React Testing Library
- [ ] Tests unitarios para componentes
- [ ] Tests de integración para servicios
- [ ] Tests de rutas protegidas
- [ ] Cobertura mínima 80%
```

### Performance ⚡
```
- [ ] Code splitting por ruta
- [ ] Lazy loading de componentes
- [ ] Optimizar imágenes
- [ ] Caché de API
- [ ] Bundle size analysis
```

### SEO 🔍
```
- [ ] Meta tags dinámicos
- [ ] Open Graph para compartir
- [ ] Sitemap
- [ ] Robots.txt
```

### Seguridad 🔒
```
- [ ] CSRF protection
- [ ] XSS prevention
- [ ] Content Security Policy
- [ ] Rate limiting (backend)
- [ ] Validación en backend
```

### Documentación 📚
```
- [ ] README.md actualizado
- [ ] API documentation (Swagger?)
- [ ] Component storybook
- [ ] Deployment guide
```

---

## Timeline Estimado

```
Semana 1: Páginas de Lectura + Editor de Historia
Semana 2: Gestor de Capítulos + Worldbuilding
Semana 3: Perfil, Favoritos, Seguimiento
Semana 4: Moderación + Admin + Testing
Semana 5: Performance, SEO, Refinamiento
```

---

## Comandos Útiles para Desarrollo

```bash
# Ver archivos creados
find src -type f -name "*.jsx" | wc -l

# Ver líneas de código
find src -type f -name "*.js*" -exec wc -l {} + | tail -1

# Listar rutas
grep "path=" src/routes/AppRoutes.jsx | wc -l

# Listar componentes
ls src/components/*.jsx | wc -l

# Ver servicios
ls src/services/*.js | wc -l
```

---

## Recursos de Referencia

1. **Especificaciones**:
   - doc_api.txt - Endpoints disponibles
   - 01_prompt_ux_ui_general.md - Diseño UX/UI
   - 02_prompt_componentes_react.md - Especificaciones de componentes

2. **Documentación Creada**:
   - SETUP.md - Instalación y configuración
   - ARCHITECTURE.md - Arquitectura del proyecto
   - IMPLEMENTATION_SUMMARY.md - Resumen ejecutivo
   - EXAMPLES.md - Ejemplos de código

3. **Librerías Recomendadas**:
   - React Beautiful DND - Drag and drop
   - React Markdown - Para contenido narrativo
   - DateFNS - Manipulación de fechas
   - Zod - Validación de esquemas
   - SWR - Data fetching con cache

---

## Checklist Final Antes de Deployment

```
General:
- [ ] Código SIN console.log() de debug
- [ ] Todos los imports están presentes
- [ ] Sin archivos comentados innecesarios
- [ ] Código formateado (ESLint)

Funcionalidad:
- [ ] Todas las rutas redireccionan correctamente
- [ ] Protección de rutas funcionando
- [ ] Autenticación completa
- [ ] Logout funcionando
- [ ] Token refresh automático

UI/UX:
- [ ] Responsive en móvil (< 480px)
- [ ] Responsive en tablet (480px - 1024px)
- [ ] Responsive en desktop (> 1024px)
- [ ] Colores siguen paleta editorial
- [ ] Tipografía correcta (Lora + DM Sans)
- [ ] Loading states en todas partes
- [ ] Error states con opción de reintento
- [ ] Empty states claros

API:
- [ ] Manejo de errores consistente
- [ ] Timeouts configurados
- [ ] Rate limiting respetado
- [ ] Autenticación Header Bearer

Documentación:
- [ ] README.md completo
- [ ] SETUP.md actualizado
- [ ] EXAMPLES.md con casos de uso
- [ ] Comentarios en código complejo
```

---

**¡El proyecto está listo para continuar!**

Siguiendo estos pasos en orden, la plataforma estará 100% funcional en 4-5 semanas.

*Última actualización: 28 de mayo de 2026*
