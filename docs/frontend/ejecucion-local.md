# Ejecución Local del Frontend

## Requisitos Previos

### Mínimos

- **Node.js**: v16 o superior
- **npm**: v7 o superior (o yarn/pnpm)
- **Backend**: Corriendo en `http://localhost:8080` (configurable)

### Verificar Versión

```bash
node --version    # v16.0.0 o superior
npm --version     # 7.0.0 o superior
```

---

## Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Nunclear/escritores-front.git
cd escritores-front
```

### 2. Instalar Dependencias

```bash
npm install
```

Esto instalará:
- React y React-DOM
- React Router para navegación
- Lucide React para iconos
- Vite como empaquetador
- Tailwind CSS para estilos

**Alternativas**:
```bash
yarn install      # Si usas Yarn
pnpm install      # Si usas pnpm
```

### 3. Crear Archivo de Entorno

```bash
cp .env.example .env.development.local
```

O crear manualmente `.env.development.local`:

```env
VITE_API_URL=http://localhost:8080
```

### 4. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

**Output esperado:**

```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Acceder a la Aplicación

### Local

Abrir navegador en:
```
http://localhost:5173
```

### Desde Otra Máquina en la Red

```
http://<IP_DE_LA_MÁQUINA>:5173
```

**Ejemplo:**
```
http://192.168.1.100:5173
```

---

## Configuración del Backend

### Backend Local (Por Defecto)

```env
VITE_API_URL=http://localhost:8080
```

El frontend esperará el backend en `http://localhost:8080/api`

### Backend en Otra Máquina

```env
VITE_API_URL=http://192.168.1.100:8080
```

### Backend en Producción

```env
VITE_API_URL=https://api.ejemplo.com
```

### Cambiar en Tiempo de Ejecución

```bash
VITE_API_URL=http://otro-servidor:8080 npm run dev
```

---

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con HMR |
| `npm run build` | Compila para producción |
| `npm run preview` | Previsualiza build de producción |

### npm run dev

- Inicia servidor en puerto 5173
- Hot Module Replacement (HMR) habilitado
- Cambios en código se reflejan al guardar
- Console muestra errores en tiempo real

### npm run build

```bash
npm run build
```

Genera carpeta `dist/` con:
- HTML minificado
- CSS optimizado
- JavaScript bundled
- Assets comprimidos

**Output:**

```
dist/
├── index.html
├── favicon.svg
├── assets/
│   ├── index-*.js
│   └── index-*.css
```

### npm run preview

```bash
npm run preview
```

Previsualiza la build de producción en navegador.

---

## Troubleshooting

### Puerto 5173 Ya Está en Uso

```bash
# Cambiar puerto
npm run dev -- --port 3000
```

### API No Responde (CORS Error)

**Síntoma:**
```
Access to XMLHttpRequest at 'http://localhost:8080/api/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Soluciones:**

1. Verificar que backend está corriendo:
```bash
curl http://localhost:8080/api/stories
```

2. Verificar `VITE_API_URL` en `.env.development.local`

3. Asegurarse que backend permite CORS desde `http://localhost:5173`

### Módulos No Encontrados

```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Errores de Caché

```bash
# Limpiar caché de npm
npm cache clean --force

# Limpiar caché de Vite
rm -rf .vite
```

---

## Desarrollo Eficiente

### Hot Module Replacement (HMR)

- Cambios en componentes se reflejan al guardar
- Estado de componentes se preserva (en muchos casos)
- Nada de refresco manual de página

**Ejemplo:**

```jsx
// Edita esto en StoryCard.jsx
function StoryCard() {
  return <div>Cambio aquí</div>;  // ← Guarda el archivo
}
// El cambio aparece inmediatamente en el navegador
```

### React DevTools

Para debugging avanzado:

1. Instalar extensión React DevTools del navegador
2. Abrir DevTools (F12)
3. Ir a pestaña "Components" o "Profiler"

### Ver Network Requests

1. Abrir DevTools (F12)
2. Ir a pestaña "Network"
3. Hacer acciones en la app
4. Ver las solicitudes API

**Información:**
- Request URL
- Método (GET, POST, etc.)
- Status (200, 404, 500, etc.)
- Request headers
- Response body

### Console Logs

```jsx
function MyComponent() {
  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);
}
```

Ver logs en DevTools → Console tab.

---

## Variables de Entorno

### Archivos de Entorno

```
.env                        # Base (versionado, evitar secretos)
.env.local                  # Local (no versionado)
.env.development            # Desarrollo (versionado)
.env.development.local      # Desarrollo local (no versionado)
.env.production             # Producción (versionado)
.env.production.local       # Producción local (no versionado)
```

### Prioridad

1. `.env.development.local` (máxima prioridad si exists)
2. `.env.development`
3. `.env.local`
4. `.env` (mínima prioridad)

### Acceso en Código

```jsx
// En React
const apiUrl = import.meta.env.VITE_API_URL;

// En build time
console.log(import.meta.env.DEV);      // true en dev
console.log(import.meta.env.PROD);     // true en build
```

---

## Estructura de Directorios Útiles

```
escritores-front/
├── src/
│   ├── components/        # Editar componentes aquí
│   ├── pages/            # Editar páginas aquí
│   ├── api/              # Editar servicios aquí
│   └── styles/           # Editar estilos aquí
├── public/               # Activos estáticos
├── .env.development.local # Variables de entorno (NO versionado)
├── vite.config.js        # Configuración Vite
└── package.json          # Dependencias
```

---

## Workflow Típico

```bash
# 1. Clonar y setup
git clone https://github.com/Nunclear/escritores-front.git
cd escritores-front
npm install

# 2. Crear .env
cp .env.example .env.development.local

# 3. Iniciar servidor
npm run dev

# 4. Abrir navegador
# Ir a http://localhost:5173

# 5. Editar código
# Los cambios se reflejan automáticamente

# 6. Cuando estés listo para producción
npm run build
npm run preview  # Previsualizar

# 7. Desplegar (ver doc/despliegue.md)
```

---

## Problemas Comunes

### El Backend no está corriendo

**Error:**
```
Failed to fetch

POST http://localhost:8080/api/auth/login
```

**Solución:**
1. Verificar que backend está corriendo
2. Verificar que está en puerto 8080
3. Verificar que VITE_API_URL es correcto

### Cambios no se reflejan

**Causas comunes:**
- Archivo no fue guardado
- Error de sintaxis (ver console)
- Caché del navegador (Ctrl+Shift+Supr)

**Solución:**
```bash
# Fuerza recarga del navegador
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Module not found

**Error:**
```
Cannot find module 'react'
```

**Solución:**
```bash
npm install
```

### Vite cuelga

**Solución:**
```bash
Ctrl + C                    # Detener servidor
npm run dev                 # Reiniciar
```
