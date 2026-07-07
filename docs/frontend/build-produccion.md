# Build para Producción

## Crear Build

### Comando

```bash
npm run build
```

### Proceso

1. **Compila** archivos React/JSX
2. **Minifica** JavaScript y CSS
3. **Tree shaking** - Elimina código no usado
4. **Code splitting** - Divide en chunks
5. **Comprime** assets
6. **Genera** sourcemaps (opcional)

### Salida Esperada

```
✓ 42 modules transformed.

dist/index.html                   0.89 kB │ gzip:   0.41 kB
dist/assets/index-a1b2c3d4.js   125.45 kB │ gzip:  38.12 kB
dist/assets/index-e5f6g7h8.css    8.25 kB │ gzip:   2.15 kB

✓ built in 12.34s
```

---

## Archivos Generados

### Estructura de `dist/`

```
dist/
├── index.html              # Archivo HTML principal
├── assets/
│   ├── index-{hash}.js    # JavaScript bundled
│   ├── index-{hash}.css   # CSS minificado
│   └── vendor-{hash}.js   # Dependencias externas
└── vite.svg               # Assets copiados
```

### Tamaños Esperados

```
JavaScript total: ~125 KB (gzipped: ~38 KB)
CSS total: ~8 KB (gzipped: ~2 KB)
HTML: <1 KB
```

---

## Optimizaciones Automáticas

### 1. Minificación

**Antes:**
```javascript
function sayHello(name) {
  const greeting = `Hola, ${name}`;
  console.log(greeting);
  return greeting;
}
```

**Después:**
```javascript
function t(n){const e=`Hola, ${n}`;return console.log(e),e}
```

### 2. Tree Shaking

```javascript
// helpers.js
export function usedFunction() { ... }
export function unusedFunction() { ... }

// app.js
import { usedFunction } from './helpers.js';

// Build: solo incluye usedFunction
```

### 3. Code Splitting

```
index-abc123.js      (50 KB) - Core app
vendor-def456.js     (60 KB) - React, Router
component-ghi789.js  (15 KB) - Componente grande (lazy)
```

### 4. Compresión

- **Gzip** comprime 50-80% en servidor
- **Brotli** comprime 15-20% más que Gzip

---

## Configuración de Build

### vite.config.js

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  build: {
    // Carpeta de salida
    outDir: 'dist',
    
    // Limpiar outDir antes de build
    emptyOutDir: true,
    
    // Umbral de tamaño para warnings
    chunkSizeWarningLimit: 500,
    
    // Minificación
    minify: 'terser',
    
    // Sourcemaps (para debugging)
    sourcemap: false,  // true en desarrollo
    
    // Assets
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
    
    // Rollup options
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'lucide': ['lucide-react']
        }
      }
    }
  }
});
```

---

## Análisis del Build

### Ver Tamaño de Chunks

```bash
npm install -D rollup-plugin-visualizer
```

Agregar a `vite.config.js`:

```javascript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer()
  ]
});
```

Luego:
```bash
npm run build
```

Se genera `stats.html` con gráfica interactiva de tamaños.

### Identificar Módulos Grandes

```bash
npm ls --depth=0
```

Muestra dependencias principales por tamaño.

---

## Optimizaciones Adicionales

### 1. Lazy Loading de Componentes

```jsx
import { lazy, Suspense } from 'react';

const WriterPanel = lazy(() => import('./pages/WriterPanel'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/escritor" element={<WriterPanel />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Suspense>
  );
}
```

### 2. Importar Solo lo Necesario

```javascript
// ❌ Importa todo lucide-react
import * as Icons from 'lucide-react';

// ✅ Importa solo lo que necesitas
import { Heart, MessageCircle, Share2 } from 'lucide-react';
```

### 3. Eliminar Imports No Usados

Usar ESLint con `no-unused-vars`:

```bash
npm install --save-dev eslint
npx eslint src/
```

### 4. Optimizar Imágenes

```jsx
// Usar WebP cuando sea posible
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.png" alt="..." />
</picture>
```

---

## Pruebas Locales del Build

### 1. Compilar

```bash
npm run build
```

### 2. Previsualizar Localmente

```bash
npm run preview
```

Se abre en `http://localhost:4173`

### 3. Verificar en Navegador

- Todos los links funcionan
- API calls funcionan
- Estilos se ven correctos
- No hay errores en console

---

## Configuración del Servidor

### nginx

```nginx
server {
    listen 80;
    server_name example.com;
    
    root /var/www/escritores-front/dist;
    
    index index.html;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Assets estáticos - Cache agresivo
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy (si en mismo servidor)
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Authorization $http_authorization;
        proxy_pass_header Authorization;
    }
}
```

### Apache

```apache
<VirtualHost *:80>
    ServerName example.com
    DocumentRoot /var/www/escritores-front/dist
    
    # SPA routing
    <Directory /var/www/escritores-front/dist>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Cache
    <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js)$">
        Header set Cache-Control "max-age=2592000, public"
    </FilesMatch>
</VirtualHost>
```

---

## Verificación de Calidad

### Checklist Pre-Producción

- [ ] No hay console.errors
- [ ] No hay console.warnings
- [ ] Mobile responsive funciona
- [ ] API calls exitosas
- [ ] Login/Logout funciona
- [ ] Performance aceptable
- [ ] Accesibilidad compliant
- [ ] SEO tags presentes

### Performance Target

| Métrica | Target |
|---|---|
| FCP (First Contentful Paint) | < 1.8s |
| LCP (Largest Contentful Paint) | < 2.5s |
| TTI (Time to Interactive) | < 3.8s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| FID (First Input Delay) | < 100ms |

### Testear Performance

```bash
npm install -g lighthouse

lighthouse https://example.com --view
```

---

## CI/CD

### GitHub Actions

Crear `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        run: |
          # Comando de deploy personalizado
          # Ej: scp, rsync, docker push, etc.
```

---

## Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build y Run

```bash
# Build imagen
docker build -t escritores-front:latest .

# Run contenedor
docker run -p 80:80 escritores-front:latest

# Acceder
# http://localhost
```

### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      VITE_API_URL: http://backend:8080
  
  backend:
    image: backend:latest
    ports:
      - "8080:8080"
```

```bash
docker-compose up
```

---

## Monitoreo

### Herramientas Recomendadas

- **Sentry** - Error tracking
- **DataDog** - Performance monitoring
- **LogRocket** - Session replay
- **Google Analytics** - Usage analytics

### Integración Básica con Sentry

```jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

export default Sentry.withProfiler(App);
```

---

**Última actualización**: Enero 2024
