# Guía de Instalación y Configuración - Plataforma Escritores

## Requisitos Previos

- Node.js 16+ y npm/pnpm
- Backend API ejecutándose en `http://localhost:8080/api`
- Git (para control de versiones)

## Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:5173
```

## Configuración del Entorno

No se requieren variables de entorno adicionales en este momento. El API está configurado en `src/services/api.js` para usar:

```
Base URL: http://localhost:8080/api
Authorization: Bearer {accessToken}
```

## Estructura de Carpetas

```
src/
├── components/          # Componentes React reutilizables
│   ├── EditorialButton.jsx
│   ├── StoryCard.jsx
│   ├── AppShell.jsx
│   ├── ProtectedRoute.jsx
│   └── index.js        # Exporta todos los componentes
├── pages/              # Páginas de la aplicación
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx
│   ├── ExplorePage.jsx
│   └── index.js
├── services/           # Servicios de API
│   ├── api.js         # Cliente Axios configurado
│   ├── authService.js
│   ├── storiesService.js
│   ├── chaptersService.js
│   ├── worldbuildingService.js
│   ├── moderationService.js
│   ├── adminService.js
│   └── index.js       # Exporta todos los servicios
├── context/           # Context API para estado global
│   └── AuthContext.jsx
├── hooks/             # Custom React hooks
│   └── useFetch.js
├── utils/             # Funciones auxiliares
│   ├── helpers.js     # Utilidades generales
│   └── constants.js   # Constantes de la app
├── routes/            # Configuración de rutas
│   └── AppRoutes.jsx  # Todas las rutas de la app
├── styles/            # Archivos CSS
└── App.jsx            # Componente raíz

