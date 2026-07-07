# Gestión de Estados

## AuthContext - Estado Global

### Ubicación
`src/context/AuthContext.jsx`

### Proveedor

```jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, storage } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storage.getUser());
  const [loading, setLoading] = useState(Boolean(storage.getAccessToken()));

  // Al montar: Validar sesión existente
  useEffect(() => {
    let mounted = true;
    
    if (!storage.getAccessToken()) {
      setLoading(false);
      return undefined;
    }

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
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  async function login(credentials) {
    const result = await api.auth.login(credentials);
    storage.setAccessToken(result.accessToken);
    storage.setRefreshToken(result.refreshToken);
    storage.setUser(result.user);
    setUser(result.user);
    return result;
  }

  async function register(data) {
    return api.auth.register(data);
  }

  async function logout() {
    const refreshToken = storage.getRefreshToken();
    try {
      if (refreshToken) await api.auth.logout(refreshToken);
    } finally {
      storage.clear();
      setUser(null);
    }
  }

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout
  }), [user, loading]);

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

### Propiedades del Contexto

```javascript
const {
  user,              // { id, email, displayName, role, ... } o null
  loading,           // true mientras valida sesión
  isAuthenticated,   // Boolean - ¿está logueado?
  login,             // async (credentials) → login
  register,          // async (data) → registro
  logout             // async () → logout
} = useAuth();
```

### Ciclo de Vida

```
1. App monta
   └─ AuthProvider renderiza
      └─ useEffect dispara
         └─ Si hay token guardado:
            ├─ loading = true
            ├─ GET /auth/me
            └─ Espera respuesta

2. Respuesta llega
   └─ Si éxito:
      ├─ setUser(userData)
      ├─ loading = false
      └─ AuthContext.value actualiza
   
   └─ Si error (401):
      ├─ storage.clear()
      ├─ setUser(null)
      ├─ loading = false
      └─ Redirecciona a /acceso

3. Usuario hace login
   ├─ POST /auth/login
   ├─ Respuesta: { accessToken, refreshToken, user }
   ├─ storage.setAccessToken(token)
   ├─ setUser(userData)
   ├─ AuthContext.value actualiza
   └─ Componentes se re-renderizan

4. Usuario hace logout
   ├─ POST /auth/logout
   ├─ storage.clear()
   ├─ setUser(null)
   ├─ AuthContext.value actualiza
   └─ Redirecciona a /
```

---

## Estados Locales (useState)

### Patrón de Estados de Página

Cada página típicamente maneja:

```jsx
const [data, setData] = useState([]);           // Contenido
const [loading, setLoading] = useState(true);   // Estado de carga
const [error, setError] = useState(null);       // Errores
const [pagination, setPagination] = useState({ // Paginación
  totalPages: 0,
  totalElements: 0
});
```

### Ejemplo: Home.jsx

```jsx
export default function Home() {
  const [query, setQuery] = useState('');
  const [visibilityState, setVisibilityState] = useState('public');
  const [publicationState, setPublicationState] = useState('published');
  const [sort, setSort] = useState('createdAt,desc');
  const [page, setPage] = useState(0);
  const [stories, setStories] = useState([]);
  const [latest, setLatest] = useState([]);
  const [topViewed, setTopViewed] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPage(0);  // Reset page cuando cambian filtros
  }, [query, visibilityState, publicationState, sort]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const params = {
      page,
      size: 12,
      sort,
      ...(query.trim() && { q: query.trim() }),
      ...(visibilityState && { visibilityState }),
      ...(publicationState && { publicationState })
    };

    Promise.allSettled([
      query.trim() ? api.stories.search(params) : api.stories.list(params),
      api.metrics.topViewed({ page: 0, size: 10 }),
      api.stories.list({
        page: 0,
        size: 10,
        sort: 'createdAt,desc',
        visibilityState: 'public',
        publicationState: 'published'
      })
    ])
      .then(([feedRes, topRes, latestRes]) => {
        if (!mounted) return;

        if (feedRes.status === 'fulfilled') {
          setStories(pageContent(feedRes.value).map(normalizeStory));
          setPagination({
            totalPages: feedRes.value?.totalPages || 0,
            totalElements: feedRes.value?.totalElements || 0
          });
        } else {
          setError(feedRes.reason);
          setStories([]);
        }

        setTopViewed(
          topRes.status === 'fulfilled'
            ? pageContent(topRes.value).map(normalizeStory)
            : []
        );
        setLatest(
          latestRes.status === 'fulfilled'
            ? pageContent(latestRes.value).map(normalizeStory)
            : []
        );
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [query, visibilityState, publicationState, sort, page]);

  // Renderizado condicional
  return (
    <>
      {error && <ErrorBlock error={error} />}
      {loading && <LoadingBlock />}
      {!loading && stories.length === 0 && <EmptyBlock />}
      {!loading && stories.length > 0 && (
        <div className="cards-grid">
          {stories.map(story => <StoryCard key={story.id} story={story} />)}
        </div>
      )}
    </>
  );
}
```

---

## Estados de Componentes

### Carga (Loading)

```jsx
const [loading, setLoading] = useState(true);

