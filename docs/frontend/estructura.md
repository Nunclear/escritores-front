# Estructura del Proyecto

## Árbol de Directorios Completo

```
escritores-front/
│
├── public/                           # Activos estáticos
│   ├── favicon.svg                   # Icono de sitio
│   ├── icons.svg                     # Sprite de iconos SVG
│   └── image.png                     # Imagen genérica
│
├── src/                              # Código fuente principal
│   ├── components/                   # Componentes reutilizables (20+)
│   │   ├── ApiState.jsx              # Visualizador de estado de API (debug)
│   │   ├── ChapterGroups.jsx         # Agrupación de capítulos por arco/volumen
│   │   ├── CommentsThread.jsx        # Hilo de comentarios
│   │   ├── FavoriteButton.jsx        # Botón para agregar/remover favoritos
│   │   ├── FavoritesPanel.jsx        # Panel de favoritos del usuario
│   │   ├── Header.jsx                # Encabezado/navegación principal
│   │   ├── RankingPanel.jsx          # Panel de historias más vistas
│   │   ├── RatingBox.jsx             # Caja de calificación
│   │   ├── ReportButton.jsx          # Botón para reportar contenido
│   │   ├── Shell.jsx                 # Envoltorio principal de la app
│   │   ├── StoryCard.jsx             # Card individual de historia
│   │   ├── ThemeToggle.jsx           # Toggle de tema claro/oscuro
│   │   ├── WriterNav.jsx             # Navegación para escritores
│   │   └── WriterTabs.jsx            # Pestañas en paneles de escritor
│   │
│   ├── pages/                        # Páginas/vistas (19+)
│   │   ├── AccountSettings.jsx       # Configuración de cuenta del usuario
│   │   ├── AdminPanel.jsx            # Panel administrativo (admin only)
│   │   ├── AuthPage.jsx              # Página de login/registro
│   │   ├── AuthorProfile.jsx         # Perfil público del autor
│   │   ├── Authors.jsx               # Página de exploración de autores
│   │   ├── AuthorsPage.jsx           # Variante de página de autores
│   │   ├── Community.jsx             # Página de comunidad
│   │   ├── CommunityPage.jsx         # Variante de comunidad
│   │   ├── Dashboard.jsx             # Panel principal del usuario autenticado
│   │   ├── Explore.jsx               # Página de exploración de historias
│   │   ├── Favorites.jsx             # Página de historias favoritas
│   │   ├── Following.jsx             # Página de autores seguidos
│   │   ├── Home.jsx                  # Página de inicio pública
│   │   ├── LibraryLists.jsx          # Listas de biblioteca
│   │   ├── Moderation.jsx            # Panel de moderación (moderator only)
│   │   ├── ModerationPage.jsx        # Variante de moderación
│   │   ├── MyStories.jsx             # Mis historias del autor
│   │   ├── ProfilePage.jsx           # Perfil del usuario autenticado
│   │   ├── ProfileSettings.jsx       # Configuración de perfil
│   │   ├── QuickWrite.jsx            # Escritura rápida/temporal
│   │   ├── Reader.jsx                # Lector de capítulos
│   │   ├── ReaderActivity.jsx        # Actividad de lectura
│   │   ├── StoryCover.jsx            # Portada/detalles de historia
│   │   ├── StoryEditor.jsx           # Editor de historias
│   │   ├── StoryManager.jsx          # Gestor de historias
│   │   ├── UserProfile.jsx           # Perfil de usuario
│   │   ├── WriterPanel.jsx           # Panel principal de escritor
│   │   └── WriterStudio.jsx          # Estudio de escritura
│   │
│   ├── context/                      # Contexto de Estado Global
│   │   └── AuthContext.jsx           # Contexto de autenticación
│   │
│   ├── api/                          # Servicios y Cliente API
│   │   └── client.js                 # Cliente HTTP + servicios API
│   │
│   ├── data/                         # Datos mock/estaticos
│   │   └── mock.js                   # Datos de prueba
│   │
│   ├── utils/                        # Utilidades
│   │   └── story.js                  # Funciones utilitarias para historias
│   │
│   ├── styles/                       # Estilos globales
│   │   └── global.css                # CSS global (Tailwind + custom)
│   │
│   ├── App.jsx                       # Componente raíz (rutas)
│   ├── main.jsx                      # Punto de entrada de React
│   └── index.html                    # Archivo HTML base
│
├── docs/                             # Documentación (MkDocs)
│   └── frontend/                     # Documentación del frontend
│
├── .env.example                      # Plantilla de variables de entorno
├── .env.production                   # Variables para producción
├── .gitignore                        # Archivos ignorados por Git
├── eslint.config.js                  # Configuración de ESLint
├── tailwind.config.js                # Configuración de Tailwind CSS
├── vite.config.js                    # Configuración de Vite
├── tsconfig.json                     # Configuración de TypeScript (no usado actualmente)
├── tsconfig.app.json                 # Config TypeScript app
├── tsconfig.node.json                # Config TypeScript node
├── package.json                      # Dependencias y scripts
├── package-lock.json                 # Lock file de npm
│
├── Dockerfile                        # Configuración Docker
├── nginx.conf                        # Configuración Nginx
├── Jenkinsfile                       # Pipeline CI/CD (Jenkins)
│
├── ARCHITECTURE.md                   # Documentación de arquitectura
├── SETUP.md                          # Guía de instalación
├── IMPLEMENTATION_SUMMARY.md         # Resumen de implementación
├── EXAMPLES.md                       # Ejemplos de código
├── README.md                         # Información general del proyecto
│
└── escritores-front.zip              # Archivo comprimido del proyecto
```

