# Autenticación en el Frontend

## Sistema de Autenticación JWT

El frontend utiliza un sistema de **autenticación basada en tokens JWT** (JSON Web Tokens) que se comunica con el backend mediante endpoints REST.

### Flujo de Autenticación

```
┌─────────────────────────────────────┐
│ Usuario llega sin sesión            │
├─────────────────────────────────────┤
│ 1. localStorage no tiene token      │
│ 2. AuthContext loading = true       │
│ 3. AuthContext user = null          │
│ 4. Protected routes redirigen a /   │
└─────────────────────────────────────┘
         │
         ├─ Usuario va a /acceso
         │
         ▼
┌─────────────────────────────────────┐
│ AuthPage (Login o Registro)         │
│ - Ingresa email y password          │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ POST /auth/login o /auth/register   │
│ Body: { email, password }           │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Backend valida credenciales         │
│ Retorna tokens y datos de usuario   │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Frontend:                           │
│ 1. Guarda tokens en localStorage    │
│ 2. Guarda user en localStorage      │
│ 3. AuthContext.setState(user)       │
│ 4. isAuthenticated = true           │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Usuario puede acceder a rutas       │
│ privadas                            │
└─────────────────────────────────────┘
```

---

## Tokens JWT

### Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Componentes:**
1. **Header**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` (algoritmo)
2. **Payload**: Datos del usuario (user ID, permisos, etc.)
3. **Signature**: Firma digital para verificar autenticidad

### Tipos de Tokens

| Token | Propósito | Duración | Almacenamiento |
|-------|-----------|----------|-----------------|
| `accessToken` | Autorizar solicitudes API | Corta (15min típico) | localStorage |
| `refreshToken` | Renovar accessToken | Larga (7 días típico) | localStorage |

---

## Endpoints de Autenticación

### Registro

```js
POST /auth/register
Body: {
  email: "user@example.com",
  password: "secure123",
  username: "username"
}

Response: {
  accessToken: "eyJ...",
  refreshToken: "eyJ...",
  user: { id, email, username, ... }
}
```

### Login

```js
POST /auth/login
Body: {
  email: "user@example.com",
  password: "secure123"
}

Response: {
  accessToken: "eyJ...",
  refreshToken: "eyJ...",
  user: { id, email, username, ... }
}
```

### Obtener Usuario Actual

```js
GET /auth/me
Headers: {
  Authorization: "Bearer eyJ..."
}

Response: {
  id: 1,
  email: "user@example.com",
  username: "username",
  avatar: "url",
  bio: "...",
  role: "user",
  accessLevel: "user",
  createdAt: "2024-01-15T10:30:00Z"
}
```

### Renovar Token

```js
POST /auth/refresh
Body: {
  refreshToken: "eyJ..."
}

Response: {
  accessToken: "eyJ...",
  refreshToken: "eyJ..."
}
```

### Logout

```js
POST /auth/logout
Body: {
  refreshToken: "eyJ..."
}

