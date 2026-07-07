# Gestión de Estados

## AuthContext - Estado Global de Autenticación

**Ubicación**: `src/context/AuthContext.jsx`

### Estructura del Contexto

```jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Métodos...
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
```

### Estado Disponible

```js
{
  user: {
    id: number,
    email: string,
    username: string,
    avatar: string | null,
    bio: string | null,
    role: 'user' | 'moderator' | 'admin',
    accessLevel: string,
    createdAt: ISO8601Date
  } | null,
  
  loading: boolean,          // Mientras valida sesión
  isAuthenticated: boolean,  // true si user no es null
  
  login: async (credentials) => Promise<AuthResult>,
  register: async (data) => Promise<AuthResult>,
  logout: async () => Promise<void>
}
```

### Ciclo de Vida

#### Inicialización

```
App monta
  ↓
AuthProvider monta
  ↓
localStorage tiene token?
  ├─ NO → loading = false, user = null
  └─ SÍ → loading = true
          POST /auth/me con token
          ├─ Éxito → user = me, loading = false
          └─ Error → localStorage.clear(), user = null, loading = false
```

#### Login

```
user llama a login(credentials)
  ↓
POST /auth/login
  ↓
Backend retorna { accessToken, refreshToken, user }
  ↓
localStorage.setItem(rdp_access_token, token)
localStorage.setItem(rdp_refresh_token, token)
localStorage.setItem(rdp_user, JSON.stringify(user))
  ↓
setUser(user)
  ↓
App re-renderiza
  ↓
ProtectedRoute ve isAuthenticated = true
  ↓
Usuario redirigido a /dashboard
```

#### Logout

```
user llama a logout()
  ↓
POST /auth/logout con refreshToken
  ↓
localStorage.clear()
  ↓
setUser(null)
  ↓
isAuthenticated = false
  ↓
ProtectedRoute redirige a /acceso
```

### Uso en Componentes

**Componente Funcional Simple**:
```jsx
function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/acceso" />;
  
  return (
    <div>
      <p>Bienvenido, {user.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**Componente con Verificación de Rol**:
```jsx
function AdminPanel() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  if (!isAdmin) return <Navigate to="/dashboard" />;
  
  return <div>Panel Admin</div>;
}
```

**Componente que llama a login**:
```jsx
async function handleLogin(email, password) {
  try {
    const { login } = useAuth();
    await login({ email, password });
    // AuthContext actualiza automáticamente
    // El componente se re-renderiza
  } catch (err) {
    console.error('Login fallido:', err);
  }
}
```

---

## Estado Local en Componentes

### Patrón Típico

```jsx
const [stories, setStories] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [page, setPage] = useState(0);

useEffect(() => {
  setLoading(true);
  api.stories.list({ page, size: 20 })
    .then(setStories)
    .catch(setError)
    .finally(() => setLoading(false));
}, [page]);

