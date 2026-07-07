# Documentación - Frontend Raíz de Palabras

## Descripción General

**Raíz de Palabras** es una plataforma frontend moderna desarrollada con **React** y **Vite** que funciona como biblioteca pública, sala de lectura y estudio narrativo. El frontend se conecta a un API REST backend para proporcionar una experiencia completa de lectura y escritura colaborativa.

La aplicación está diseñada para escritores, lectores y moderadores, ofreciendo funcionalidades desde la lectura pública de historias hasta la gestión avanzada de contenido con worldbuilding (personajes, eventos, habilidades), comentarios, calificaciones y más.

## Objetivo del Frontend

El frontend actúa como interfaz de usuario para:

1. **Lectores**: Explorar, buscar y leer historias publicadas públicamente
2. **Escritores**: Crear, editar y publicar historias con soporte para capítulos, arcos y volúmenes
3. **Constructores de Mundos**: Gestionar personajes, eventos, objetos y habilidades relacionados con sus historias
4. **Moderadores**: Revisar reportes, gestionar sanciones y comentarios problemáticos
5. **Administradores**: Supervisar el sistema, gestionar usuarios y emisión de comunicados globales

## Información Rápida

| Aspecto | Detalle |
|---|---|
| **Proyecto** | Raíz de Palabras (v1.1.0) |
| **Framework** | React 18+ |
| **Empaquetador** | Vite (última versión) |
| **Enrutador** | React Router DOM |
| **Estilos** | Tailwind CSS |
| **Iconos** | Lucide React |
| **Puerto de Desarrollo** | 5173 |
| **Puerto Backend (por defecto)** | 8080 |
| **Repositorio** | Nunclear/escritores-front |

## Estructura de Documentación

Esta documentación se organiza en los siguientes documentos:

- **[Arquitectura](arquitectura.md)** - Diagrama de flujo de datos y componentes del sistema
- **[Estructura del Proyecto](estructura.md)** - Organización de carpetas y archivos
- **[Configuración](configuracion.md)** - Variables de entorno, archivos de configuración y setup inicial
- **[Rutas y Navegación](rutas.md)** - Todas las rutas disponibles, sus parámetros y niveles de acceso
- **[Componentes](componentes.md)** - Catálogo de componentes reutilizables del frontend
- **[Servicios API](servicios-api.md)** - Documentación de llamadas API y servicios
- **[Gestión de Estados](estados.md)** - Contextos y manejo de estado global
- **[Formularios y Validación](formularios.md)** - Patrones de formularios y validaciones
- **[Rendering de Datos e Imágenes](assets.md)** - Cómo se renderizan datos y se manejan activos estáticos
- **[Autenticación](autenticacion.md)** - Sistema de autenticación con tokens JWT
- **[Pruebas](pruebas.md)** - Información sobre testing (si está configurado)
- **[Ejecución Local](ejecucion-local.md)** - Cómo levantar el proyecto localmente
- **[Build de Producción](build-produccion.md)** - Proceso de build para producción
- **[Despliegue](despliegue.md)** - Instrucciones de despliegue
- **[Errores Comunes](errores-comunes.md)** - Problemas frecuentes y soluciones

## Diagrama de Flujo General

```mermaid
flowchart LR
    Usuario["👤 Usuario"] --> Frontend["🖥️ Frontend React"]
    Frontend --> Router["🛣️ React Router"]
    Router --> Pages["📄 Páginas"]
    Pages --> Components["⚙️ Componentes"]
    Components --> Auth["🔐 AuthContext"]
    Auth --> Services["🔌 Servicios API"]
    Services --> Backend["🗄️ Backend REST"]
    Backend --> Database["💾 Database"]
    
    style Usuario fill:#e1f5ff
    style Frontend fill:#fff3e0
    style Router fill:#f3e5f5
    style Pages fill:#e8f5e9
    style Components fill:#fce4ec
    style Services fill:#fff9c4
    style Backend fill:#f1f8e9
    style Database fill:#eceff1