// En renderizado
{loading ? <LoadingBlock /> : <Content />}
```

### Error

```jsx
const [error, setError] = useState(null);

// En renderizado
{error ? <ErrorBlock error={error} onRetry={retry} /> : <Content />}
```

### Vacío

```jsx
const [data, setData] = useState([]);

// En renderizado
{data.length === 0 ? <EmptyBlock /> : <ListContent items={data} />}
```

### Estados Combinados

```jsx
{loading && <LoadingBlock />}
{error && <ErrorBlock />}
{!loading && !error && data.length === 0 && <EmptyBlock />}
{!loading && !error && data.length > 0 && <Content />}
```

---

## Patrones Avanzados

### Cleanup en useEffect

```jsx
useEffect(() => {
  let mounted = true;  // Flag para evitar memory leaks

  fetchData()
    .then(data => {
      if (mounted) setData(data);  // Solo si aún está montado
    })
    .catch(error => {
      if (mounted) setError(error);
    })
    .finally(() => {
      if (mounted) setLoading(false);
    });

  return () => { mounted = false; };  // Cleanup
}, []);
```

### Dependencias en useEffect

```jsx
// Se ejecuta una sola vez al montar
useEffect(() => {
  console.log('Componente montado');
}, []);

// Se ejecuta cuando 'id' cambia
useEffect(() => {
  fetchData(id);
}, [id]);

// Se ejecuta cuando 'query' o 'page' cambian
useEffect(() => {
  search(query, page);
}, [query, page]);

// Se ejecuta cada render (sin array)
useEffect(() => {
  console.log('Cada render');
});
```

### Optimización con useMemo

```jsx
import { useMemo } from 'react';

export default function StoriesList({ stories }) {
  // Calcula sortedStories solo cuando stories cambia
  const sortedStories = useMemo(() => {
    return stories.sort((a, b) => b.views - a.views);
  }, [stories]);

  return (
    <div>
      {sortedStories.map(story => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}
```

### Optimización con useCallback

```jsx
import { useCallback } from 'react';

export default function UserSearch() {
  const [results, setResults] = useState([]);

  // handleSearch no se redefine en cada render
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) return;
    const results = await api.users.search({ q: query });
    setResults(results);
  }, []);  // Solo se redefine si [] cambia (nunca en este caso)

  return <SearchInput onSearch={handleSearch} />;
}
```

---

## Persisten Estado

### En localStorage

```jsx
// Guardar filtros
useEffect(() => {
  localStorage.setItem('lastQuery', query);
}, [query]);

// Recuperar al montar
useEffect(() => {
  const savedQuery = localStorage.getItem('lastQuery') || '';
  setQuery(savedQuery);
}, []);
```

### En URL

```jsx
import { useSearchParams } from 'react-router-dom';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';

  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery });  // Actualiza URL
  };

  return <SearchInput value={query} onChange={handleSearch} />;
}
```

---

## Sincronización de Estados

### Problema: State Lifting

```jsx
// ❌ Antipatrón: Estado duplicado en dos componentes
// Componente 1
const [favorite, setFavorite] = useState(false);

// Componente 2
const [favorite, setFavorite] = useState(false);  // Diferente instancia!

// ✅ Solución: Levantar estado al padre
export default function Parent() {
  const [favorite, setFavorite] = useState(false);

  return (
    <>
      <FavoriteButton favorite={favorite} onToggle={setFavorite} />
      <FavoriteCounter favorite={favorite} />
    </>
  );
}
```

### Sincronización con API

```jsx
useEffect(() => {
  // Si story.id cambia, cargar datos nuevos
  api.stories.get(storyId)
    .then(story => {
      setStory(story);
      setFavorite(story.isFavorite);
      setRating(story.userRating);
    });
}, [storyId]);
```

---

## Debugging Estados

### Console Logs

```jsx
useEffect(() => {
  console.log('[v0] Loading:', loading);
  console.log('[v0] Stories:', stories);
  console.log('[v0] Error:', error);
}, [loading, stories, error]);
```

### React DevTools

Usa la extensión de navegador para:
- Inspeccionar props
- Ver estado de componentes
- Virar cambios de estado en tiempo real
- Timeline de renders

---

**Última actualización**: Enero 2024
