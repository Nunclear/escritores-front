# Estructura de Carpetas

## Árbol de Directorios Completo

```
escritores-front/
│
├── src/                           # Código fuente principal
│   ├── api/
│   │   ├── client.js              # 📌 Cliente HTTP y todos los endpoints
│   │   └── README.md              # Documentación de endpoints
│   │
│   ├── components/                # Componentes reutilizables
│   │   ├── ApiState.jsx           # LoadingBlock, ErrorBlock, EmptyBlock
│   │   ├── ChapterGroups.jsx       # Agrupación de capítulos por arcos
│   │   ├── CommentsThread.jsx      # Sistema de comentarios con hilos
│   │   ├── FavoriteButton.jsx      # Botón de favorito con toggle
│   │   ├── FavoritesPanel.jsx      # Panel de historias favoritas
│   │   ├── Header.jsx             # Navegación y autenticación
│   │   ├── RankingPanel.jsx        # Panel de historias top vistas
│   │   ├── RatingBox.jsx           # Sistema de calificaciones
│   │   ├── ReportButton.jsx        # Botón para reportar contenido
│   │   ├── Shell.jsx              # Layout base (ambientes, header, footer)
│   │   ├── StoryCard.jsx          # Card individual de historia
│   │   ├── ThemeToggle.jsx         # Toggle tema oscuro/claro
│   │   ├── WriterNav.jsx          # Navegación para escritores
│   │   ├── WriterTabs.jsx         # Tabs del panel del escritor
│   │   └── index.js               # Exports de componentes
│   │
│   ├── context/
│   │   └── AuthContext.jsx        # 📌 Estado global de autenticación
│   │
│   ├── data/
│   │   └── mock.js                # Datos mock para desarrollo
│   │
│   ├── pages/                      # Páginas/vistas (18 archivos)
│   │   ├── AccountSettings.jsx     # Configuración de cuenta
│   │   ├── AdminPanel.jsx          # Panel de administrador
│   │   ├── AuthPage.jsx            # Login/Registro
│   │   ├── AuthorProfile.jsx       # Perfil público de autor
│   │   ├── Authors.jsx             # Lista de autores
│   │   ├── AuthorsPage.jsx         # Página de exploración de autores
│   │   ├── Community.jsx           # Página de comunidad
│   │   ├── CommunityPage.jsx       # Variante de comunidad
│   │   ├── Dashboard.jsx           # Panel privado general
│   │   ├── Explore.jsx             # Exploración y búsqueda
│   │   ├── Favorites.jsx           # Mis favoritos
│   │   ├── Following.jsx           # Usuarios seguidos
│   │   ├── Home.jsx                # Inicio público
│   │   ├── LibraryLists.jsx        # Listas de biblioteca
│   │   ├── Moderation.jsx          # Panel de moderación
│   │   ├── ModerationPage.jsx      # Variante de moderación
│   │   ├── MyStories.jsx           # Mis historias
│   │   ├── ProfilePage.jsx         # Perfil de usuario
│   │   ├── ProfileSettings.jsx     # Configuración de perfil
│   │   ├── QuickWrite.jsx          # Editor rápido
│   │   ├── Reader.jsx              # Lector de capítulos
│   │   ├── ReaderActivity.jsx      # Actividad del lector
│   │   ├── StoryCover.jsx          # Portada de historia
│   │   ├── StoryEditor.jsx         # Editor completo de historias
│   │   ├── StoryManager.jsx        # Gestor de historias
│   │   ├── UserProfile.jsx         # Perfil de usuario
│   │   ├── WriterPanel.jsx         # Panel principal de escritor
│   │   └── WriterStudio.jsx        # Estudio de escritura
│   │
│   ├── styles/
│   │   └── global.css              # 📌 Estilos globales (CSS)
│   │                               #    Variables de tema, layouts
│   │
│   ├── utils/
│   │   ├── story.js                # Funciones auxiliares para historias
│   │   └── (otros utils)           # Funciones reutilizables
│   │
│   ├── App.jsx                     # 📌 Configuración de rutas
│   │                               #    Todas las 38 rutas
│   │
│   └── main.jsx                    # Punto de entrada (React.render)
│
├── public/
│   ├── favicon.svg                 # Icono del sitio
│   ├── icons.svg                   # Iconos sprite
│   └── image.png                   # Imagen de ejemplo
│
├── docs/                           # 📚 Documentación MkDocs
│   └── frontend/
│       ├── index.md                # Página principal
│       ├── arquitectura.md         # Arquitectura del sistema
│       ├── estructura.md           # Este archivo
│       ├── configuracion.md        # Setup y configuración
│       ├── rutas.md                # Todas las rutas
│       ├── componentes.md          # Documentación de componentes
│       ├── servicios-api.md        # Endpoints API
│       ├── estados.md              # Gestión de estados
│       ├── formularios.md          # Validación de formularios
│       ├── assets.md               # Assets y recursos
│       ├── autenticacion.md        # Sistema de autenticación
│       ├── pruebas.md              # Testing y QA
│       ├── ejecucion-local.md      # Cómo ejecutar
│       ├── build-produccion.md     # Build para producción
│       ├── despliegue.md           # Deployment
│       └── errores-comunes.md      # Troubleshooting
│
├── index.html                      # 📄 HTML principal
├── package.json                    # 📌 Dependencias y scripts
├── package-lock.json               # Lock file npm
├── vite.config.js                  # 📌 Configuración Vite
├── tailwind.config.js              # 📌 Configuración Tailwind
├── tsconfig.json                   # Configuración TypeScript
├── tsconfig.app.json               # TS App config
├── tsconfig.node.json              # TS Node config
├── eslint.config.js                # Configuración ESLint
│
├── .env.example                    # Variables de entorno (template)
├── .env.production                 # Variables de entorno (producción)
├── .gitignore                      # Archivos ignorados en git
├── nginx.conf                      # Configuración nginx (deployment)
├── Dockerfile                      # Docker (si se usa)
├── Jenkinsfile                     # CI/CD pipeline
│
├── README.md                       # Documentación general
├── SETUP.md                        # Guía de instalación
├── ARCHITECTURE.md                 # Arquitectura técnica
├── IMPLEMENTATION_SUMMARY.md       # Resumen de implementación
├── EXAMPLES.md                     # Ejemplos de código
└── NEXT_STEPS.md                   # Próximas mejoras
```

