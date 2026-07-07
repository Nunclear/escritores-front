# Build de Producción

## Proceso de Build

### Comando

```bash
npm run build
```

### Qué Hace

1. **Compila React JSX → JavaScript**
2. **Minifica código** (reduce tamaño)
3. **Optimiza CSS** (elimina código no usado)
4. **Genera hash en nombres** (cache busting)
5. **Compila TypeScript** (si aplica)
6. **Genera sourcemaps** (para debugging)
7. **Crea carpeta `dist/`** (lista para despliegue)

### Output Esperado

```
vite v5.0.0 building for production...
✓ 1234 modules transformed.
dist/index.html                   0.45 kB │ gzip:   0.30 kB
dist/assets/index-ABC123.js       234.56 kB │ gzip:  78.45 kB
dist/assets/index-DEF456.css      12.34 kB │ gzip:   2.34 kB
dist/favicon.svg                  0.50 kB

✓ built in 12.34s
```

---

## Estructura de Build

```
dist/
├── index.html                    # Archivo HTML principal
├── favicon.svg                   # Icono del sitio
├── assets/
│   ├── index-ABC123.js          # JavaScript bundled
│   ├── index-DEF456.css         # CSS bundled
│   ├── vendor-XYZ789.js         # Librerías externas
│   └── [otros assets]
└── .vite/
    └── manifest.json            # Manifest para SSR (si aplica)
```

---

## Optimizaciones Automáticas

### 1. Code Splitting

Vite divide el código automáticamente:

```
dist/assets/
├── index-main.js        # Código principal
├── vendor-libs.js       # React, Router, etc.
└── chunk-details.js     # Lazy-loaded
```

**Ventaja**: Navegador carga solo lo necesario

### 2. Tree Shaking

Elimina código no utilizado:

```js
// Original
import { functionA, functionB } from './utils';
export { functionA };  // functionB se elimina

// Build generado
// Solo functionA es incluida
```

### 3. Asset Optimization

- Imágenes: Comprime automáticamente
- SVG: Inline en pequeños, reference en grandes
- CSS: Minifica y purga estilos no usados

---

## Configuración de Build

### vite.config.js (Actual)

```js
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  preview: {
    port: 5173
  }
});
```

### Configuración Personalizada (Opcional)

```js
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'ES2020',           // Target JS version
    minify: 'terser',           // Minifier
    sourcemap: false,           // No sourcemaps en prod
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
```

---

## Testear Build Localmente

### Método 1: npm run preview

```bash
npm run build       # Compila
npm run preview     # Previsualiza en puerto 5173
```

Acceder a `http://localhost:5173`

### Método 2: Servidor Local

```bash
cd dist
python -m http.server 8000  # Sirve en localhost:8000
# o
npx http-server                # Sirve en localhost:8080
```

### Verificar en DevTools

1. Abrir DevTools (F12)
2. Ir a Network tab
3. Cargar página
4. Verificar que archivos están minificados
5. Tamaño total < 500KB es bueno

---

## Variables de Entorno en Producción

### Archivo .env.production

```env
VITE_API_URL=https://api.ejemplo.com
```

### Build con Variables Personalizadas

```bash
VITE_API_URL=https://api.prod.com npm run build
```

### En el Código

```jsx
// En build de producción
const apiUrl = import.meta.env.VITE_API_URL;
// = "https://api.ejemplo.com"
```

---

## Análisis de Bundle

### Ver Tamaño de Bundle

```bash
npm install -g vite-plugin-visualizer
```

Luego en `vite.config.js`:

```js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    react(),
    visualizer()
  ]
};
```

Ejecutar:

```bash
npm run build
```

Se genera `stats.html` que muestra visualización del bundle.

---

## Optimizaciones Avanzadas

### 1. Lazy Loading de Rutas

```jsx
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <Suspense fallback={<Loading />}>
          <Home />
        </Suspense>
      } />
      <Route path="/dashboard" element={
        <Suspense fallback={<Loading />}>
          <Dashboard />
        </Suspense>
      } />
    </Routes>
  );
}
```

**Resultado**: Cada página se carga bajo demanda

### 2. Image Optimization

```jsx
// Usar formato webp con fallback
<img
  srcSet="
    /image.webp 1x,
    /image-2x.webp 2x
  "
  src="/image.jpg"
  alt="description"
/>
```

### 3. Minificación CSS

Tailwind CSS ya lo hace automáticamente:

```css
/* Antes */
.bg-blue-500 { background: #3b82f6; }
.text-white { color: white; }

/* Después - solo si se usa */
/* Classes no utilizadas se eliminan */
```

---

## Checklist Pre-Producción

- [ ] Compilar sin errores: `npm run build`
- [ ] Previsualizar sin errores: `npm run preview`
- [ ] Verificar variables de entorno en `.env.production`
- [ ] Revisar Network tab en DevTools (tamaño, tipos)
- [ ] Probar en navegadores principales
- [ ] Verificar performance con Lighthouse
- [ ] Revisar console para warnings
- [ ] Verificar que rutas privadas están protegidas
- [ ] Probar flujo de login/logout
- [ ] Revisar que API URLs son correctas

---

## Performance Metrics

### Bueno

- **Bundle Size**: < 500 KB
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Excelente

- **Bundle Size**: < 250 KB
- **LCP**: < 1.5s
- **FID**: < 50ms
- **CLS**: < 0.05

### Medir con Lighthouse

1. Abrir DevTools (F12)
2. Ir a pestaña Lighthouse
3. Click "Analyze page load"
4. Esperar a que termine
5. Revisar scores

---

## Tamaño Aproximado de Dependencias

| Librería | Tamaño Minificado |
|----------|-------------------|
| React | ~42 KB |
| React-DOM | ~128 KB |
| React-Router | ~45 KB |
| Lucide-React | ~40 KB |
| **Total** | **~255 KB** |

Después de minificación y gzip: ~80-100 KB

---

## Troubleshooting de Build

### Error: Out of Memory

```bash
node --max-old-space-size=4096 ./node_modules/vite/bin/vite.mjs build
```

### Build genera archivos muy grandes

**Causa**: Tree shaking no funciona

**Solución**:
```js
// ❌ Evitar
import * as utils from './utils';

// ✅ Hacer
import { specificFunction } from './utils';
```

### Sourcemaps no generados

```js
build: {
  sourcemap: true  // En vite.config.js
}
```

---

## Próximos Pasos

Ver `docs/frontend/despliegue.md` para instrucc iones de despliegue.