Response: {
  message: "Logout successful"
}
```

---

## AuthContext en Detalle

### Inicialización

```jsx
useEffect(() => {
  let mounted = true;
  
  if (!storage.getAccessToken()) {
    setLoading(false);
    return;
  }
  
  // Si hay token, valida que siga siendo válido
  api.auth.me()
    .then((me) => { 
      if (mounted) { 
        setUser(me); 
        storage.setUser(me); 
      } 
    })
    .catch(() => { 
      storage.clear(); 
      if (mounted) setUser(null); 
    })
    .finally(() => mounted && setLoading(false));
  
  return () => { mounted = false; };
}, []);
```

**Qué sucede:**
1. Si no hay token guardado → loading = false, user = null
2. Si hay token → Valida llamando a /auth/me
3. Si /auth/me falla → Limpia localStorage

### Método login()

```jsx
async function login(credentials) {
  const result = await api.auth.login(credentials);
  
  storage.setAccessToken(result.accessToken);
  storage.setRefreshToken(result.refreshToken);
  storage.setUser(result.user);
  
  setUser(result.user);
  
  return result;
}
```

### Método logout()

```jsx
async function logout() {
  const refreshToken = storage.getRefreshToken();
  
  try { 
    if (refreshToken) await api.auth.logout(refreshToken); 
  }
  finally { 
    storage.clear(); 
    setUser(null); 
  }
}
```

---

## Uso en Componentes

### Login Page

```jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ email, password, username });
        await login({ email, password });
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-alert">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      {mode === 'register' && (
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
      )}
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Cargando...' : mode === 'login' ? 'Ingresar' : 'Registrarse'}
      </button>
      
      <button 
        type="button" 
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
      >
        {mode === 'login' ? '¿Sin cuenta? Registrarse' : '¿Tienes cuenta? Ingresar'}
      </button>
    </form>
  );
}
```

### Componente que Requiere Auth

```jsx
function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) return <LoadingState />;
  if (!isAuthenticated) return <Navigate to="/acceso" />;

  return (
    <div className="dashboard">
      <h1>Bienvenido, {user.username}</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

---

## Headers de Autorización

### Request

Todas las solicitudes autenticadas incluyen:

```
Authorization: Bearer eyJ...
```

**Implementación en cliente.js**:

```js
if (auth && token) {
  finalHeaders.Authorization = `Bearer ${token}`;
}
```

### Response

#### Éxito

```
200 OK
{
  id: 1,
  title: "Mi Historia",
  ...
}
```

#### No Autorizado (Token Expirado)

```
401 Unauthorized
{
  message: "Token expired",
  error: "UNAUTHORIZED"
}
```

**Manejo**: El interceptor automáticamente:
1. Detecta 401
2. Llama a `/auth/refresh` con refreshToken
3. Obtiene nuevo accessToken
4. Reintenta la solicitud original

---

## Almacenamiento de Credenciales

### localStorage

```js
rdp_access_token    // JWT para autenticación
rdp_refresh_token   // JWT para renovación
rdp_user           // Objeto usuario como JSON
rdp_visitor_token  // Token único de visitante
```

**Ventajas:**
- Persiste entre sesiones
- Accesible desde cualquier pestaña

**Desventajas:**
- Vulnerable a XSS
- No es httpOnly

### Alternativa: sessionStorage

Para sesiones que se cierren al cerrar navegador:

```js
sessionStorage.setItem('accessToken', token);
```

---

## Renovación Automática de Tokens

El cliente maneja automáticamente la renovación:

```
Request falla con 401
  ↓
POST /auth/refresh { refreshToken }
  ↓
Backend valida refreshToken
  ↓
Retorna nuevo accessToken
  ↓
Reintenta request original con nuevo token
  ↓
Request tiene éxito
```

---

## Roles y Permisos

### Roles Disponibles

```js
'user'      // Usuario estándar (escritor/lector)
'moderator' // Moderador de contenido
'admin'     // Administrador del sistema
```

### Verificar Rol en Componente

```jsx
function AdminPanel() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return <div>Contenido Admin</div>;
}
```

### Rutas Protegidas por Rol

```jsx
<Route 
  path="/admin" 
  element={
    <AdminOnly>
      <AdminPanel />
    </AdminOnly>
  }
/>
```

---

## Seguridad

### Mejores Prácticas

1. **Nunca guardar contraseñas en localStorage**
   - Solo guardar tokens JWT

2. **HTTPS en producción**
   - Los tokens se envían en headers HTTP

3. **Validar en cliente y backend**
   - Cliente: verificar isAuthenticated
   - Backend: verificar firma del token

4. **Expiración de tokens**
   - accessToken: corta (15 minutos)
   - refreshToken: larga (7 días)

5. **CORS configurado correctamente**
   - Backend debe permitir requests desde el dominio del frontend

### Logout Seguro

```jsx
// Limpia localStorage
await logout();

// Redirige a login
navigate('/acceso');

// Navegador olvida tokens
```

---

## Errores Comunes

### Error: "useAuth debe usarse dentro de AuthProvider"

**Causa**: Componente intenta usar `useAuth()` sin estar dentro de `AuthProvider`.

**Solución**:
```jsx
// ❌ Incorrecto
ReactDOM.render(<App />);

// ✅ Correcto
ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

### Error: 401 Unauthorized

**Causa**: Token expirado o inválido.

**Solución**: Login nuevamente o esperar a que se renueve automáticamente.

### Error: Token guardar en localStorage falla

**Causa**: localStorage lleno o deshabilitado.

**Solución**: Limpiar localStorage o usar sessionStorage.

---

## Testing

```jsx
// Mock del AuthContext
const mockAuthContext = {
  user: { id: 1, username: 'testuser', role: 'user' },
  isAuthenticated: true,
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn()
};

// Usar en tests
<AuthContext.Provider value={mockAuthContext}>
  <TestComponent />
</AuthContext.Provider>
```