## Desglose por Categoría

### 🎨 Componentes (src/components/)

**20+ Componentes reutilizables**

| Componente | Propósito | Ubicación |
|---|---|---|
| ApiState | Estados de carga/error/vacío | ApiState.jsx |
| ChapterGroups | Agrupa capítulos por arcos | ChapterGroups.jsx |
| CommentsThread | Sistema de comentarios | CommentsThread.jsx |
| FavoriteButton | Botón de favorito | FavoriteButton.jsx |
| FavoritesPanel | Panel de favoritos | FavoritesPanel.jsx |
| Header | Navegación principal | Header.jsx |
| RankingPanel | Top historias | RankingPanel.jsx |
| RatingBox | Calificaciones | RatingBox.jsx |
| ReportButton | Reportar contenido | ReportButton.jsx |
| Shell | Layout base | Shell.jsx |
| StoryCard | Card de historia | StoryCard.jsx |
| ThemeToggle | Tema oscuro/claro | ThemeToggle.jsx |
| WriterNav | Nav de escritor | WriterNav.jsx |
| WriterTabs | Tabs del panel | WriterTabs.jsx |

### 📄 Páginas (src/pages/)

**18 Páginas principales**

| Página | Ruta | Tipo | Propósito |
|---|---|---|---|
| Home | `/` | Pública | Feed principal |
| AuthPage | `/acceso` | Pública | Login/Registro |
| Explore | `/explorar` | Pública | Búsqueda |
| StoryCover | `/historia/:storyId` | Pública | Portada |
| Reader | `/leer/:storyId/capitulo/:chapterId` | Pública | Lectura |
| AuthorProfile | `/autor/:authorId` | Pública | Perfil autor |
| Authors | `/autores` | Pública | Listado autores |
| Community | `/comunidad` | Pública | Comunidad |
| WriterPanel | `/escritor`, `/dashboard` | Privada | Panel escritor |
| QuickWrite | `/escribir` | Privada | Editor rápido |
| StoryEditor | `/editor/:storyId` | Privada | Editor completo |
| MyStories | `/mis-historias` | Privada | Mis historias |
| Favorites | `/favoritos` | Privada | Favoritos |
| Following | `/siguiendo` | Privada | Seguidos |
| ProfileSettings | `/mi-perfil` | Privada | Mi perfil |
| AccountSettings | `/configuracion` | Privada | Configuración |
| Moderation | `/moderacion` | Staff | Moderación |
| AdminPanel | `/admin` | Admin | Admin |

