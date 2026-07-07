# Documentación - Frontend Raíz de Palabras

## Descripción General

**Raíz de Palabras** es una plataforma frontend moderna desarrollada con **React 18** y **Vite** que funciona como biblioteca pública, sala de lectura y estudio narrativo. El frontend se conecta a un **API REST backend** para proporcionar una experiencia completa de lectura y escritura colaborativa.

La aplicación está diseñada para escritores, lectores y moderadores, ofreciendo funcionalidades desde la lectura pública de historias hasta la gestión avanzada de contenido con worldbuilding (personajes, eventos, habilidades), comentarios, calificaciones, moderación y más.

## Objetivo del Frontend

El frontend actúa como interfaz de usuario para:

1. **Lectores Anónimos**: Explorar, buscar y leer historias publicadas públicamente
2. **Escritores Autenticados**: Crear, editar, publicar y gestionar historias con capítulos, arcos y volúmenes
3. **Constructores de Mundos**: Gestionar personajes, eventos, objetos, habilidades e ideas relacionadas
4. **Moderadores**: Revisar reportes, gestionar sanciones, ocultar comentarios problemáticos
5. **Administradores**: Supervisar el sistema, gestionar usuarios, emitir comunicados globales

## Información Rápida

| Aspecto | Detalle |
|---|---|
| **Proyecto** | Raíz de Palabras (v1.1.0) |
| **Framework** | React 18+ |
| **Empaquetador** | Vite (última versión) |
| **Enrutador** | React Router DOM (última versión) |
| **Estilos** | Tailwind CSS v3 |
| **Iconografía** | Lucide React |
| **Cliente HTTP** | Fetch API + Interceptores personalizados |
| **Persistencia** | LocalStorage (tokens) + AuthContext (estado) |
| **Puerto de Desarrollo** | 5173 |
| **URL API (default)** | http://localhost:8080 |
| **Repositorio** | Nunclear/escritores-front |

## Tecnologías Principales

```json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-router-dom": "latest",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "vite": "latest",
    "@vitejs/plugin-react": "latest"
  },
  "styles": "Tailwind CSS v3"
}
```

## Estructura de Documentación

Esta documentación se organiza en los siguientes documentos:

- **[Arquitectura](arquitectura.md)** - Diagrama de flujo de datos, patrones y decisiones técnicas
- **[Estructura del Proyecto](estructura.md)** - Organización de carpetas y convenciones
- **[Configuración](configuracion.md)** - Variables de entorno y archivos de configuración
- **[Rutas y Navegación](rutas.md)** - Todas las rutas disponibles y niveles de acceso
- **[Componentes](componentes.md)** - Catálogo de componentes reutilizables
- **[Servicios API](servicios-api.md)** - Documentación de métodos y endpoints
- **[Gestión de Estados](estados.md)** - AuthContext y manejo de estado global
- **[Formularios y Validación](formularios.md)** - Patrones de formularios
- **[Rendering de Datos e Imágenes](assets.md)** - Manejo de assets estáticos
- **[Autenticación](autenticacion.md)** - Sistema de tokens JWT
- **[Pruebas](pruebas.md)** - Estrategia de testing
- **[Ejecución Local](ejecucion-local.md)** - Setup de desarrollo
- **[Build de Producción](build-produccion.md)** - Proceso de build
- **[Despliegue](despliegue.md)** - Estrategias de deployment
- **[Errores Comunes](errores-comunes.md)** - Troubleshooting

## Diagrama de Flujo General

```mermaid
flowchart TB
    User["👤 Usuario"]
    Frontend["🖥️ React App<br/>5173"]
    Router["🛣️ React Router<br/>38+ rutas"]
    Auth["🔐 AuthContext<br/>JWT + Tokens"]
    Pages["📄 Páginas"]
    Components["⚙️ Componentes"]
    Services["🔌 Servicios API"]
    Backend["🗄️ Backend REST<br/>8080/api"]
    Database["💾 Base de Datos"]
    
    User -->|Navega| Frontend
    Frontend -->|Rutea| Router
    Router -->|Protege| Auth
    Router -->|Renderiza| Pages
    Pages -->|Compone| Components
    Components -->|Llama| Services
    Auth -->|Token Bearer| Services
    Services -->|HTTP/REST| Backend
    Backend -->|Queries| Database
    
    style User fill:#e1f5ff
    style Frontend fill:#fff3e0
    style Router fill:#f3e5f5
    style Auth fill:#ffe0b2
    style Pages fill:#e8f5e9
    style Components fill:#fce4ec
    style Services fill:#fff9c4
    style Backend fill:#f1f8e9
    style Database fill:#eceff1
