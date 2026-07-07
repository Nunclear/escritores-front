# Arquitectura del Frontend

## Flujo de Datos General

```mermaid
graph TB
    Browser["🌐 Navegador"]
    ViteServer["⚡ Vite Dev Server<br/>Puerto 5173"]
    React["⚛️ React App"]
    Router["🛣️ React Router"]
    Components["🔧 Componentes"]
    State["📦 Estado Global<br/>AuthContext"]
    Services["🔗 Servicios API"]
    Fetch["🌐 Fetch HTTP"]
    Backend["🔙 Backend REST API<br/>Puerto 8080"]
    Database["💾 Base de Datos"]
    
    Browser -->|solicita| ViteServer
    ViteServer -->|sirve| React
    React --> Router
    Router --> Components
    Components --> State
    Components --> Services
    Services --> Fetch
    Fetch -->|Bearer Token| Backend
    Backend -->|valida| State
    Backend --> Database
    Database -->|retorna| Backend
    Backend -->|JSON| Fetch
    Fetch --> Services
    Services -->|actualiza| State
    State -->|propaga| Components
    Components -->|re-render| Browser
    
    style Browser fill:#e3f2fd
    style ViteServer fill:#fff3e0
    style React fill:#f3e5f5
    style Router fill:#e8f5e9
    style Components fill:#fce4ec
    style State fill:#fff9c4
    style Services fill:#e0f2f1
    style Fetch fill:#f1f8e9
    style Backend fill:#ede7f6
    style Database fill:#eceff1
```

## Arquitectura en Capas

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                     │
│  Páginas (19+) • Componentes (20+) • UI/UX                  │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE ENRUTAMIENTO                      │
│  React Router • Routes • ProtectedRoute • StaffOnly          │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE ESTADO GLOBAL                     │
│  AuthContext • useAuth Hook • User Data                      │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE NEGOCIO                           │
│  Servicios API • Lógica de aplicación • Utilidades           │
├─────────────────────────────────────────────────────────────┤
│                    CAPA DE INTEGRACIÓN HTTP                  │
│  Cliente Fetch • Headers • Interceptores • Tokens            │
├─────────────────────────────────────────────────────────────┤
│                    BACKEND REST API                          │
│  Endpoints (100+) • Controladores • Servicios                │
└─────────────────────────────────────────────────────────────┘
```

## Patrones Arquitectónicos

### 1. Patrón MVC Adaptado

```
Model (Estado)
  ↓
View (Componentes)
  ↓
Controller (Servicios API)
  ↓
Backend (Negocio)
```

### 2. Patrón Container/Presentational

- **Container Components** (Páginas): Manejan lógica y estado
- **Presentational Components**: Reciben props, renderizan UI

### 3. Patrón Context API para Estado Global

```jsx
AuthProvider (raíz)
  ↓
useAuth() hook
  ↓
Componentes consumidores
```

## Flujo de Autenticación Detallado

```mermaid
sequenceDiagram
    participant User as 👤 Usuario
    participant Browser as 🌐 Navegador
    participant Frontend as ⚛️ Frontend
    participant Backend as 🔙 Backend
    participant Storage as 💾 localStorage
    
    User->>Browser: Ingresa credenciales
    Browser->>Frontend: Envía form data
    Frontend->>Backend: POST /auth/login
    Backend->>Backend: Valida credenciales
    Backend->>Frontend: Retorna {accessToken, refreshToken, user}
    Frontend->>Storage: Guarda tokens y user
    Frontend->>Frontend: AuthContext.setState(user)
    Frontend->>Browser: Redirige a /dashboard
    User->>Browser: ✅ Sesión iniciada
```

## Ciclo de Vida de una Solicitud API

```
1. Usuario interactúa (click, form submit)
    ↓
2. Componente llama a servicio (e.g., api.stories.list())
    ↓
3. Servicio valida y llama a fetch()
    ↓
4. Fetch agrega token Bearer en headers
    ↓
5. Backend recibe, valida, procesa
    ↓
6. Backend retorna JSON
    ↓
7. Componente recibe datos
    ↓
