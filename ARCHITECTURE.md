# Arquitectura - Plataforma Escritores

## Flujo de Datos General

```
┌─────────────────────────────────────────────────────────────────────┐
│                          NAVEGADOR (Cliente)                        │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                     React App (Vite)                       │   │
│  │                     Puerto 5173                            │   │
│  │                                                            │   │
│  │  ┌──────────────┐      ┌─────────────────────────┐        │   │
│  │  │  AppRoutes   │      │    AuthContext          │        │   │
│  │  │  (38 rutas)  │──────│  (user, auth, tokens)   │        │   │
│  │  └──────┬───────┘      └─────────────────────────┘        │   │
│  │         │                                                  │   │
│  │    ┌────▼────────────────────────────────────┐            │   │
│  │    │          Componentes React              │            │   │
│  │    │  ┌──────────────────────────────────┐   │            │   │
│  │    │  │ Public:                          │   │            │   │
│  │    │  │ - HomePage                       │   │            │   │
│  │    │  │ - LoginPage / RegisterPage       │   │            │   │
│  │    │  │ - ExplorePage                    │   │            │   │
│  │    │  │ - PublicNavbar                   │   │            │   │
│  │    │  │                                  │   │            │   │
│  │    │  │ Private:                         │   │            │   │
│  │    │  │ - DashboardPage                  │   │            │   │
│  │    │  │ - AppShell / PrivateSidebar      │   │            │   │
│  │    │  │ - TopBar                         │   │            │   │
│  │    │  │ - ProtectedRoute                 │   │            │   │
│  │    │  │                                  │   │            │   │
│  │    │  │ Reutilizables:                   │   │            │   │
│  │    │  │ - EditorialButton                │   │            │   │
│  │    │  │ - StoryCard / StoryCardGrid      │   │            │   │
│  │    │  │ - StatusBadge                    │   │            │   │
│  │    │  │ - FormInputs                     │   │            │   │
│  │    │  │ - LoadingState / ErrorState      │   │            │   │
│  │    │  │ - PaginationControls             │   │            │   │
│  │    │  └──────────────┬───────────────────┘   │            │   │
│  │    └─────────────────┼──────────────────────┘            │   │
│  │                      │                                    │   │
│  │                  ┌───▼──────────────────────┐            │   │
│  │                  │    Servicios API         │            │   │
│  │                  │  ┌────────────────────┐  │            │   │
│  │                  │  │ - authService      │  │            │   │
│  │                  │  │ - storiesService   │  │            │   │
│  │                  │  │ - chaptersService  │  │            │   │
│  │                  │  │ - ratingsService   │  │            │   │
│  │                  │  │ - commentsService  │  │            │   │
│  │                  │  │ - favoritesService │  │            │   │
│  │                  │  │ - followsService   │  │            │   │
│  │                  │  │ - metricsService   │  │            │   │
│  │                  │  │ - worldbuilding... │  │            │   │
│  │                  │  │ - moderation...    │  │            │   │
│  │                  │  │ - admin...         │  │            │   │
│  │                  │  └────────────┬───────┘  │            │   │
│  │                  └───────────────┼──────────┘            │   │
│  │                                  │                       │   │
│  │                          ┌───────▼────────┐              │   │
│  │                          │  Cliente Axios │              │   │
│  │                          │  + Interceptores             │   │
│  │                          └───────┬────────┘              │   │
│  │                                  │                       │   │
│  └──────────────────────────────────┼───────────────────────┘   │
│                                      │                          │
└──────────────────────────────────────┼──────────────────────────┘
                                       │
                                       │ HTTP/REST
                                       │ Bearer Token
                                       │ JSON
                                       │
┌──────────────────────────────────────┼──────────────────────────┐
│                                      ▼                          │
│                   Backend API (Node.js / Spring)                │
│                   http://localhost:8080/api                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              REST Endpoints (100+)                      │   │
│  │  - /auth/* (register, login, refresh, logout)          │   │
│  │  - /stories/* (CRUD, publish, archive)                 │   │
│  │  - /chapters/* (CRUD, reorder, move)                   │   │
│  │  - /ratings/* (create, get, delete)                    │   │
│  │  - /comments/* (CRUD)                                  │   │
│  │  - /favorites/* (add, remove, count)                   │   │
│  │  - /follows/* (follow, unfollow)                       │   │
│  │  - /users/* (profile, search, update)                  │   │
│  │  - /metrics/* (views, stats)                           │   │
│  │  - /characters/* (CRUD)                                │   │
│  │  - /skills/* (CRUD, assign)                            │   │
│  │  - /events/* (CRUD)                                    │   │
│  │  - /arcs/* (CRUD, reorder)                             │   │
│  │  - /volumes/* (CRUD, move, reorder)                    │   │
│  │  - /reports/* (CRUD, status)                           │   │
│  │  - /sanctions/* (CRUD)                                 │   │
│  │  - /global-notices/* (CRUD)                            │   │
│  │  - /admin/* (users, activity, stats)                   │   │
│  │  - /moderation/* (hidden comments, etc)                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                    │
│                    ┌───────▼────────┐                           │
│                    │   Autenticación│                           │
│                    │  - JWT tokens  │                           │
│                    │  - Session mgmt│                           │
│                    └───────┬────────┘                           │
│                            │                                    │
│                    ┌───────▼────────┐                           │
│                    │    Database    │                           │
│                    │  - Users       │                           │
│                    │  - Stories     │                           │
│                    │  - Chapters    │                           │
│                    │  - Comments    │                           │
│                    │  - Ratings     │                           │
│                    │  - etc...      │                           │
│                    └────────────────┘                           │
└──────────────────────────────────────────────────────────────────┘
```

