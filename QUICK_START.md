# 🚀 Quick Start - Frontend Raíz de Palabras

## 1️⃣ Setup Inicial (5 minutos)

```bash
# Clonar proyecto
git clone https://github.com/Nunclear/escritores-front.git
cd escritores-front

# Instalar dependencias
npm install

# Crear .env local
cat > .env.local << EOF
VITE_API_URL=http://localhost:8080
EOF

# Iniciar servidor de desarrollo
npm run dev
```

✅ App corriendo en `http://localhost:5173`

---

## 2️⃣ Desarrollo Básico

### Crear un Componente

```jsx
// src/components/MyComponent.jsx
export default function MyComponent({ prop1 }) {
  return <div>{prop1}</div>;
}
```

### Llamar a API

```jsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function StoriesList() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.stories.list()
      .then(setStories)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando...</p>;
  return <div>{stories.map(s => <p key={s.id}>{s.title}</p>)}</div>;
}
```

### Proteger Ruta

```jsx
// En App.jsx
import Protected from './components/Protected';
import Dashboard from './pages/Dashboard';

<Routes>
  <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
</Routes>
```

### Usar AuthContext

```jsx
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      {user ? (
        <>
          <p>Hola, {user.username}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </div>
  );
}
```

---

## 3️⃣ Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar dev server (5173)

# Build
npm run build            # Generar dist/ para producción
npm run preview          # Previsualizar build local

# Limpieza (si algo falla)
rm -rf node_modules package-lock.json dist
npm cache clean --force
npm install
npm run dev
```

---

## 4️⃣ Rutas Principales

| Ruta | Tipo | Acceso |
|------|------|--------|
| `/` | Home | Público |
| `/login` | Login | Público |
| `/registro` | Signup | Público |
| `/story/:id` | Leer historia | Público |
| `/story/:id/capitulo/:cap` | Leer capítulo | Público |
| `/dashboard` | Dashboard | Autenticado |
| `/mi-historia/crear` | Crear historia | Autenticado |
| `/mi-historia/:id/editar` | Editar historia | Autor |
| `/admin` | Admin panel | Admin |
| `/moderacion` | Mod panel | Moderador |

---

## 5️⃣ Estructura de Carpetas

```
src/
├── components/        # Componentes reutilizables
├── pages/            # Páginas principales
├── services/         # Cliente HTTP y lógica API
├── context/          # AuthContext, etc
├── hooks/            # Custom hooks
├── styles/           # CSS global
└── utils/            # Utilidades
```

---

## 6️⃣ Formularios

```jsx
const [formData, setFormData] = useState({ email: '', password: '' });
const [errors, setErrors] = useState({});

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validar
  const newErrors = {};
  if (!formData.email) newErrors.email = 'Requerido';
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }
  
  // Enviar
  try {
    await api.auth.login(formData);
  } catch (err) {
    setErrors({ submit: err.message });
  }
};

return (
  <form onSubmit={handleSubmit}>
    <input
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    />
    {errors.email && <span className="error">{errors.email}</span>}
    <button type="submit">Enviar</button>
  </form>
);
```

---

## 7️⃣ API - Ejemplos

```js
// src/services/api.js

// Obtener historias
const stories = await api.stories.list({ page: 0, size: 20 });

// Obtener historia
const story = await api.stories.get(storyId);

// Crear historia
const newStory = await api.stories.create({ title: '...', description: '...' });

// Editar historia
await api.stories.update(storyId, { title: 'Nuevo título' });

// Eliminar historia
await api.stories.delete(storyId);

// Agregar comentario
await api.comments.create({ storyId, content: '...' });

// Obtener usuario
const user = await api.users.me();
```

---

## 8️⃣ Estilos (Tailwind CSS)

```jsx
// Usar clases de Tailwind
<div className="flex items-center justify-between p-4 bg-blue-500 rounded-lg">
  <h1 className="text-2xl font-bold text-white">Título</h1>
  <button className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-gray-100">
    Click
  </button>
</div>
```

---

## 9️⃣ Debug

```jsx
// Logs con prefijo [v0] para identificar fácilmente
console.log('[v0] User:', user);
console.log('[v0] API Response:', response);

// Ver token en localStorage
localStorage.getItem('rdp_access_token');

// Ver estado de autenticación
const { user, isAuthenticated } = useAuth();
console.log('[v0] Auth:', { user, isAuthenticated });
```

---

## 🔟 Deployment

### Vercel (Recomendado - 2 minutos)

1. Push a GitHub
2. Ir a https://vercel.com
3. Importar proyecto
4. Configurar variable: `VITE_API_URL=https://api.produccion.com`
5. Deploy automático ✅

### Netlify

```bash
# Build local
npm run build

# Netlify
netlify deploy --prod --dir=dist
```

---

## ⚠️ Errores Comunes

| Error | Solución |
|-------|----------|
| `Cannot find module 'react'` | `npm install` |
| `useAuth debe usarse dentro de AuthProvider` | Envolver App en `<AuthProvider>` |
| `CORS blocked` | Verificar `VITE_API_URL` en `.env.local` |
| `Infinite loop` | Revisar `useEffect` - agregar dependencias `[]` |
| `Estado no actualiza` | Usar spread: `setUser({ ...user, name: 'nuevo' })` |

**Para más detalles ver**: `docs/frontend/errores-comunes.md`

---

## 📚 Documentación Completa

Todas las secciones están documentadas en `docs/frontend/`:

```
docs/frontend/
├── index.md                    # Índice principal
├── arquitectura.md             # Flujo de datos
├── estructura.md               # Carpetas del proyecto
├── configuracion.md            # Variables de entorno
├── rutas.md                    # Mapa de rutas
├── componentes.md              # Catálogo de componentes
├── servicios-api.md            # Métodos API
├── estados.md                  # AuthContext
├── formularios.md              # Patrones de formularios
├── assets.md                   # Imágenes y datos
├── autenticacion.md            # JWT y seguridad
├── pruebas.md                  # Testing
├── ejecucion-local.md          # Setup
├── build-produccion.md         # Build optimizado
├── despliegue.md               # Deployment
└── errores-comunes.md          # Troubleshooting
```

Ver documentación: `mkdocs serve` o GitHub Pages

---

## ✅ Checklist Nuevo Desarrollador

- [ ] Cloné el repo
- [ ] Ejecuté `npm install`
- [ ] Creé `.env.local` con `VITE_API_URL`
- [ ] Ejecuté `npm run dev`
- [ ] Accedí a `localhost:5173`
- [ ] Leí `docs/frontend/index.md`
- [ ] Leí `docs/frontend/arquitectura.md`
- [ ] Creé un componente de prueba
- [ ] Hice una llamada a API
- [ ] Entiendo cómo funcionan las rutas protegidas

---

## 🆘 Necesito Ayuda

1. **Revisar**: `docs/frontend/errores-comunes.md`
2. **Buscar**: En documentación completa
3. **Debug**: Ver logs en DevTools (F12 → Console)
4. **API**: Revisar `docs/frontend/servicios-api.md`

---

**¡Listo para comenzar! 🎉**

Próximo paso: Leer `docs/frontend/index.md` para entender la arquitectura.