// Renderizado
{loading ? (
  <LoadingState />
) : error ? (
  <ErrorState error={error} onRetry={() => setPage(page)} />
) : stories.length === 0 ? (
  <EmptyState />
) : (
  <StoryGrid stories={stories} />
)}
```

### Estados Comunes en Páginas

| Estado | Tipo | Descripción |
|--------|------|-------------|
| `data` | Array/Object | Datos de la API |
| `loading` | boolean | Mientras se carga |
| `error` | Error \| null | Último error |
| `page` | number | Página actual (paginación) |
| `filters` | Object | Filtros aplicados |
| `selectedId` | number \| null | Elemento seleccionado |

---

## Almacenamiento Persistente

### localStorage

```js
const storage = {
  // Tokens
  getAccessToken: () => localStorage.getItem('rdp_access_token'),
  setAccessToken: (token) => localStorage.setItem('rdp_access_token', token),
  getRefreshToken: () => localStorage.getItem('rdp_refresh_token'),
  setRefreshToken: (token) => localStorage.setItem('rdp_refresh_token', token),
  
  // Usuario
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem('rdp_user'));
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem('rdp_user', JSON.stringify(user)),
  
  // Visitante
  getVisitorToken: () => {
    let token = localStorage.getItem('rdp_visitor_token');
    if (!token) {
      token = crypto.randomUUID() || `visitor-${Date.now()}`;
      localStorage.setItem('rdp_visitor_token', token);
    }
    return token;
  },
  
  // Clear all
  clear: () => {
    localStorage.removeItem('rdp_access_token');
    localStorage.removeItem('rdp_refresh_token');
    localStorage.removeItem('rdp_user');
  }
};
```

### Session Storage (Opcional)

Para datos temporales de la sesión actual:

```js
sessionStorage.setItem('activeTab', 'chapters');
const activeTab = sessionStorage.getItem('activeTab');
```

---

## Patrones Avanzados

### useEffect con Dependencias

**Cargar datos cuando cambia un ID**:
```jsx
useEffect(() => {
  loadStoryData(storyId);
}, [storyId]);
```

**Limpiar recursos**:
```jsx
useEffect(() => {
  const controller = new AbortController();
  
  api.stories.list({ signal: controller.signal })
    .then(setStories);
  
  return () => controller.abort();
}, []);
```

**Debounce de búsqueda**:
```jsx
const [query, setQuery] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    api.stories.search({ q: query });
  }, 300);
  
  return () => clearTimeout(timer);
}, [query]);
```

### Reducers para Estado Complejo

Para múltiples acciones en estado:

```jsx
const initialState = {
  stories: [],
  loading: false,
  error: null,
  page: 0
};

function storyReducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'SUCCESS':
      return { 
        ...state, 
        stories: action.payload, 
        loading: false 
      };
    case 'ERROR':
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
}

// Uso
const [state, dispatch] = useReducer(storyReducer, initialState);
```

---

## Flujos de Estado Típicos

### Carga de Datos

```
Initial State
  ↓
User visits page
  ↓
useEffect dispara
  ↓
dispatch({ type: 'LOADING' })
  ↓
setState(loading: true)
  ↓
Re-render: muestra LoadingState
  ↓
API call completa
  ↓
dispatch({ type: 'SUCCESS', payload: data })
  ↓
setState(data, loading: false)
  ↓
Re-render: muestra contenido
```

### Error y Reintentos

```
API call falla
  ↓
dispatch({ type: 'ERROR', payload: err })
  ↓
setState(error, loading: false)
  ↓
Re-render: muestra ErrorState
  ↓
User hace click en "Reintentar"
  ↓
Vuelve a LOADING
```

### Filtros y Búsqueda

```
User tipea en input
  ↓
setState(query: value)
  ↓
useEffect detecta cambio
  ↓
Debounce espera 300ms
  ↓
api.stories.search({ q })
  ↓
setState(results)
  ↓
Re-render: muestra resultados
```

---

## Mejores Prácticas

### 1. Colocar AuthProvider en la Raíz

```jsx
// ✅ Correcto
ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);

// ❌ Incorrecto
ReactDOM.render(<App />);
```

### 2. Usar useAuth Dentro de AuthProvider

```jsx
// ✅ Correcto
function HomePage() {
  const { user } = useAuth();  // Dentro de AuthProvider
  return <div>{user.name}</div>;
}

// ❌ Incorrecto
function Fuera() {
  const { user } = useAuth();  // Error: no hay proveedor
}
```

### 3. Manejar Estado de Carga

```jsx
// ✅ Correcto
useEffect(() => {
  loadData();
}, []);

// ❌ Evitar: llamadas en render
function BadComponent() {
  api.getData();  // Causa bucle infinito
  return null;
}
```

### 4. Limpiar Efectos

```jsx
// ✅ Correcto
useEffect(() => {
  const timer = setTimeout(doSomething, 1000);
  return () => clearTimeout(timer);
}, []);

// ❌ Fuga de memoria
useEffect(() => {
  setTimeout(doSomething, 1000);
}, []);
```

### 5. No guardar objetos mutables en estado

```jsx
// ✅ Correcto
const [user, setUser] = useState({ ...userData });

// ❌ Incorrecto
const user = { name: 'John' };
setState(user);
```
