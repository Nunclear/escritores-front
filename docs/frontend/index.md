# Documentación del Frontend - Raíz de Palabras

## Descripción General

**Raíz de Palabras** es una plataforma web moderna construida con **React + Vite** que funciona como biblioteca pública, sala de lectura y estudio narrativo. El frontend se conecta a una API REST backend mediante llamadas HTTP y proporciona una experiencia editorial limpia y cálida para lectores, autores y moderadores.

## Objetivo del Frontend

El frontend actúa como cliente principal de la plataforma, permitiendo a los usuarios:

- **Lectores**: Descubrir y leer historias publicadas, dejar comentarios y calificaciones
- **Autores**: Crear, editar y publicar historias con capítulos organizados en arcos y volúmenes
- **Moderadores y Administradores**: Gestionar contenido, usuarios, reportes y mantener la plataforma

## Características Principales

- 🌐 **Interfaz editorial** limpia y responsiva
- 🔐 **Sistema de autenticación** con tokens JWT
- 📖 **Lector inmersivo** con navegación entre capítulos
- 👥 **Perfiles de autor** con estadísticas y seguimiento
- ⭐ **Sistema de favoritos y calificaciones**
- 💬 **Comentarios en hilos** con respuestas
- 🎨 **Tema oscuro/claro** integrado
- 📊 **Panel de control** para escritores y administradores
- 🛡️ **Sistema de moderación** y reportes
- 📱 **Diseño responsivo** (mobile-first)

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| React | latest | Framework frontend |
| React Router DOM | latest | Enrutamiento de cliente |
| Vite | latest | Bundler y dev server |
| Tailwind CSS | - | Estilos y diseño |
| Lucide React | latest | Iconos SVG |
| JavaScript (ES6+) | - | Lógica de la aplicación |

## Información Importante

> **Base URL API**: `http://localhost:8080/api`
>
> La URL se configura en `.env.production` mediante `VITE_API_URL`

---

## Estructura del Proyecto

El proyecto sigue una arquitectura modular y escalable:

```
escritores-front/
├── src/
│   ├── api/                    # Cliente HTTP y servicios API
│   ├── components/             # Componentes reutilizables
│   ├── context/                # Estado global (AuthContext)
│   ├── data/                   # Datos mock/estáticos
│   ├── pages/                  # Páginas/vistas principales
│   ├── styles/                 # Estilos globales
│   ├── utils/                  # Funciones auxiliares
│   ├── App.jsx                 # Configuración de rutas
│   └── main.jsx                # Punto de entrada
├── public/                     # Assets estáticos
├── docs/                       # Documentación (este directorio)
├── index.html                  # HTML principal
├── vite.config.js              # Configuración Vite
├── tailwind.config.js          # Configuración Tailwind
└── package.json                # Dependencias y scripts
```

## Próximas Secciones

En esta documentación encontrarás:

1. **Arquitectura** - Flujos de datos y diagramas del sistema
2. **Estructura** - Organización detallada de carpetas
3. **Configuración** - Setup inicial y variables de entorno
4. **Rutas** - Todas las páginas y endpoints de la aplicación
5. **Componentes** - Componentes principales reutilizables
6. **Servicios API** - Cliente HTTP y consumo de endpoints
7. **Estados** - Gestión de estado global (AuthContext)
8. **Formularios** - Validación y manejo de formularios
9. **Assets** - Recursos estáticos e imágenes
10. **Autenticación** - Flujo completo de login/registro
11. **Pruebas** - Estrategia y ejemplos de testing
12. **Ejecución Local** - Cómo ejecutar el frontend
13. **Build de Producción** - Compilación y optimizaciones
14. **Despliegue** - Opciones de deployment
15. **Errores Comunes** - Problemas y soluciones

---

## Inicio Rápido

```bash
# 1. Clonar repositorio
git clone https://github.com/Nunclear/escritores-front.git
cd escritores-front

# 2. Instalar dependencias
npm install

# 3. Configurar .env.production
cp .env.example .env.production
# Editar si es necesario

# 4. Ejecutar en desarrollo
npm run dev

# 5. Abrir en navegador
# http://localhost:5173
```

---

## Recursos

- 📚 [Documentación de Vite](https://vitejs.dev/)
- ⚛️ [Documentación de React](https://react.dev/)
- 🛣️ [React Router Documentation](https://reactrouter.com/)
- 🎨 [Tailwind CSS Docs](https://tailwindcss.com/)

---

**Versión**: 1.1.0  
**Última actualización**: 2024  
**Mantenedor**: Equipo de Desarrollo - Nunclear
