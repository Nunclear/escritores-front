# Escritores Frontend - Guía de Configuración

## Descripción General

Escritores es una plataforma completa de escritura creativa construida con React, Tailwind CSS y Axios. El proyecto está totalmente integrado con la API backend y listo para desarrollo.

## Estructura del Proyecto

```
src/
├── api/                    # Capa de servicios API
│   ├── apiClient.js       # Configuración de Axios con interceptores
│   ├── authService.js     # Autenticación (login, registro, recuperación contraseña)
│   ├── usersService.js    # Gestión de usuarios y perfiles
│   ├── storiesService.js  # CRUD de historias
│   ├── chaptersService.js # Gestión de capítulos
│   ├── charactersService.js # Personajes de historias
│   ├── worldbuildingService.js # Elementos de construcción de mundos
│   ├── commentsService.js # Sistema de comentarios
│   ├── ratingsService.js  # Calificaciones y reseñas
│   ├── favoritesService.js # Favoritos y colecciones
│   ├── moderationService.js # Herramientas de moderación
│   ├── adminService.js    # Funciones administrativas
│   ├── metricsService.js  # Analíticas y métricas
│   ├── notificationsService.js # Sistema de notificaciones
│   └── index.js          # Exportaciones centralizadas
│
├── components/            # Componentes React
│   ├── ui/               # Componentes de interfaz (Modal, Alert, Avatar, etc.)
│   ├── layout/           # Componentes de diseño
│   ├── AppShell.jsx      # Shell para páginas autenticadas
│   ├── PublicNavbar.jsx  # Navbar público
│   ├── PrivateSidebar.jsx # Sidebar para usuarios autenticados
│   └── ...               # Otros componentes (Button, Card, Forms, etc.)
│
├── context/              # React Context
│   └── AuthContext.jsx   # Contexto de autenticación global
│
├── pages/                # Páginas de la aplicación
│   ├── public/
│   │   ├── HomePage.jsx        # Página de inicio
│   │   ├── ExplorePage.jsx     # Explorar historias
│   │   └── StoryReaderPage.jsx # Lector de historias
│   ├── private/
│   │   ├── WriterDashboardPage.jsx # Dashboard de escritor
│   │   └── EditorPage.jsx          # Editor de historias y capítulos
│   ├── LoginPage.jsx        # Iniciar sesión
│   ├── RegisterPage.jsx     # Registro de usuarios
│   ├── ForgotPasswordPage.jsx     # Recuperación de contraseña
│   └── ResetPasswordPage.jsx      # Restablecer contraseña
│
├── routes/               # Configuración de rutas
│   └── AppRoutes.jsx     # Definición de todas las rutas de la aplicación
│
├── utils/                # Utilidades
│   ├── helpers.js        # Funciones auxiliares
│   └── validators.js     # Validaciones de formularios
│
├── App.jsx              # Componente raíz
├── main.jsx             # Punto de entrada
└── index.css            # Estilos globales

```

## Configuración Inicial

### 1. Variables de Entorno

```bash
# .env (en raíz del proyecto)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Escritores
```

### 2. Instalación de Dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 3. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## Características Implementadas

### Autenticación
- ✅ Registro de nuevos usuarios
- ✅ Inicio de sesión
- ✅ Recuperación de contraseña
- ✅ Restablecer contraseña
- ✅ Verificación de email
- ✅ Tokens JWT con refresh automático
- ✅ Logout y cierre de sesiones

### Usuarios
- ✅ Perfil de usuario
- ✅ Búsqueda de usuarios
- ✅ Sistema de seguimiento (follow/unfollow)
- ✅ Estadísticas de usuarios
- ✅ Edición de perfil

### Historias
- ✅ Crear/editar/eliminar historias
- ✅ Listar historias públicas
- ✅ Filtrar por género, tags
- ✅ Búsqueda de historias
- ✅ Historias en tendencia
- ✅ Historias recomendadas
- ✅ Gestión de borradores
- ✅ Publicar/despublicar historias

### Capítulos
- ✅ CRUD completo de capítulos
- ✅ Editor de contenido
- ✅ Reordenar capítulos
- ✅ Guardar como borrador
- ✅ Publicar capítulos

### Lectura
- ✅ Lector de historias con navegación
- ✅ Sistema de calificaciones
- ✅ Agregar/quitar de favoritos
- ✅ Colecciones de favoritos
- ✅ Comentarios en capítulos
- ✅ Respuestas a comentarios

### Comunidad
- ✅ Sistema de favoritos
- ✅ Calificaciones y reseñas
- ✅ Comentarios y discusiones
- ✅ Seguimiento de autores
- ✅ Notificaciones

### Herramientas de Escritor
- ✅ Dashboard de escritor
- ✅ Editor de capítulos
- ✅ Gestión de personajes
- ✅ Herramientas de construcción de mundos
- ✅ Estadísticas de historias