8. setState(data) → Re-render
    ↓
9. Usuario ve contenido actualizado
```

## Gestión de Errores

```
┌─────────────────────────────────────┐
│       Solicitud API falla           │
└────────────────┬────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
         ▼                ▼
    HTTP Error        Network Error
         │                │
    ┌────┴────┐      ┌────┴────┐
    │          │      │         │
   401       404    Timeout  No conexión
    │          │      │         │
    ▼          ▼      ▼         ▼
 Refresh   Show      Retry   Show Error
 Token     Error             & Retry Btn
```

## Roles y Permisos

```mermaid
graph TD
    A["🔓 Público<br/>Anónimo"] -->|puede| B["Leer historias<br/>Ver perfiles<br/>Explorar"]
    
    C["👤 USER<br/>Escritor"] -->|acceso| D["Escribir historias<br/>Editar capítulos<br/>Worldbuilding<br/>Ver favoritos"]
    C -->|es| A
    
    E["👮 MODERATOR<br/>Moderador"] -->|acceso| F["Revisar reportes<br/>Sanciones<br/>Comentarios ocultos<br/>Dashboard moderación"]
    E -->|es| C
    
    G["👨‍💼 ADMIN<br/>Administrador"] -->|acceso| H["Gestionar usuarios<br/>Comunicados globales<br/>Dashboard admin<br/>Actividad del sistema"]
    G -->|es| E
    
    style A fill:#e3f2fd
    style C fill:#fff3e0
    style E fill:#f3e5f5
    style G fill:#fce4ec
```

## Componentes Principales

### Envoltorio de Aplicación

```
Shell
├── Header (navegación)
├── Router
│   ├── Rutas públicas
│   │   └── Home, Explore, Authors, Community
│   ├── Rutas privadas (Protected)
│   │   └── Dashboard, WriterPanel, StoryEditor
│   └── Rutas de staff (StaffOnly)
│       └── Moderation, AdminPanel
└── Footer
```

### Estructura de Páginas Privadas

```
ProtectedRoute (verifica auth)
└── Página (e.g., WriterPanel)
    ├── Header/TopBar
    ├── Sidebar
    ├── Main Content
    └── Modals/Dialogs
```

## Flujo de Renderizado Condicional

```jsx
// Patrón usado en páginas
{loading && <LoadingState />}
{error && <ErrorState onRetry={retry} />}
{!data?.length && <EmptyState />}
{data?.length > 0 && <ContentView data={data} />}
```

## Almacenamiento de Datos

### localStorage

```
rdp_access_token   → JWT para autenticación
rdp_refresh_token  → JWT para renovar sesión
rdp_user          → Objeto usuario (JSON)
rdp_visitor_token → ID único de visitante
```

### Contexto (AuthContext)

```
user              → {id, email, username, role, accessLevel}
isAuthenticated   → boolean
loading           → boolean (mientras valida sesión)
login()           → async (credentials)
logout()          → async ()
register()        → async (data)
```

## Ciclo de Vida de Componente Típico

```
1. Component monta
   ↓
2. useEffect dispara (si tiene dependencias)
   ↓
3. Llama a API
   ↓
4. setState(loading: true)
   ↓
5. Datos llegan
   ↓
6. setState(data, loading: false)
   ↓
7. Componente re-renderiza con datos
   ↓
8. Usuario ve contenido
```

## Validación de Roles

```jsx
// En componentes
const { user } = useAuth();
const isAdmin = user?.role === 'admin';

// En rutas
<Route 
  path="/admin" 
  element={
    <AdminOnly>
      <AdminPanel />
    </AdminOnly>
  }
/>
```

## Patrón de Servicios API

```js
// Estructura general
export const api = {
  auth: {
    login: (credentials) => request('POST /auth/login', credentials),
    logout: (token) => request('POST /auth/logout', token),
    me: () => request('GET /auth/me')
  },
  stories: {
    list: (params) => request('GET /stories', params),
    create: (data) => request('POST /stories', data),
    update: (id, data) => request('PUT /stories/:id', data)
  }
}
```
