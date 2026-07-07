# Errores Comunes y Soluciones

## Problemas de Instalación

### Error: "npm ERR! ERESOLVE unable to resolve dependency tree"

**Causa:** Conflicto entre versiones de dependencias

**Solución:**
```bash
npm install --legacy-peer-deps
```

O más agresivo:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

### Error: "Module not found: Can't resolve 'react'"

**Causa:** Dependencias no instaladas

**Solución:**
```bash
npm install
```

Si persiste:
```bash
npm install react react-dom react-router-dom lucide-react
```

---

## Problemas de Ejecución

### Error: "Port 5173 already in use"

**Causa:** Otro proceso usando el puerto

**Solución 1 - Matar proceso:**
```bash
# macOS/Linux
lsof -i :5173
kill -9 <PID>

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Solución 2 - Usar otro puerto:**
```bash
# Terminal
npm run dev -- --port 5174
```

---

### Error: "Cannot find module './api/client'"

**Causa:** Ruta incorrecta en import

**Solución:** Verificar que la ruta sea correcta
```jsx
// ✅ Correcto
import { api } from '../api/client';

// ❌ Incorrecto
import { api } from './api/client';
```

---

## Problemas de API

### Error: "Failed to fetch"

**Causa:** Backend no está corriendo o URL incorrecta

**Verificación:**
1. ¿Backend está corriendo? `http://localhost:8080`
2. ¿`.env.production` tiene URL correcta?
3. ¿CORS habilitado en backend?

**Solución:**
```bash
# 1. Verificar backend
curl http://localhost:8080/api/stories

# 2. Verificar env
cat .env.production
# Debe tener: VITE_API_URL=http://localhost:8080

# 3. Reiniciar
npm run dev
```

---

### Error: "401 Unauthorized"

**Causa:** Token inválido, expirado o no enviado

**Soluciones:**
1. Verificar token en localStorage
2. Intentar logout y login de nuevo
3. Limpiar localStorage: `localStorage.clear()`
4. Revisar header `Authorization` en requests

```javascript
// En console
localStorage.getItem('rdp_access_token')  // Debe retornar token
```

---

### Error: "403 Forbidden"

**Causa:** Usuario no tiene permisos para la acción

**Solución:** Verificar rol del usuario
```javascript
// En console
JSON.parse(localStorage.getItem('rdp_user')).role
// Si es 'user' no puede acceder a rutas '/admin'
```

---

### Error: "404 Not Found"

**Causa:** Recurso no existe (historia, capítulo, usuario, etc)

**Solución:** Verificar que el ID es válido
```javascript
// Antes de hacer request
if (!storyId) {
  console.error('storyId no puede estar vacío');
  return;
}

api.stories.get(storyId);
```

---

### Error: "500 Internal Server Error"

**Causa:** Error en el backend

**Qué hacer:**
1. Revisar logs del backend
2. Reiniciar backend
3. Verificar base de datos

```bash
# En terminal del backend
npm run dev  # Reiniciar
```

---

## Problemas de Renderizado

### Página muestra "Cannot read property 'map' of undefined"

**Causa:** Intentar usar `.map()` en valor undefined

**Solución - Usar optional chaining:**
```jsx
// ❌ Incorrecto
{data.map(item => <div>{item}</div>)}

// ✅ Correcto
{data?.map(item => <div>{item}</div>)}

// ✅ O con validación
{data && data.map(item => <div>{item}</div>)}

// ✅ O inicializar en useState
const [data, setData] = useState([]);  // Array vacío como default
```

---

### "React does not recognize the 'X' prop"

**Causa:** Pasar prop que React no reconoce al DOM

**Solución:**
```jsx
// ❌ Incorrecto - 'custom' no es atributo HTML válido
<div custom="value">Hello</div>

// ✅ Correcto - usar data-*
<div data-custom="value">Hello</div>

// ✅ O separar props
const { custom, ...htmlProps } = props;
<div {...htmlProps}>Hello</div>
```

---

### Componente no actualiza cuando props cambian

**Causa:** useEffect sin dependencias correctas

**Solución:**
```jsx
// ❌ Nunca se ejecuta si 'id' cambia
useEffect(() => {
  fetchData(id);
}, []);  // Falta 'id'

// ✅ Se ejecuta cuando id cambia
useEffect(() => {
  fetchData(id);
}, [id]);
```

---

## Problemas de Estilos

### Estilos no aplican

**Causa:** Clase CSS no se encuentra o tiene especificidad baja

**Verificación:**
1. F12 → Elements → Inspector
2. Ver qué estilo se aplica
3. Verificar en `global.css`

**Solución:**
```css
/* Aumentar especificidad si es necesario */
.class.class { color: red; }  /* Más específico */

/* O usar !important (último recurso) */
.class { color: red !important; }
```

---

### Tema oscuro no cambia

**Causa:** Tema no persiste o no se aplica

