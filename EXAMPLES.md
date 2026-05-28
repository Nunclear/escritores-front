# Ejemplos de Uso - Plataforma Escritores

## Ejemplo 1: Usar Componentes de Botón

```jsx
import { EditorialButton } from '../components';

export function MyComponent() {
  return (
    <div className="space-y-4">
      {/* Primary button */}
      <EditorialButton 
        variant="primary" 
        onClick={() => console.log('click')}
      >
        Acción Principal
      </EditorialButton>

      {/* Secondary with loading */}
      <EditorialButton 
        variant="secondary"
        loading={false}
        disabled={false}
      >
        Acción Secundaria
      </EditorialButton>

      {/* Danger button */}
      <EditorialButton 
        variant="danger"
        onClick={handleDelete}
      >
        Eliminar
      </EditorialButton>

      {/* With icon */}
      <EditorialButton 
        variant="success"
        icon={SaveIcon}
        iconPosition="left"
      >
        Guardar
      </EditorialButton>
    </div>
  );
}
```

## Ejemplo 2: Crear Formulario con Validación

```jsx
import { useState } from 'react';
import { TextInput, TextArea, SelectInput, EditorialButton } from '../components';

export function StoryForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Título requerido';
    if (formData.title.length > 255) newErrors.title = 'Máximo 255 caracteres';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Guardar
    // await storiesService.createStory(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TextInput
        label="Título de la Historia"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        hint="Máximo 255 caracteres"
        required
      />

      <TextArea
        label="Descripción"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={5}
        placeholder="Cuéntanos de qué trata tu historia..."
        required
      />

      <SelectInput
        label="Categoría"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={[
          { value: 'fantasy', label: 'Fantasía' },
          { value: 'romance', label: 'Romance' },
          { value: 'sci-fi', label: 'Ciencia Ficción' },
        ]}
        required
      />

      <EditorialButton variant="primary" type="submit">
        Guardar Historia
      </EditorialButton>
    </form>
  );
}
```

## Ejemplo 3: Página con Carga de Datos

```jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AppShell, LoadingState, ErrorState, StoryCardGrid } from '../components';
import { storiesService } from '../services';

export function MyStoriesPage() {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        const response = await storiesService.getMyDrafts({ 
          page: 0, 
          size: 20 
        });
        setStories(response.content || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Reintentar carga
  };

  return (
    <AppShell user={user} userRole={user?.accessLevel}>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-text-primary">
          Mis Borradores
        </h1>
      </div>

      {loading ? (
        <LoadingState message="Cargando tus historias..." />
      ) : error ? (
        <ErrorState 
          title="Error al cargar" 
          onRetry={handleRetry}
        />
      ) : (
        <StoryCardGrid stories={stories} />
      )}
    </AppShell>
  );
}
```

## Ejemplo 4: Usar Servicios API

```jsx
import { storiesService, ratingsService, favoritesService } from '../services';

// Obtener historias
async function getStories() {
  try {
    const response = await storiesService.getStories({
      page: 0,
      size: 20,
      sort: 'createdAt,desc'
    });
    console.log(response.content); // Array de historias
  } catch (error) {
    console.error('Error:', error);
  }
}

// Crear historia
async function createStory() {
  try {
    const newStory = await storiesService.createStory({
      title: 'Mi Historia',
      description: 'Una historia increíble',
      visibilityState: 'public'
    });
    console.log('Historia creada:', newStory);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Calificar historia
async function rateStory(storyId, score) {
  try {
    const rating = await ratingsService.createRating({
      storyId,
      score
    });
    console.log('Calificación guardada');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Agregar a favoritos
async function toggleFavorite(storyId, isFavorite) {
  try {
    if (isFavorite) {
      await favoritesService.removeFavorite(storyId);
    } else {
      await favoritesService.addFavorite(storyId);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Ejemplo 5: Componente con Router

```jsx
import { useNavigate } from 'react-router-dom';
import { EditorialButton } from '../components';