## Estructura de Carpetas

```
escritores-front/
│
├── src/
│   ├── components/                 # 20+ componentes reutilizables
│   │   ├── EditorialButton.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── LoadingState.jsx
│   │   ├── ErrorState.jsx
│   │   ├── EmptyState.jsx
│   │   ├── FormInputs.jsx
│   │   ├── PaginationControls.jsx
│   │   ├── StoryCard.jsx
│   │   ├── PublicNavbar.jsx
│   │   ├── PrivateSidebar.jsx
│   │   ├── TopBar.jsx
│   │   ├── AppShell.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── index.js
│   │
│   ├── pages/                      # Páginas/vistas
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ExplorePage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── index.js
│   │
│   ├── services/                   # Clientes API
│   │   ├── api.js                  # Cliente Axios con interceptores
│   │   ├── authService.js
│   │   ├── storiesService.js
│   │   ├── chaptersService.js
│   │   ├── ratingsService.js
│   │   ├── commentsService.js
│   │   ├── favoritesService.js
│   │   ├── followsService.js
│   │   ├── usersService.js
│   │   ├── metricsService.js
│   │   ├── worldbuildingService.js
│   │   ├── moderationService.js
│   │   ├── adminService.js
│   │   └── index.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx         # Estado global de autenticación
│   │
│   ├── hooks/
│   │   └── useFetch.js             # Custom hooks
│   │
│   ├── utils/
│   │   ├── helpers.js              # Funciones auxiliares
│   │   └── constants.js            # Constantes globales
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx           # 38 rutas de la aplicación
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                   # Estilos globales
│
├── tailwind.config.js              # Configuración Tailwind + colores
├── vite.config.js                  # Configuración Vite
├── package.json
├── SETUP.md                        # Documentación de instalación
├── IMPLEMENTATION_SUMMARY.md       # Resumen de implementación
├── ARCHITECTURE.md                 # Este archivo
└── EXAMPLES.md                     # Ejemplos de código
```

## Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO NO AUTENTICADO                   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   ┌─────────────┐          ┌──────────────┐
   │  LoginPage  │          │ RegisterPage │
   └──────┬──────┘          └──────┬───────┘
          │                        │
          └────────────┬───────────┘
                       │
                       │ POST /auth/login
                       │ o POST /auth/register
                       │
                       ▼
            ┌──────────────────────────┐
            │   Backend API Response   │
            │  {                       │
            │    accessToken: "jwt"    │
            │    refreshToken: "jwt"   │
            │    user: { ... }         │
            │  }                       │
            └──────────────┬───────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    ┌──────────────────┐     ┌────────────────────┐
    │  localStorage    │     │  AuthContext       │
    │  accessToken     │     │  - user            │
    │  refreshToken    │     │  - isAuthenticated │
    └──────────────────┘     │  - isCheckingSession
                             │  - authError
                             │  - login()
                             │  - logout()
                             └────────────────────┘
                                       │
                                       │
                    ┌──────────────────┴──────────────────┐
                    │                                     │
                    ▼                                     ▼
         ┌──────────────────────┐          ┌────────────────────────┐
         │  ProtectedRoute      │          │  AppShell + Components │
         │  (verifica permisos) │          │  (páginas privadas)    │
         └──────────────────────┘          └────────────────────────┘
                    │
        ┌───────────┴──────────────┐
        │                          │
    ✅  │ Acceso permitido         │  ❌ Acceso denegado
        │ Muestra contenido        │     Redirige a /login
        │                          │
        ▼                          ▼
   Dashboard             Página de Login
```

## Flujo de Solicitud de API

```
┌──────────────────────────────────────────────────────────────────┐
│                  React Component (Page/Form)                    │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ Llama a servicio
                         │
        ┌────────────────▼────────────────┐
        │  Servicio (e.g., storiesService) │
        │  - Valida parámetros             │
        │  - Llama a api.js                │
        └────────────────┬────────────────┘
                         │
        ┌────────────────▼────────────────┐
        │  Cliente API (Axios)             │
        │  - Interceptor REQUEST           │
        │    → Agrega token Bearer        │
        │  - Envía solicitud HTTP          │
        └────────────────┬────────────────┘
                         │
                         │ HTTP GET/POST/PUT/DELETE
                         │ + Authorization: Bearer {token}
                         │
                         ▼
        ┌────────────────────────────────┐
        │     Backend API                 │
        │  - Valida token                 │
        │  - Procesa solicitud            │
        │  - Retorna JSON                 │
        └────────────────┬────────────────┘
                         │
        ┌────────────────▼────────────────┐
        │  Interceptor RESPONSE (Axios)   │
        │  - Si 401:                      │
        │    → POST /auth/refresh         │
        │    → Obtiene nuevo token        │
        │    → Reintenta solicitud        │
        │  - Si otro error:               │
        │    → Rechaza promesa            │
        └────────────────┬────────────────┘
                         │
        ┌────────────────▼────────────────┐
        │  Retorna al Servicio            │
        │  {                              │
        │    data: response,              │
        │    status: 200,                 │
        │    statusText: "OK"             │
        │  }                              │
        └────────────────┬────────────────┘
                         │
        ┌────────────────▼────────────────┐
        │  React Component                │
        │  - setState(data)               │
        │  - Re-render                    │
        │  - Muestra contenido            │
        └────────────────────────────────┘
```

## Estados de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                   Estados de Carga                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. LOADING ──────────────────────┐                        │
│     └─ Mostrar: LoadingState      │                        │
│        LoadingSkeleton             │                        │
│        LoadingCard                │                        │
│                                    │                        │
│  2. ERROR ────────────────────────┤                        │
│     └─ Mostrar: ErrorState         │                        │
│        ErrorAlert                 │                        │
│        Botón Reintentar           │                        │
│                                    │                        │
│  3. EMPTY ────────────────────────┤                        │
│     └─ Mostrar: EmptyState         │                        │
│        EmptyListMessage            │                        │
│        Mensaje personalizado       │                        │
│                                    │                        │
│  4. SUCCESS ───────────────────────┤                        │
│     └─ Mostrar: Componentes        │                        │
│        StoryCard                   │                        │
│        Contenido real              │                        │
│        Paginación                 │                        │
│                                   │                        │
└─────────────────────────────────────────────────────────────┘

Ejemplo en código:

{loading ? (
  <LoadingState />
) : error ? (
  <ErrorState onRetry={retry} />
) : data.length === 0 ? (
  <EmptyState />
) : (
  <StoryCardGrid stories={data} />
)}
```

