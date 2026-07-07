# Assets y Recursos Estáticos

## Ubicación

```
public/
├── favicon.svg          # Icono del sitio
├── icons.svg            # Sprite de iconos
└── image.png            # Imagen de ejemplo
```

---

## Favicon

### Archivo: `public/favicon.svg`

```svg
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="#8b5e3c" />
  <text x="50" y="60" font-size="60" font-weight="bold" 
        fill="white" text-anchor="middle">R</text>
</svg>
```

### Referencia en HTML

```html
<!-- index.html -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

---

## Iconos

### Ubicación: `public/icons.svg`

SVG sprite con todos los iconos de la aplicación.

**Uso:**
```jsx
<svg className="icon">
  <use href="/icons.svg#icon-name" />
</svg>
```

### Iconografía Actual

La app usa **Lucide React** para iconos:

```jsx
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Bookmark,
  User,
  Settings,
  Menu,
  Search,
  ChevronDown
} from 'lucide-react';

<Heart size={20} />
<MessageCircle size={20} />
```

---

## Imágenes

### Ubicación de Imágenes

```
public/
├── image.png            # Imagen estática

src/
└── (No guardar imágenes en src/)
```

### Mejores Prácticas

**✅ Hacer:**
- Guardar en `public/`
- Usar formatos: PNG, JPG, WebP
- Referenciar con `/ruta/imagen.png`
- Optimizar antes de subir

**❌ No Hacer:**
- Base64 inline (aumenta bundle)
- Imágenes grandes sin comprimir
- Rutas relativas (`./image.png`)

### Optimización

```bash
# Convertir a WebP
ffmpeg -i image.png -c:v libwebp image.webp

# O usar herramienta online
# https://tinypng.com/
```

### Uso en Componentes

```jsx
// ✅ Correcto
<img src="/image.png" alt="Descripción" />

// ✅ Con responsive
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.png" alt="Descripción" />
</picture>

// ❌ Incorrecto - ruta relativa
<img src="./image.png" alt="Descripción" />
```

---

## Tipografías

### Fuentes Usadas

Definidas en `src/styles/global.css`:

```css
:root {
  --font-title: 'Lora', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
}
```

**Lora**: Serif elegante para títulos  
**DM Sans**: Sans-serif moderno para body

### Aplicación

```jsx
// En CSS
.title { font-family: var(--font-title); }
.body { font-family: var(--font-body); }

// O con Tailwind
<h1 className="font-serif">Título</h1>
<p className="font-sans">Body text</p>
```

### Carga de Fuentes

> Pendiente de completar según configuración de Google Fonts

---

## Archivos Estáticos en Build

### Durante Build

```bash
npm run build
```

Genera:

```
dist/
├── index.html
├── assets/
│   ├── index-{hash}.js
│   ├── index-{hash}.css
│   └── ... (otros assets)
├── favicon.svg           ← Copiado desde public/
├── icons.svg             ← Copiado desde public/
├── image.png             ← Copiado desde public/
└── vite.svg              ← Vite default
```

---

## Caching de Assets

### Headers Recomendados (nginx)

```nginx
# Assets con hash - cache largo
location ~* \.(?:js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Imágenes - cache moderado
location ~* \.(?:png|jpg|jpeg|gif|webp|svg)$ {
    expires 30d;
    add_header Cache-Control "public";
}

# HTML - no cachear
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

---

## Tamaños Recomendados

```
Imágenes:
├── Portadas de historias: 800x1200px (1-2 MB)
├── Avatares de usuarios: 200x200px (<100 KB)
├── Banner/Hero: 1400x400px (1-2 MB)
└── Thumbnails: 300x400px (<300 KB)

General:
├── Total assets: < 5 MB
├── JavaScript: < 150 KB (gzipped: < 50 KB)
├── CSS: < 50 KB (gzipped: < 15 KB)
└── Images: < 4 MB total
```

---

## Media Queries para Imágenes

```css
/* Escritorio */
@media (min-width: 980px) {
  .hero-image {
    width: 100%;
    height: 400px;
  }
}

/* Tablet */
@media (max-width: 980px) {
  .hero-image {
    width: 100%;
    height: 300px;
  }
}

/* Mobile */
@media (max-width: 650px) {
  .hero-image {
    width: 100%;
    height: 200px;
  }
}
```

---

**Última actualización**: Enero 2024