**Solución:**
```jsx
// Verificar que se agrega el atributo
document.documentElement.getAttribute('data-theme')

// Debe retornar 'light' o 'dark'
// Si no, agregar en localStorage
localStorage.setItem('theme', 'dark')
document.documentElement.setAttribute('data-theme', 'dark')
```

---

### Estilos de Tailwind no funcionan

**Causa:** Clase no está en `content` de tailwind.config.js

**Solución:**
```javascript
// tailwind.config.js - Verificar que incluye tus archivos
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"  // Debe incluir tus archivos
  ],
  theme: { extend: {} },
  plugins: []
}
```

---

## Problemas de Navegación

### Botón Link no funciona

**Causa:** Usando `<a>` en lugar de React Router `<Link>`

**Solución:**
```jsx
import { Link } from 'react-router-dom';

// ✅ Correcto - no recarga la página
<Link to="/historia/123">Ver Historia</Link>

// ❌ Incorrecto - recarga la página
<a href="/historia/123">Ver Historia</a>
```

---

### Rutas no funcionan

**Causa:** Routes no está dentro de Router

**Solución:** Verificar estructura en `main.jsx`
```jsx
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
```

---

### Parámetros de URL no se capturan

**Causa:** useParams usado mal

**Solución:**
```jsx
import { useParams } from 'react-router-dom';

// En App.jsx - definir parámetro
<Route path="/historia/:storyId" element={<StoryCover />} />

// En StoryCover.jsx - capturar
export default function StoryCover() {
  const { storyId } = useParams();
  
  useEffect(() => {
    api.stories.get(storyId);
  }, [storyId]);
}
```

---

## Problemas de Performance

### App lenta

**Verificar:**
```bash
# 1. Tamaño del bundle
npm run build

# Mensaje esperado: < 200 KB total

# 2. Renderizados innecesarios
# F12 → Profiler tab → Record
# Buscar componentes que se renderizan sin cambios

# 3. Requests lentos
# F12 → Network → Ver tiempos de API
```

**Soluciones:**
1. Lazy loading de componentes
2. Memoization con `useMemo`/`useCallback`
3. Eliminar imports no usados

---

### Componente se renderiza infinitamente

**Causa:** useEffect sin dependencias que genera cambios de state

**Solución:**
```jsx
// ❌ Malo - useEffect dispara cada render, causando infinite loop
useEffect(() => {
  setData(newData);  // Causa re-render
});

// ✅ Bueno - useEffect solo corre cuando dependencias cambian
useEffect(() => {
  setData(newData);
}, [someDependency]);
```

---

## Problemas de Autenticación

### Usuario no permanece autenticado después de recargar

**Causa:** No se valida sesión al montar

**Solución:** AuthContext debe validar en useEffect
```jsx
// AuthContext.jsx debe tener:
useEffect(() => {
  if (!storage.getAccessToken()) {
    setLoading(false);
    return;
  }

  api.auth.me()
    .then(me => setUser(me))
    .catch(() => storage.clear())
    .finally(() => setLoading(false));
}, []);
```

---

### Token no se envía en requests

**Causa:** Headers no incluyen token

**Verificación:**
```javascript
// F12 → Network → Headers
// Authorization: Bearer eyJhbG...  ← Debe estar

// Si no está, revisar:
localStorage.getItem('rdp_access_token')  // ¿Existe?
```

---

### Logout no funciona completamente

**Causa:** localStorage no se limpia

**Solución:**
```jsx
// En logout
storage.clear();  // Limpia todo

// Verificar en console
localStorage.getItem('rdp_access_token')  // Debe ser null
localStorage.getItem('rdp_user')  // Debe ser null
```

---

## Problemas Específicos del Proyecto

### Comentarios no aparecen

**Pasos de debugging:**
1. `api.comments.byChapter(chapterId)` retorna?
2. Estado `comments` se actualiza?
3. Componente renderiza lista?

**Solución:**
```jsx
console.log('[v0] Comments fetched:', comments);
console.log('[v0] API response:', response);
```

---

### Favoritos no se guardan

**Pasos:**
1. Verificar token existe
2. Verificar `api.favorites.add(storyId)` retorna éxito
3. Verificar localStorage actualiza

```jsx
const handleFavorite = async () => {
  console.log('[v0] Adding favorite:', storyId);
  try {
    await api.favorites.add(storyId);
    console.log('[v0] Favorite added successfully');
    setIsFavorite(true);
  } catch (err) {
    console.error('[v0] Error adding favorite:', err);
  }
};
```

---

## Solicitar Ayuda

Si encuentras un error no documentado:

1. **Documentar el error:**
   - Mensaje exacto
   - Pasos para reproducir
   - URL o ruta donde ocurre
   - Versión de navegador

2. **Revisar logs:**
   - Console del navegador (F12)
   - Network tab de DevTools
   - Logs del backend

3. **Crear issue en GitHub:**
   - Título descriptivo
   - Reproducción paso a paso
   - Screenshots/videos
   - Mensajes de error completos

---

**Última actualización**: Enero 2024
