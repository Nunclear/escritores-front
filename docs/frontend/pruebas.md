# Pruebas del Frontend

## Estado Actual

> Pendiente de completar según configuración real del proyecto.

No hay configuración visible de testing en `package.json` (sin Jest, Vitest, o React Testing Library).

## Recomendaciones de Setup

### Instalación de herramientas

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

### Archivo de Configuración: `vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
});
```

### Script en package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "coverage": "vitest --coverage"
  }
}
```

---

## Patrones de Tests

### Test de Componente

```jsx
import { render, screen } from '@testing-library/react';
import StoryCard from '../components/StoryCard';

describe('StoryCard', () => {
  it('renders story title', () => {
    const story = { id: 1, title: 'Test Story', cover: null };
    render(<StoryCard story={story} />);
    expect(screen.getByText('Test Story')).toBeInTheDocument();
  });
});
```

### Test de API Call

```jsx
import { vi } from 'vitest';
import { api } from '../api/client';

describe('API', () => {
  it('calls stories.list', async () => {
    const mockResponse = [{ id: 1, title: 'Story' }];
    vi.spyOn(api.stories, 'list').mockResolvedValue(mockResponse);
    
    const result = await api.stories.list();
    expect(result).toEqual(mockResponse);
  });
});
```

### Test de Contexto

```jsx
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';

it('shows dashboard for authenticated user', () => {
  render(
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
  // Assertions...
});
```

---

## Cosas a Probar

- [ ] Componentes individuales
- [ ] Flujo de login/logout
- [ ] Protección de rutas
- [ ] Llamadas a API
- [ ] Manejo de errores
- [ ] Estados de carga
- [ ] Validación de formularios
- [ ] Rendering condicional