tailwind.config.js      # Configuración de Tailwind y colores editorial
```

## Paleta de Colores Editorial

La aplicación utiliza una paleta de colores cálida, minimalista y editorial:

- **Fondo principal**: #f5f0e8 (beige claro)
- **Superficie principal**: #fffefb (blanco cálido)
- **Superficie secundaria**: #faf6ef (beige muy claro)
- **Texto principal**: #1e1a16 (marrón oscuro)
- **Texto secundario**: #7a7168 (marrón grisáceo)
- **Café editorial**: #8b5e3c (acento principal)
- **Arena dorada**: #c49a6c (acento secundario)
- **Verde éxito**: #3a6b4a
- **Rojo vino**: #8b3a3a (errores/moderación)
- **Azul grisáceo**: #3a5a8b (información)
- **Dorado oliva**: #8b7a3a (premium)

## Tipografía

- **Títulos**: Lora (serif) - elegante y literaria
- **Cuerpo**: DM Sans (sans-serif) - clara y legible

## Componentes Principales

### EditorialButton
Botón versátil con variantes:
- `primary`: Fondo café, texto blanco
- `secondary`: Fondo claro, borde dorado
- `ghost`: Transparente
- `danger`: Rojo vino
- `success`: Verde
- `premium`: Gradiente

### StoryCard
Tarjeta para mostrar historias con:
- Imagen de portada (o gradiente por defecto)
- Título y descripción
- Autor
- Badges de estado
- Métricas (rating, favoritos, capítulos)
- Variantes: default, horizontal, featured, dashboard

### AppShell
Layout principal para páginas autenticadas con:
- Sidebar de navegación (desktop)
- Top bar con búsqueda y menú de usuario
- Area de contenido central
- Footer

### ProtectedRoute
HOC para proteger rutas según autenticación y roles

## Servicios API

Todos los servicios están en `src/services/` y usan el cliente API configurable:

- `authService`: Registro, login, logout, refresh token
- `storiesService`: CRUD de historias
- `chaptersService`: CRUD de capítulos
- `ratingsService`: Calificaciones
- `commentsService`: Comentarios
- `favoritesService`: Favoritos
- `followsService`: Seguimiento de autores
- `usersService`: Perfiles de usuarios
- `metricsService`: Estadísticas y dashboard
- `worldbuildingService`: Personajes, habilidades, eventos, arcos, volúmenes
- `moderationService`: Reportes, sanciones, comentarios ocultos
- `adminService`: Comunicados globales, gestión del sistema

## Rutas Públicas

- `/` - Home
- `/login` - Iniciar sesión
- `/register` - Registrarse
- `/explore` - Explorar historias
- `/story/:id` - Detalle de historia (placeholder)
- `/author/:id` - Perfil de autor (placeholder)

## Rutas Protegidas - USER

- `/dashboard` - Panel principal
- `/stories` - Mis historias
- `/stories/new` - Nueva historia
- `/stories/:id/edit` - Editar historia
- `/stories/:storyId/chapters` - Gestor de capítulos
- `/profile` - Mi perfil
- `/settings` - Configuración
- `/favorites` - Mis favoritos
- `/following` - Autores seguidos
- `/metrics` - Mis métricas
- `/worldbuilding/*` - Worldbuilding (personajes, eventos, habilidades)

## Rutas Protegidas - MODERATOR & ADMIN

- `/moderation` - Dashboard de moderación
- `/moderation/reports` - Reportes
- `/moderation/sanctions` - Sanciones
- `/moderation/hidden-comments` - Comentarios ocultos
- `/admin` - Dashboard admin
- `/admin/users` - Gestión de usuarios
- `/admin/notices` - Comunicados globales
- `/admin/activity` - Actividad del sistema

## Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build
npm run preview

# Linting (si está configurado)
npm run lint
```

## Autenticación

La autenticación funciona con:
1. **AuthContext**: Maneja estado de usuario y métodos de auth
2. **authService**: Llamadas a API de auth
3. **API Client**: Interceptores que agregan tokens automáticamente
4. **ProtectedRoute**: HOC para rutas privadas
5. **LocalStorage**: Almacena accessToken y refreshToken

El token se refresca automáticamente cuando expira (interceptor de 401).

## Estados de Carga

La aplicación maneja 4 estados principales:
- **Loading**: LoadingState, LoadingSkeleton, LoadingCard
- **Error**: ErrorState, ErrorAlert
- **Empty**: EmptyState, EmptyListMessage
- **Success**: Componentes de contenido normal

## Próximos Pasos para Completar

1. **Páginas de Lectura**:
   - DetailStoryPage (detalle de historia)
   - ChapterReaderPage (lector de capítulos)

2. **Páginas de Edición**:
   - StoryEditorPage (editor de historia)
   - ChapterEditorPage (editor de capítulos)

3. **Worldbuilding**:
   - CharacterPage (gestión de personajes)
   - EventsPage (gestión de eventos)
   - SkillsPage (gestión de habilidades)

4. **Perfiles y Configuración**:
   - UserProfilePage (perfil público)
   - SettingsPage (configuración personal)
   - FavoritesPage (favoritos)

5. **Moderación**:
   - ModerationPage (dashboard moderación)
   - ReportsPage (gestión de reportes)

6. **Admin**:
   - AdminPage (dashboard admin)
   - UsersManagementPage (gestión de usuarios)
   - GlobalNoticesPage (comunicados)

7. **Tests**:
   - Tests unitarios de componentes
   - Tests de integración de rutas
   - Tests de servicios API

## Troubleshooting

### El servidor no inicia
```bash
# Limpia node_modules e instala de nuevo
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Errores de compilación
Revisa que todos los imports estén correctos y que los servicios sean accesibles en `src/services/`.

### El API no responde
Asegúrate de que el backend está corriendo en `http://localhost:8080/api` y que el CORS está configurado correctamente.

### Errores de autenticación
Verifica que los tokens se están guardando en localStorage y que el API devuelve los tokens correctamente en login.

## Recursos Útiles

- [Documentación de API](doc_api.txt)
- [Especificaciones UX/UI](01_prompt_ux_ui_general.md)
- [Especificaciones de Componentes](02_prompt_componentes_react.md)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)

## Notas de Desarrollo

- Todos los componentes usan la paleta de colores editorial mediante clases Tailwind
- Los tokens están definidos en `tailwind.config.js`
- Los estilos globales están en `src/index.css`
- Se usa Context API para autenticación, no Redux
- Los servicios son desacoplados y pueden ser remplazados fácilmente
- La validación ocurre tanto en frontend como en backend (nunca confiar solo en frontend)

## Próximas Fases

Este desarrollo cubre:
- ✅ Fase 1: Design System y Tailwind Config
- ✅ Fase 2: Componentes base y UI
- ✅ Fase 3: Servicios API
- ✅ Fase 4: Páginas públicas básicas
- ⏳ Fase 5: Páginas privadas (USER)
- ⏳ Fase 6: Worldbuilding y editores
- ⏳ Fase 7: Moderación y Admin
- ⏳ Fase 8: Rutas protegidas (completo)
- ⏳ Fase 9: Testing y refinamiento

El proyecto está listo para continuar agregando las páginas faltantes manteniendo los patrones establecidos.
