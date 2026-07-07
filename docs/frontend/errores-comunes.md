# Errores Comunes y Soluciones

## Errores en Desarrollo

### Error: "Cannot find module 'react'"

**Causa**: Dependencias no instaladas o package.json corrupto

**Solución:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Error: "useAuth debe usarse dentro de AuthProvider"

**Código:**
```jsx
function MyComponent() {
  const { user } = useAuth();  // ❌ Error aquí
}
```

**Causa**: Componente intenta usar `useAuth()` sin estar envuelto en `AuthProvider`

**Solución:**
```jsx
// En main.jsx
ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>  // ✅ Agregar
      <App />
    </AuthProvider>
  </BrowserRouter>
);
```

---

### Error: "Cannot assign to read only property"

**Causa**: Intento de mutar props o estado directamente

**Solución:**
```jsx
// ❌ Incorrecto
props.story.title = 'Nuevo título';

// ✅ Correcto
const updatedStory = { ...props.story, title: 'Nuevo título' };
```

---

### Error: "Infinite loop detected"

**Síntoma**: App "cuelga" o se vuelve muy lento

**Causa común**: useEffect sin dependencias o dependencia incorrecta

**Solución:**
```jsx
// ❌ Incorrecto - loop infinito
useEffect(() => {
  setState(count + 1);  // Causa nuevo render, triggea useEffect de nuevo
});

// ✅ Correcto
useEffect(() => {
  // Algo que se ejecuta solo una vez
}, []);  // Array vacío = solo al montar
```

---

### Error: "Target container is not a DOM element"

**Causa**: No hay elemento con id="root" en index.html

**Solución**: Verificar `index.html`:
```html
<body>
  <div id="root"></div>  <!-- Debe existir -->
  <script type="module" src="/src/main.jsx"></script>
</body>
```

---

## Errores de API

### Error: 401 Unauthorized

**Síntoma:**
```
POST /api/auth/me 401 Unauthorized
{
  "message": "Invalid token",
  "error": "UNAUTHORIZED"
}
```

**Causas:**
1. Token expirado
2. Token inválido
3. Token no enviado

**Soluciones:**
```jsx
// 1. Login nuevamente
const { login } = useAuth();
await login({ email, password });

// 2. Verificar que AuthContext está en root
// 3. Verificar que storage tiene token guardado

// En DevTools Console
localStorage.getItem('rdp_access_token');  // Debe tener valor
```

---

### Error: 404 Not Found

**Síntoma:**
```
GET /api/stories/999 404 Not Found
```

**Causa**: El recurso no existe

**Solución:**
```jsx
try {
  const story = await api.stories.get(999);
} catch (err) {
  if (err.status === 404) {
    console.log('Story not found');
  }
}
```

---

### Error: 500 Internal Server Error

**Síntoma:**
```
POST /api/stories 500 Internal Server Error
```

**Causas:**
1. Backend crash
2. Query inválida
3. Error no manejado

**Soluciones:**
1. Revisar logs del backend
2. Verificar datos que envías
3. Contactar administrador del backend

---

### Error: CORS Blocked

**Síntoma:**
```
Access to XMLHttpRequest at 'http://localhost:8080/api/...'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Causa**: Backend no permite requests desde frontend

**Soluciones:**

1. **Backend local**: Asegurarse que está corriendo
```bash
curl http://localhost:8080/api/stories  # Debe responder
```

2. **Verificar VITE_API_URL**:
```env
VITE_API_URL=http://localhost:8080  # Correcto formato
```

3. **Backend debe permitir CORS**:

En backend (Node.js ejemplo):
```js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

## Errores de Validación

### Validación de Formulario Falla Silenciosamente

**Código:**
```jsx
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!email) newErrors.email = 'Requerido';
  // ❌ No retorna nada
};

const handleSubmit = async (e) => {
  e.preventDefault();
  validate();  // ❌ newErrors no se usa
};
```

**Solución:**
```jsx
const validate = () => {
  const newErrors = {};
  if (!email) newErrors.email = 'Requerido';
  return newErrors;  // ✅ Retornar
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validate();  // ✅ Usar retorno
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
};
```

---

### Email válida pero API rechaza

**Causa**: Validación diferente en cliente vs backend

**Solución**: Asegurarse que ambas coincidan

```jsx
// Cliente
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Backend debe tener la misma lógica
// O más estricta, pero no más permisiva
```

---

## Errores de Renderizado

### Componente no aparece

**Checklist:**

1. ¿Está en el return?
```jsx
// ✅
return <MyComponent />;

// ❌
MyComponent;
```

2. ¿Está importado?
```jsx
// ✅
import MyComponent from './MyComponent';

// ❌
// Falta import
```

3. ¿Condicional evalúa correcto?
```jsx
// ❌
{isLoading && <MyComponent />}  // Si isLoading = true, no aparece

// ✅
{!isLoading && <MyComponent />}
```