## Descripción de Carpetas Principales

### `/src/components/`

Componentes reutilizables que se utilizan en múltiples páginas. Cada componente es independiente y responsable de una parte específica de la UI.

**Ejemplos de uso:**
```jsx
import StoryCard from './components/StoryCard';
import Header from './components/Header';
```

### `/src/pages/`

Páginas completas correspondientes a rutas de la aplicación. Cada página es un contenedor que puede incluir múltiples componentes.

**Ejemplo de estructura:**
```jsx
export default function HomePage() {
  return (
    <Shell>
      <Header />
      <RankingPanel />
      <StoryCard />
    </Shell>
  )
}
```

### `/src/context/`

Contextos de React que proporciona estado global de la aplicación. En este proyecto se usa `AuthContext` para manejar autenticación.

**Uso:**
```jsx
const { user, isAuthenticated, login, logout } = useAuth();
```

### `/src/api/`

Cliente HTTP centralizado basado en `fetch()` nativo que proporciona métodos para consumir el backend API.

**Estructura:**
```js
api.auth.login()
api.stories.list()
api.chapters.publish()
```

### `/src/styles/`

Hojas de estilo globales. Se usa principalmente Tailwind CSS con CSS personalizado cuando es necesario.

### `/src/utils/`

Funciones utilitarias y helpers que se reutilizan en múltiples componentes.

## Archivos de Configuración Clave

| Archivo | Propósito |
|---------|-----------|
| `vite.config.js` | Configuración del empaquetador Vite |
| `tailwind.config.js` | Configuración de clases Tailwind CSS |
| `package.json` | Dependencias, scripts y metadata |
| `.env.example` | Plantilla de variables de entorno |
| `eslint.config.js` | Reglas de linting |

## Dependencias Principales

```json
{
  "react": "última",           // Framework UI
  "react-dom": "última",       // Rendering en DOM
  "react-router-dom": "última", // Enrutamiento
  "lucide-react": "última"     // Iconos
}
```

## Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo (puerto 5173)
npm run build    # Genera build optimizado para producción
npm run preview  # Previsualiza build de producción localmente
```

## Patrones de Nombres

### Componentes
- Formato: PascalCase (ej: `StoryCard.jsx`)
- Exportación default
- Reciben props de configuración

### Páginas
- Formato: PascalCase con sufijo Page (ej: `HomePage.jsx`)
- Exportación default
- Corresponden a rutas React Router

### Servicios
- Formato: camelCase (ej: `client.js`)
- Exportan funciones o objetos con métodos
- Actúan como abstracción del HTTP

### Utilidades
- Formato: camelCase (ej: `story.js`)
- Exportan funciones puras
- Sin efectos secundarios

## Estructura de Datos (Tipos Comunes)

### User
```js
{
  id: number,
  email: string,
  username: string,
  avatar: string | null,
  bio: string | null,
  role: 'user' | 'moderator' | 'admin',
  accessLevel: string,
  createdAt: ISO8601Date
}
```

### Story
```js
{
  id: number,
  title: string,
  description: string,
  cover: string | null,
  author: User,
  status: 'draft' | 'published' | 'archived',
  chapters: Chapter[],
  ratings: number,
  favorites: number,
  views: number,
  createdAt: ISO8601Date,
  updatedAt: ISO8601Date
}
```

### Chapter
```js
{
  id: number,
  title: string,
  subtitle: string | null,
  content: string,
  storyId: number,
  order: number,
  status: 'draft' | 'published',
  createdAt: ISO8601Date,
  updatedAt: ISO8601Date
}
```

### Comment
```js
{
  id: number,
  content: string,
  author: User,
  storyId: number | null,
  chapterId: number | null,
  parentId: number | null,  // null = comentario raíz
  replies: Comment[],
  createdAt: ISO8601Date
}
```