export function StoryDetail({ storyId }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/stories/${storyId}/edit`);
  };

  const handleViewChapters = () => {
    navigate(`/stories/${storyId}/chapters`);
  };

  return (
    <div>
      <h1>Detalle de Historia</h1>
      
      <EditorialButton onClick={handleEdit}>
        Editar
      </EditorialButton>
      
      <EditorialButton onClick={handleViewChapters}>
        Ver Capítulos
      </EditorialButton>

      <EditorialButton 
        onClick={() => navigate(-1)}
        variant="ghost"
      >
        Volver
      </EditorialButton>
    </div>
  );
}
```

## Ejemplo 6: Usar AuthContext

```jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LoginExample() {
  const { login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    loginOrEmail: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (error) {
      // Error ya está en authError
      console.error(authError);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {authError && (
        <div className="text-red-wine mb-4">{authError}</div>
      )}
      {/* Campos del formulario */}
    </form>
  );
}
```

## Ejemplo 7: Componente Estado Vacío

```jsx
import { EmptyState } from '../components';
import { useNavigate } from 'react-router-dom';

export function NoStoriesPlaceholder() {
  const navigate = useNavigate();

  return (
    <EmptyState
      title="Aún no tienes historias"
      message="Comienza a escribir tu primera historia hoy"
      icon="📖"
      action="Nueva Historia"
      onAction={() => navigate('/stories/new')}
    />
  );
}
```

## Ejemplo 8: StoryCard Avanzado

```jsx
import { StoryCard, StoryCardGrid } from '../components';
import { useState } from 'react';

export function StoryGallery() {
  const [selectedStory, setSelectedStory] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'

  const stories = [
    {
      id: 1,
      title: 'El Viaje',
      slug: 'el-viaje',
      description: 'Una épica aventura...',
      author: { displayName: 'Juan Pérez' },
      publicationState: 'published',
      rating: 4.5,
      favoriteCount: 120,
      chapterCount: 15,
      viewCount: 1000
    },
    // Más historias...
  ];

  return (
    <div>
      {viewMode === 'grid' ? (
        <StoryCardGrid 
          stories={stories}
          onStoryClick={setSelectedStory}
          variant="default"
        />
      ) : (
        <div className="space-y-4">
          {stories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              variant="horizontal"
              onClick={() => setSelectedStory(story)}
            />
          ))}
        </div>
      )}

      {selectedStory && (
        <div>
          <h2>{selectedStory.title}</h2>
          {/* Detalles del story */}
        </div>
      )}
    </div>
  );
}
```

## Ejemplo 9: Paginación Completa

```jsx
import { PaginationControls } from '../components';
import { useState, useEffect } from 'react';
import { storiesService } from '../services';

export function StoriesList() {
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadStories = async () => {
      const response = await storiesService.getStories({
        page,
        size: 20
      });
      setStories(response.content);
      setTotalPages(response.totalPages);
      setTotal(response.totalElements);
    };
    loadStories();
  }, [page]);

  return (
    <div>
      {/* Mostrar historias */}
      {stories.map(story => (
        <div key={story.id}>{story.title}</div>
      ))}

      {/* Controles de paginación */}
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        pageSize={20}
        onPageChange={setPage}
      />
    </div>
  );
}
```

## Ejemplo 10: Ruta Protegida Completa

```jsx
import { ProtectedRoute } from '../components';
import { Route, Routes } from 'react-router-dom';
import { AdminPanel } from './pages/AdminPanel';

// En AppRoutes.jsx
<Routes>
  <Route
    path="/admin"
    element={
      <ProtectedRoute requiredRoles={['ADMIN']}>
        <AdminPanel />
      </ProtectedRoute>
    }
  />
</Routes>

// adminPanel.jsx
export function AdminPanel() {
  const { user } = useAuth(); // Siempre habrá un user aquí

  return (
    <AppShell user={user} userRole="ADMIN">
      <h1>Panel Administrativo</h1>
      {/* Contenido admin */}
    </AppShell>
  );
}
```

## Consejo: Patrones de Error Handling

```jsx
// Patrón 1: Con estado
const [error, setError] = useState(null);

try {
  setError(null);
  await apiCall();
} catch (err) {
  setError(err.response?.data?.message || 'Error genérico');
}

// Patrón 2: Con helper
import { getErrorMessage } from '../utils/helpers';

try {
  await apiCall();
} catch (err) {
  const message = getErrorMessage(err);
  setError(message);
}

// Patrón 3: Con componente
{error && (
  <ErrorAlert 
    message={error} 
    onDismiss={() => setError(null)} 
  />
)}
```

## Consejo: Validación de Formularios

```jsx
import {
  validateEmail,
  validatePassword,
  validateLoginName
} from '../utils/helpers';

const validateForm = (formData) => {
  const errors = {};

  if (!validateLoginName(formData.username)) {
    errors.username = 'Usuario inválido';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Email inválido';
  }

  if (!validatePassword(formData.password)) {
    errors.password = 'Contraseña débil';
  }

  return errors;
};
```

## Consejo: Utilidades Útiles

```jsx
import {
  formatDate,
  formatRelativeTime,
  truncateText,
  estimateReadingTime,
  getStateLabel,
  getStateColor
} from '../utils/helpers';

// Usar en componentes
const createdAt = formatDate(story.createdAt); // "28 de mayo de 2026"
const relative = formatRelativeTime(story.createdAt); // "Hace 2 horas"
const preview = truncateText(story.description, 100); // Con "..."
const readTime = estimateReadingTime(chapter.content); // "12 minutos"
const status = getStateLabel('draft'); // "Borrador"
const color = getStateColor('published'); // "#3a6b4a"
```

---

Todos estos ejemplos siguen los patrones establecidos en el proyecto y pueden ser copiados/adaptados directamente en nuevas páginas.