---

### Props no se pasan

**Código:**
```jsx
// ❌
<StoryCard story={stories[0]} />

// Pero en componente
function StoryCard(props) {
  console.log(props.story);  // undefined
}
```

**Solución:**
```jsx
// ✅
function StoryCard({ story }) {
  console.log(story);  // Tiene valor
}
```

---

## Errores de Estado

### Estado no actualiza

**Síntoma**: `setState()` llamado pero componente no re-renderiza

**Causas comunes:**

1. Intentar mutar state directamente:
```jsx
// ❌
user.name = 'John';
setUser(user);

// ✅
setUser({ ...user, name: 'John' });
```

2. Array/object que no cambió en referencia:
```jsx
// ❌
items.push(newItem);
setItems(items);

// ✅
setItems([...items, newItem]);
```

---

### Estado antiguo en useEffect

**Síntoma**: useEffect ve valor anterior

**Causa**: Falta agregar dependencia

```jsx
// ❌
useEffect(() => {
  console.log(count);  // Ve valor anterior
  api.call(count);
}, []);  // Nunca se re-ejecuta

// ✅
useEffect(() => {
  console.log(count);  // Ve valor actualizado
  api.call(count);
}, [count]);  // Se re-ejecuta cuando count cambia
```

---

## Errores de Performance

### Página lenta después de login

**Causas comunes:**

1. Demasiadas solicitudes simultáneas:
```jsx
// ❌
useEffect(() => {
  api.stories.list();      // Request 1
  api.users.list();        // Request 2
  api.metrics.topViewed(); // Request 3
  // Todas al mismo tiempo
}, []);

// ✅
useEffect(() => {
  Promise.all([
    api.stories.list(),
    api.users.list(),
    api.metrics.topViewed()
  ]);  // Con Promise.all se optimiza mejor
}, []);
```

2. Componentes re-renderizando sin razón:

```jsx
// ❌ Re-renderiza cada key change
function MyComponent() {
  const [data, setData] = useState([]);
  
  return data.map((item, i) => (
    <div key={i}>{item}</div>  // ❌ key inestable
  ));
}

// ✅
return data.map((item) => (
  <div key={item.id}>{item}</div>  // ✅ key estable
));
```

---

## Errores de Navegación

### Ruta no encontrada siempre redirige a home

**Causa**: Ruta comodín `*` antes que rutas específicas

```jsx
// ❌ Incorrecto orden
<Routes>
  <Route path="*" element={<Home />} />
  <Route path="/dashboard" element={<Dashboard />} />
</Routes>

// ✅ Correcto orden
<Routes>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="*" element={<Home />} />
</Routes>
```

---

### Protected route redirige indefinidamente

**Causa**: `loading` no finaliza

```jsx
// ❌
function Protected({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null;  // ❌ loading nunca es false
  return isAuthenticated ? children : <Navigate to="/acceso" />;
}

// ✅ Verificar que AuthContext inicializa correctamente
// En main.jsx, AuthProvider debe estar presente
```

---

## Errores de Build/Deployment

### Build falla con "Out of Memory"

```bash
# ❌
npm run build

# ✅
node --max-old-space-size=4096 ./node_modules/vite/bin/vite.mjs build
```

---

### Deploy en Vercel falla

**Causa común**: Variables de entorno no configuradas

**Solución:**

1. Ir a Project Settings
2. Environment Variables
3. Agregar `VITE_API_URL`
4. Re-deploy

---

### CSS no carga en producción

**Causa**: Paths incorrectos en build

**Solución**: Asegurarse que `index.html` referencia assets correctamente:

```html
<!-- index.html -->
<script type="module" src="/src/main.jsx"></script>
```

No usar paths relativos como `./src/main.jsx`

---

## Herramientas de Debug

### Extensión React DevTools

Instalar: https://react-devtools-tutorial.vercel.app/

Uso:
- Ver componentes
- Inspeccionar props
- Ver estado actual
- Profiling

### Redux DevTools (Si usas Redux)

Inspeccionar acciones y estado

### Network Tab (DevTools)

Ver solicitudes API:
- Headers
- Payload
- Response
- Timing

### Console Logs Estratégicos

```jsx
console.log('[v0] User:', user);
console.log('[v0] Loading:', loading);
console.log('[v0] API Response:', response);
```

---

## Cuando Nada Funciona

**Pasos a seguir:**

1. Revisar console (F12 → Console)
2. Revisar Network tab
3. Limpiar caché y localStorage
4. Restart servidor de desarrollo
5. Reinstalar dependencias
6. Revisar que backend está corriendo

**Command nuclear:**
```bash
# Limpiar todo
rm -rf node_modules package-lock.json dist .vite
npm cache clean --force

# Reinstalar
npm install

# Rebuild
npm run build

# Dev
npm run dev
```