## Roles y Permisos

```
┌──────────────────────────────────────────────────────────────┐
│                       ROLES EN EL SISTEMA                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  LECTOR (Anónimo)                                           │
│  └─ Acceso: Rutas públicas                                 │
│     - HomePage, LoginPage, RegisterPage, ExplorePage       │
│     - Lectura de historias publicadas                      │
│                                                              │
│  USER (Escritor)                                            │
│  └─ Acceso: Rutas privadas de escritor                    │
│     - Dashboard, Mis Historias, Editor de capítulos        │
│     - Worldbuilding (personajes, eventos)                  │
│     - Perfil, Favoritos, Seguimiento                       │
│     - Métricas personales                                  │
│                                                              │
│  MODERATOR                                                  │
│  └─ Acceso: Rutas de moderación                           │
│     - Todo de USER                                         │
│     - Dashboard de moderación                              │
│     - Reportes, Sanciones                                  │
│     - Comentarios ocultos                                  │
│                                                              │
│  ADMIN                                                      │
│  └─ Acceso: Rutas administrativas                         │
│     - Todo de MODERATOR                                    │
│     - Dashboard admin                                      │
│     - Gestión de usuarios                                  │
│     - Comunicados globales                                 │
│     - Actividad del sistema                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘

ProtectedRoute automáticamente:
- Verifica autenticación (isAuthenticated)
- Verifica rol (requiredRoles)
- Redirige a /login si no autenticado
- Redirige a /dashboard si role insuficiente
```

## Ciclo de Vida de una Página

```
┌─────────────────────────────────────────────────────────────┐
│                    Usuario navega a /stories                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   ProtectedRoute           │
        │   ✓ Verifica autenticación │
        └────────────────┬───────────┘
                         │
                         ▼
        ┌────────────────────────────┐
        │  StoriesPage renderiza     │
        │  useState([loading: true])  │
        └────────────────┬───────────┘
                         │
                         ▼
        ┌────────────────────────────┐
        │  useEffect dispara         │
        │  - Llama a API             │
        │  - setState(loading: true) │
        └────────────────┬───────────┘
                         │
                         ▼
        ┌────────────────────────────┐
        │  Página muestra            │
        │  <LoadingState />          │
        └────────────────┬───────────┘
                         │
                    (datos llegan)
                         │
                         ▼
        ┌────────────────────────────┐
        │  setState(stories, loading)│
        │  Re-render                 │
        └────────────────┬───────────┘
                         │
                         ▼
        ┌────────────────────────────┐
        │  Página muestra            │
        │  <StoryCardGrid stories /> │
        │  + Paginación              │
        └────────────────────────────┘
```

## Patrones de Diseño Utilizados

```
Componentes Comunes:
┌──────────────────────┐
│   UI Component       │ EditorialButton, StatusBadge, etc.
└──────────────────────┘

Controladores de Página:
┌──────────────────────┐
│   Page Component     │ HomePage, DashboardPage, etc.
│   - Estados locales  │
│   - Llamadas API     │
│   - Layout         │
└──────────────────────┘

HOC (High Order Components):
┌──────────────────────┐
│  ProtectedRoute      │ Envuelve componentes para protección
└──────────────────────┘

Context Providers:
┌──────────────────────┐
│  AuthContext         │ Proporciona user, auth globalmente
│  AuthProvider        │
└──────────────────────┘

Servicios:
┌──────────────────────┐
│  StoriesService      │ Encapsula lógica de API
│  Api.js              │ Cliente HTTP reutilizable
└──────────────────────┘
```

---

Esta arquitectura es:
- **Escalable**: Fácil agregar nuevas páginas y servicios
- **Modular**: Componentes independientes y reutilizables
- **Mantenible**: Patrones consistentes en toda la app
- **Segura**: Protección de rutas y validación
- **Responsive**: Mobile-first con Tailwind CSS
- **Performance**: Lazy loading, código splitting con Vite