### 🔌 API (src/api/)

**client.js** - 100+ endpoints documentados

Categorías de servicios:
- `auth` - Autenticación
- `users` - Usuarios
- `stories` - Historias
- `chapters` - Capítulos
- `comments` - Comentarios
- `ratings` - Calificaciones
- `favorites` - Favoritos
- `follows` - Seguimiento
- `arcs` - Arcos narrativos
- `volumes` - Volúmenes
- `characters` - Personajes
- `skills` - Habilidades
- `events` - Eventos
- `items` - Items/objetos
- `media` - Multimedia
- `reports` - Reportes
- `sanctions` - Sanciones
- `moderation` - Moderación
- `metrics` - Métricas
- `adminUsers` - Admin usuarios
- `globalNotices` - Anuncios
- `dashboard` - Dashboard
- `adminDashboard` - Admin dashboard

### 🌍 Context (src/context/)

**AuthContext.jsx** - Estado global

```javascript
export const useAuth() {
  // user
  // loading
  // isAuthenticated
  // login(credentials)
  // register(data)
  // logout()
}
```

### 🎯 Utils (src/utils/)

- `story.js` - Funciones de historias (normalizeStory, etc)
- Helpers personalizados
- Constantes globales

### 🎨 Estilos (src/styles/)

**global.css** - Variables CSS y estilos

- Variables de tema (colores, tipografía)
- Layouts globales
- States y animations
- Responsive design

---

## Archivos Clave (📌)

### Para Agregar Rutas
→ `src/App.jsx` (líneas 20-40)

### Para Agregar Endpoints
→ `src/api/client.js` (líneas 50-500+)

### Para Temas y Estilos
→ `src/styles/global.css` y `:root` variables

### Para Autenticación
→ `src/context/AuthContext.jsx`

### Para Desarrollo
→ `vite.config.js`

### Para Dependencias
→ `package.json`

---

## Jerarquía de Dependencias

```
main.jsx
└── App.jsx (Routes)
    ├── Shell.jsx (Layout)
    │   ├── Header.jsx
    │   ├── main (children)
    │   └── Footer
    │
    └── Pages (18 archivos)
        ├── Home.jsx
        │   ├── StoryCard.jsx
        │   ├── RankingPanel.jsx
        │   └── ApiState.jsx
        │
        ├── Reader.jsx
        │   ├── CommentsThread.jsx
        │   ├── RatingBox.jsx
        │   └── ChapterGroups.jsx
        │
        └── ... (más páginas)

AuthContext.jsx (Context)
└── Usado en todas las páginas privadas
    - useAuth() en cualquier componente
```

---

## Convenciones de Código

### Nombres de Archivos
- Componentes: PascalCase (Home.jsx, StoryCard.jsx)
- Utilidades: camelCase (story.js, helpers.js)
- Estilos: snake_case (global.css)

### Estructura de Componentes
```jsx
import { useState, useEffect } from 'react';
import { api } from '../api/client';

export default function ComponenteName() {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Setup
  }, []);
  
  return <section>...</section>;
}
```

### Imports
- Librerías externas primero
- Módulos locales después
- Estilos al final (si aplica)

---

**Última actualización**: Enero 2024
