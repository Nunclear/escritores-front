# Ejecución Local del Frontend

## Requisitos Previos

### Sistema

- Node.js 16+ (recomendado 18+)
- npm o yarn o pnpm
- Git
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

### Verificar Instalación

```bash
node --version      # v18.x.x o superior
npm --version       # 9.x.x o superior
git --version       # Cualquier versión reciente
```

---

## Instalación

### 1. Clonar Repositorio

```bash
git clone https://github.com/Nunclear/escritores-front.git
cd escritores-front
```

### 2. Instalar Dependencias

```bash
npm install
```

**Primera ejecución puede tardar 2-5 minutos.**

Verifica que se instalaron correctamente:

```bash
npm list react react-router-dom vite
```

---

## Configuración del Entorno

### Crear Archivo .env.production

```bash
cp .env.example .env.production
```

### Editar Variables

```env
VITE_API_URL=http://localhost:8080
```

**Notas:**
- No terminar URL con `/`
- El cliente automáticamente agrega `/api`

---

## Ejecutar en Desarrollo

### Comando

```bash
npm run dev
```

### Salida Esperada

```
VITE v4.x.x  build 2024-01-15

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

### Acceder

Abre en navegador: **http://localhost:5173**

---

## Acceder desde Otro Dispositivo

### Obtener IP Local

**macOS:**
```bash
ipconfig getifaddr en0
```

**Linux:**
```bash
hostname -I
```

**Windows:**
```bash
ipconfig
```

### Acceder desde Otro Dispositivo

```
http://{TU_IP}:5173
```

Ejemplo: `http://192.168.1.100:5173`

---

## Hot Module Replacement (HMR)

Los cambios en archivos se reflejan automáticamente:

1. Edita un archivo (ej: `src/pages/Home.jsx`)
2. Guarda (Ctrl+S / Cmd+S)
3. El navegador se actualiza automáticamente
4. El estado de la app se preserva (en la mayoría de casos)

**Si la app no se actualiza:**
- Actualiza manualmente (F5 o Cmd+R)
- Revisa la consola del navegador para errores

---

## Problemas Comunes

### Error: "ENOENT: no such file or directory"

```
Error: ENOENT: no such file or directory, open '.env.production'
```

**Solución:**
```bash
cp .env.example .env.production
```

### Error: "Cannot find module 'react'"

**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Error: "Port 5173 already in use"

```
error when starting dev server:
Error: listen EADDRINUSE: address already in use :::5173
```

**Soluciones:**

Opción 1: Matar proceso en el puerto
```bash
# macOS/Linux
lsof -i :5173
kill -9 <PID>

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

Opción 2: Usar puerto diferente
```bash
# Editar vite.config.js
server: {
  port: 5174  // O cualquier otro puerto
}
```

### Error: "Cannot connect to API"

```
Error: Failed to fetch
```

**Posibles causas:**
1. Backend no está corriendo
2. VITE_API_URL es incorrecto
3. CORS bloqueado

**Soluciones:**
1. Asegúrate que backend corre en `http://localhost:8080`
2. Verifica `.env.production`
3. Revisa la consola del navegador (pestaña Network)

---

## Desarrollo con DevTools

### React DevTools

Descarga la extensión:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Firefox](https://addons.mozilla.org/firefox/addon/react-devtools)

**Uso:**
1. Abre DevTools (F12)
2. Pestaña "Components"
3. Inspecciona componentes, props, estado

### Vite DevTools

Abierto por defecto en desarrollo.

### Network Tab

Para debuggear requests API:
1. F12 → Pestaña "Network"
2. Realiza una acción (buscar, guardar)
3. Ver request/response completo

---

## Debugging

### Console Logs

```jsx
useEffect(() => {
  console.log('[v0] Loading:', loading);
  console.log('[v0] Stories:', stories);
}, [loading, stories]);
```

### Punto de Quiebre

En DevTools:
1. Abre el archivo en la pestaña "Sources"
2. Click en número de línea para agregar breakpoint
3. Recarga (F5)
4. Pausa en el breakpoint

### Inspeccionar API Calls

En "Network" tab:
1. Click en request de API
2. Ver headers, payload, response
3. Copiar como curl para probar en terminal

---

## Tareas Útiles de npm

### Listar scripts disponibles

```bash
npm run
```

Muestra todos los scripts configurados.

### Ver versiones de dependencias

```bash
npm list
```

### Actualizar dependencias

```bash
npm update
npm outdated  # Ver qué está desactualizado
```

### Limpiar caché

```bash
npm cache clean --force
```

---

## Flujo de Trabajo Típico

### 1. Iniciar Sesión de Desarrollo

```bash
cd escritores-front
npm run dev
# → http://localhost:5173
```

### 2. Abrir DevTools

```
F12 (o Cmd+Option+I en Mac)
```

### 3. Editar Código

Abre archivo en tu editor:
```
src/pages/Home.jsx
```

Edita y guarda (Ctrl+S).

### 4. Ver Cambios

El navegador se actualiza automáticamente.

### 5. Debuggear si Necesario

- Revisa console (F12 → Console)
- Usa React DevTools
- Inspecciona Network requests

### 6. Terminar Sesión

```bash
Ctrl+C (en terminal)
```

---

## Publicar Cambios Locales

### Guardar en Git

```bash
git add .
git commit -m "Descripción de cambios"
git push origin nombre-rama
```

### Crear Pull Request

En GitHub:
1. Abre repositorio
2. Click "Pull Requests"
3. "New Pull Request"
4. Selecciona tu rama

---

## Performance Monitoring

### Lighthouse (Chrome)

1. DevTools → Pestaña "Lighthouse"
2. Click "Generate report"
3. Obtén score de performance

### Medidas Web Vitals

```jsx
import { useEffect } from 'react';

export function WebVitals() {
  useEffect(() => {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }, []);
}
```

---

## Recursos Útiles

### Documentación

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [MDN DevTools](https://developer.mozilla.org/en-US/docs/Tools)

### Herramientas en Línea

- [jsoncrack.com](https://jsoncrack.com/) - Visualizar JSON
- [regex101.com](https://regex101.com/) - Testear regex
- [caniuse.com](https://caniuse.com/) - Compatibilidad navegadores

---

**Última actualización**: Enero 2024
