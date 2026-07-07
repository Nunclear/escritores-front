# Configuración

## Variables de Entorno

### Archivo `.env.example`

```env
VITE_API_URL=http://localhost:8080
```

### Descripción de Variables

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base del backend API | `http://localhost:8080` |

### Configuración Automática

El cliente API usa `VITE_API_URL` para construir la URL base:

```js
const API_ROOT = `${VITE_API_URL}/api`
// Resultado: http://localhost:8080/api
```

## Archivo `vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',    // Accesible desde cualquier interfaz
    port: 5173          // Puerto de desarrollo
  },
  preview: {
    port: 5173          // Puerto para build preview
  }
});
```

**Configuración:**
- **plugins**: Habilita React Fast Refresh
- **server.host**: Permite acceso desde máquinas remotas (importante para Docker)
- **server.port**: Puerto de desarrollo
- **preview.port**: Puerto para previsualizar build

## Archivo `tailwind.config.js`

```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Configuración:**
- **content**: Rutas donde Tailwind buscará clases
- **theme.extend**: Extensiones de tema personalizadas
- **plugins**: Plugins adicionales de Tailwind

## Archivo `package.json`

```json
{
  "name": "raiz-de-palabras",
  "private": true,
  "version": "1.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "react": "latest",
    "react-dom": "latest",
    "react-router-dom": "latest",
    "lucide-react": "latest"
  },
  "devDependencies": {}
}
```

**Scripts:**
- `dev`: Inicia servidor de desarrollo
- `build`: Compila para producción
- `preview`: Previsualiza la build

## Archivo `.env.production`

```env
VITE_API_URL=http://localhost:8080
```

> **Nota**: En producción, reemplazar la URL con el endpoint real del backend.

## Archivo `eslint.config.js`

Configuración de linting para análisis estático del código.

```js
// Configuración de ESLint
```

## Archivo `.gitignore`

Archivos y carpetas que no se commitean:

```
node_modules/
dist/
.env.local
.env.production.local
.DS_Store
.vscode/
.idea/
```

## Punto de Entrada: `main.jsx`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

**Orden de Providers:**
1. `React.StrictMode` - Detecta problemas potenciales
2. `BrowserRouter` - Habilita routing
3. `AuthProvider` - Proporciona contexto de autenticación

## Archivo HTML Base: `index.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Raíz de Palabras</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

## Almacenamiento Local (localStorage)

El cliente API usa localStorage para persistir tokens y datos de usuario:

```js
// Claves de almacenamiento
const ACCESS_TOKEN_KEY = 'rdp_access_token';
const REFRESH_TOKEN_KEY = 'rdp_refresh_token';
const USER_KEY = 'rdp_user';
const VISITOR_KEY = 'rdp_visitor_token';
```

**Prefijo `rdp_`**: Raíz de Palabras

## Versiones de Dependencias

| Dependencia | Versión |
|-------------|---------|
| React | latest |
| React DOM | latest |
| React Router DOM | latest |
| Vite | latest |
| Tailwind CSS | latest (v3+) |
| Lucide React | latest |

> **Nota**: Se usa "latest" para mantener actualización automática. En producción se recomienda fijar versiones específicas.

## Configuración de Desarrollo Local

### Requisitos Previos

- Node.js 16+
- npm o yarn
- Backend corriendo en `http://localhost:8080`

### Setup Inicial

```bash
# 1. Clonar repositorio
git clone https://github.com/Nunclear/escritores-front.git
cd escritores-front

# 2. Instalar dependencias
npm install

# 3. Copiar archivo de entorno
cp .env.example .env.local

# 4. Iniciar servidor de desarrollo
npm run dev
```

### Acceso

- Local: `http://localhost:5173`
- Remoto: `http://<IP_MÁQUINA>:5173`

## Configuración para Docker

Ver archivo `Dockerfile` y `nginx.conf` para despliegue containerizado.

## Configuración de CI/CD

Ver archivo `Jenkinsfile` para pipeline de integración continua.