### Moderación y Admin (Infraestructura)
- ✅ Servicios de moderación
- ✅ Sistema de reportes
- ✅ Herramientas administrativas
- ✅ Gestión de usuarios
- ✅ Auditoría y logs

## Rutas Disponibles

### Públicas
- `/` - Página de inicio
- `/explorar` - Explorar historias
- `/story/:storyId` - Leer historia
- `/story/:storyId/chapter/:chapterId` - Leer capítulo específico
- `/login` - Iniciar sesión
- `/register` - Registro
- `/forgot-password` - Recuperar contraseña
- `/reset-password?token=...` - Restablecer contraseña

### Autenticadas
- `/dashboard` - Dashboard de escritor
- `/editor/new` - Crear nueva historia
- `/editor/:storyId` - Editar historia

## Sistema de Diseño

### Colores (Variables CSS)
```css
--color-text-primary    /* Texto principal */
--color-text-secondary  /* Texto secundario */
--color-coffee          /* Color primario */
--color-surface         /* Fondo de tarjetas */
--color-cream           /* Fondo secundario */
--color-sand            /* Bordes sutiles */
--color-gold-olive      /* Color de acento */
--color-red-wine        /* Rojo oscuro */
```

### Tipografía
- **Serif:** Títulos y encabezados (serif)
- **Sans-serif:** Cuerpo de texto (sans)

### Componentes UI
```javascript
// Botones
<EditorialButton variant="primary|secondary|ghost|danger|success|premium" size="sm|md|lg" />

// Tarjetas
<Card><CardHeader /><CardBody /><CardFooter /></Card>

// Alertas
<Alert type="success|error|warning|info" title="" message="" />

// Formularios
<TextInput /><TextArea /><SelectInput /><CheckboxInput /><RadioInput />

// Modales
<Modal isOpen={true} title="" onClose={() => {}} />

// Otros
<Avatar /><Badge /><Tabs /><Skeleton /><Tooltip /><Dropdown />
```

## Integración con API

### Headers Automáticos
- `Authorization: Bearer {accessToken}` - Agregado automáticamente
- `Content-Type: application/json` - Configurado por defecto

### Manejo de Errores
```javascript
try {
  const data = await storiesService.getStoryById(storyId);
} catch (error) {
  error.status      // Código HTTP
  error.message     // Mensaje de error
  error.data        // Datos de respuesta del servidor
  error.original    // Error original de Axios
}
```

### Refresh de Tokens
Los tokens se actualizan automáticamente cuando expiran. La aplicación maneja:
- Detección de tokens expirados (401)
- Refresh automático usando refreshToken
- Cola de peticiones fallidas mientras se actualiza el token
- Redirección a login si la renovación falla

## Desarrollo

### Agregar Nueva Página
1. Crear archivo en `src/pages/`
2. Importar en `AppRoutes.jsx`
3. Agregar ruta usando `<Route path="/nueva-ruta" element={<NuevaPage />} />`

### Agregar Nuevo Servicio API
1. Crear `src/api/nuevoService.js`
2. Exportar en `src/api/index.js`
3. Usar en componentes: `import { nuevoService } from '@/api'`

### Agregar Componente UI
1. Crear en `src/components/ui/MiComponente.jsx`
2. Exportar en `src/components/ui/index.js`
3. Usar en cualquier página

## Testing

Ejecutar linter:
```bash
npm run lint
```

Build para producción:
```bash
npm run build
```

Preview del build:
```bash
npm run preview
```

## Notas Importantes

### Autenticación
- Los tokens se guardan en `localStorage`
- El contexto `AuthContext` proporciona el estado global de autenticación
- Usa el hook `useAuth()` en tus componentes
- Las rutas protegidas usan `ProtectedRoute`

### Usuarios No Autenticados
- Las rutas públicas son accesibles sin login
- Las páginas de autenticación redirigen a home si ya estás logueado
- Intenta acceder a rutas protegidas redirige a login

### Performance
- Los servicios usan paginación
- Las imágenes usan lazy loading
- Los componentes son memoizados cuando es necesario

## Troubleshooting

### Error: "No se pudo conectar con el servidor"
- Verifica que el backend esté corriendo en `http://localhost:8080`
- Revisa la consola del navegador para más detalles

### Error: "Token expirado"
- El token se debería renovar automáticamente
- Si no funciona, cierra sesión e ingresa de nuevo

### Estilos no se aplican
- Verifica que Tailwind CSS esté configurado correctamente
- Limpia caché del navegador (Ctrl+Shift+Delete)

## Próximos Pasos

1. Implementar chat en tiempo real (WebSockets)
2. Agregar editor de rich text
3. Implementar carga de imágenes
4. Agregar búsqueda avanzada
5. Implementar recomendaciones IA
6. Agregar notificaciones en tiempo real

## Contribuir

Para contribuir:
1. Crea una rama desde `main`
2. Haz tus cambios
3. Abre un Pull Request

## Licencia

© 2026 Escritores. Todos los derechos reservados.
