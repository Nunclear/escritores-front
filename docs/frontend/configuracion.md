# Configuración del Frontend

## Variables de Entorno

### Archivo `.env.production`

```env
VITE_API_URL=http://localhost:8080
```

**Explicación:**
- `VITE_API_URL` - URL base del backend REST
- El cliente automáticamente usa `{VITE_API_URL}/api` como base

**Acceso en código:**
```javascript
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

### Almacenamiento Local (localStorage)

El cliente usa `localStorage` para guardar:

```javascript
// Claves de almacenamiento
'rdp_access_token'      // JWT token de acceso
'rdp_refresh_token'     // JWT token de refresco
'rdp_user'              // Datos del usuario JSON
'rdp_visitor_token'     // Token anónimo para visitas
```

**Gestión:**
```javascript
import { storage } from './api/client';

storage.getAccessToken()   // Obtiene token
storage.setAccessToken()   // Guarda token
storage.clear()            // Limpia todo
```

---

## Vite Configuration

### vite.config.js

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],           // Plugin de React
  server: {
    host: '0.0.0.0',           // Accesible desde red
    port: 5173                 // Puerto de desarrollo
  },
  preview: {
    port: 5173                 // Puerto para preview
  }
});
```

**Configuración:**
- **Host**: `0.0.0.0` permite acceder desde otros dispositivos
- **Port**: 5173 es el puerto estándar de Vite
- **Hot Module Replacement**: Activado por defecto

---

## Tailwind CSS

### tailwind.config.js

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Configuración:**
- **content** - Archivos a procesar
- **theme.extend** - Extender tema por defecto
- **plugins** - Plugins adicionales

### Variables CSS (global.css)

```css
:root {
  /* Colores Tema Claro */
  --bg: #f5f0e8;                    /* Fondo principal */
  --surface: #fffefb;               /* Superficie cards */
  --surface-2: #faf6ef;             /* Superficie secundaria */
  --text: #1e1a16;                  /* Texto principal */
  --muted: #7a7168;                 /* Texto muted */
  
  /* Colores de Marca */
  --coffee: #8b5e3c;                /* Color primario (café) */
  --sand: #c49a6c;                  /* Color secundario */
  --soft: #f2e8d9;                  /* Fondo soft */
  
  /* Colores de Estado */
  --green: #3a6b4a;                 /* Éxito */
  --wine: #8b3a3a;                  /* Error/Peligro */
  --blue: #3a5a8b;                  /* Info */
  --gold: #8b7a3a;                  /* Destacado */
  
  /* Sombras y Utilidades */
  --line: rgba(139, 94, 60, .18);   /* Bordes */
  --shadow: 0 24px 70px rgba(74, 48, 28, .12);
  --shadow-soft: 0 14px 34px rgba(74, 48, 28, .09);
  --radius-xl: 34px;
  --radius-lg: 24px;
  
  /* Tipografía */
  --font-title: 'Lora', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
}

:root[data-theme='dark'] {
  /* Tema oscuro - Variables sobrescritas */
  --bg: #17130f;
  --surface: #211b16;
  --surface-2: #2a211a;
  --text: #f7efe4;
  --muted: #c3b5a8;
  --coffee: #d0a06e;
  --sand: #c49a6c;
  --soft: #33271e;
  --green: #85b890;
  --wine: #d18080;
  --blue: #8ea9d8;
  --gold: #d1bd65;
  --line: rgba(242, 232, 217, .14);
  --shadow: 0 28px 80px rgba(0, 0, 0, .34);
  --shadow-soft: 0 16px 36px rgba(0, 0, 0, .24);
}
```

**Uso en componentes:**
```jsx
<div className="bg-surface text-text rounded-lg shadow-soft">
  Contenido
</div>

// En CSS
background: var(--surface);
color: var(--text);
border-radius: var(--radius-lg);
```

---

## package.json

### Scripts Disponibles

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0",        // Desarrollo local
    "build": "vite build",               // Build producción
    "preview": "vite preview --host 0.0.0.0"  // Preview local
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "react": "latest",
    "react-dom": "latest",
    "react-router-dom": "latest",
    "lucide-react": "latest"
  }
}
```

### Ejecutar Scripts

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Compila para producción
npm run preview  # Vista previa de build
```

---

## Estructura de Estilos Globales

### global.css - Secciones

```css
/* 1. Variables de tema */
:root { ... }
:root[data-theme='dark'] { ... }

/* 2. Reset y estilos base */
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { ... }

/* 3. Componentes globales */
.app-shell { ... }
.site-header { ... }
.btn { ... }
.page { ... }

/* 4. Layouts específicos */
.home-hero { ... }
.feed-layout { ... }
.story-cover-hero { ... }

/* 5. Componentes reutilizables */
.story-card { ... }
.comments-section { ... }
.rating-box { ... }

/* 6. Media queries (responsive) */
@media (max-width: 980px) { ... }
@media (max-width: 650px) { ... }
```

---

## Temas (Dark/Light)

### Activación

```javascript
// En Header.jsx o ThemeToggle.jsx
const toggleTheme = () => {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};
```

### Aplicación

```html
<!-- Al cargar la página -->
<html data-theme="light">
<!-- o -->
<html data-theme="dark">
```

---

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true
  }
}
```

> Proyecto actual usa JavaScript, pero TypeScript está configurado para futuro upgrade

---

## ESLint Configuration

### eslint.config.js

Configuración de linting para mantener código consistente.

**Reglas comunes:**
- Indentación consistente
- No variables no usadas
- Punto y coma al final
- Nombres descriptivos

---

## Ports y URLs

### Desarrollo Local

| Servicio | URL | Puerto |
|---|---|---|
| Frontend | http://localhost:5173 | 5173 |
| Backend API | http://localhost:8080/api | 8080 |
| Acceso de red | http://0.0.0.0:5173 | 5173 |

### Conectar desde Otro Dispositivo

```bash
# Obtener IP local
ipconfig getifaddr en0  # macOS
hostname -I             # Linux
ipconfig                # Windows

# Acceder desde otro dispositivo
http://{TU_IP}:5173
```

---

## Configuración de Producción

### Build Optimizado

```bash
npm run build
```

Genera: `dist/`

**Optimizaciones incluidas:**
- Minificación de código
- Code splitting
- Asset compression
- Tree shaking

### Archivos Generados

```
dist/
├── index.html
├── assets/
│   ├── index-{hash}.js      # JavaScript bundled
│   ├── index-{hash}.css     # CSS minificado
│   └── {assets}             # Imágenes, fuentes
└── vite.svg
```

---

## Nginx Configuration

### nginx.conf

Para deployment en servidor:

```nginx
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://backend:8080;
    }
}
```

---

## Docker

### Dockerfile

Para containerizar:

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build y run:**
```bash
docker build -t escritores-front .
docker run -p 80:80 escritores-front
```

---

## Seguridad

### Headers Recomendados

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
```

### Token de Acceso

- Almacenado en localStorage (no en cookies HttpOnly)
- Se envía en header `Authorization: Bearer {token}`
- Se refresca automáticamente al expirar (401)

---

## Performance

### Métricas Recomendadas

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Optimizaciones Aplicadas

- ✅ Code splitting automático (Vite)
- ✅ Lazy loading de componentes
- ✅ Image optimization
- ✅ CSS minificado
- ✅ Browser caching

---

**Última actualización**: Enero 2024
