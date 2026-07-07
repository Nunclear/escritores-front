# Pruebas del Frontend

## Estrategia de Testing

### Pirámide de Testing

```
        ┌─────────────────┐
        │  E2E Tests      │  < 10%
        │  Selenium, etc  │
        └─────────────────┘
           ▲
        ┌──────────────────┐
        │ Integration Tests│  ~20%
        │ Componentes +    │
        │ API mocking      │
        └──────────────────┘
           ▲
        ┌──────────────────┐
        │  Unit Tests      │  ~70%
        │ Funciones,       │
        │ Componentes      │
        └──────────────────┘
```

---

## Unit Tests

### Setup (Jest + React Testing Library)

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### Estructura

```
src/
├── __tests__/
│   ├── components/
│   │   └── StoryCard.test.jsx
│   ├── pages/
│   │   └── Home.test.jsx
│   └── utils/
│       └── story.test.js
```

### Ejemplo: Componente

```jsx
// src/components/FavoriteButton.jsx
import { useState } from 'react';

export default function FavoriteButton({ storyId }) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggle = () => {
    setIsFavorite(!isFavorite);
  };
  
  return (
    <button onClick={toggle}>
      {isFavorite ? '❤️ Favorito' : '🤍 Agregar'}
    </button>
  );
}
```

```jsx
// src/__tests__/components/FavoriteButton.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import FavoriteButton from '../../components/FavoriteButton';

describe('FavoriteButton', () => {
  it('debe renderizar botón inicial', () => {
    render(<FavoriteButton storyId={1} />);
    expect(screen.getByText('🤍 Agregar')).toBeInTheDocument();
  });
  
  it('debe cambiar estado al hacer click', () => {
    render(<FavoriteButton storyId={1} />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(screen.getByText('❤️ Favorito')).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(screen.getByText('🤍 Agregar')).toBeInTheDocument();
  });
});
```

### Ejecutar Tests

```bash
npm test                    # Modo watch
npm test -- --coverage     # Con cobertura
npm test -- --updateSnapshot # Actualizar snapshots
```

---

## Integration Tests

### Ejemplo: Página con API

```jsx
// src/__tests__/pages/Home.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import * as api from '../../api/client';

// Mock API
jest.mock('../../api/client');

describe('Home Page', () => {
  beforeEach(() => {
    api.stories.list.mockResolvedValue({
      content: [
        { id: 1, title: 'Historia 1', author: { displayName: 'Autor 1' } },
        { id: 2, title: 'Historia 2', author: { displayName: 'Autor 2' } }
      ]
    });
  });
  
  it('debe mostrar lista de historias', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    // Esperar a que aparezca contenido
    await waitFor(() => {
      expect(screen.getByText('Historia 1')).toBeInTheDocument();
    });
  });
  
  it('debe mostrar loading inicialmente', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();
  });
});
```

---

## E2E Tests (Cypress)

### Setup

```bash
npm install --save-dev cypress
npx cypress open
```

### Estructura

```
cypress/
├── e2e/
│   ├── auth.cy.js
│   ├── stories.cy.js
│   └── navigation.cy.js
└── fixtures/
    └── users.json
```

### Ejemplo: Login

```javascript
// cypress/e2e/auth.cy.js
describe('Autenticación', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/acceso');
  });
  
  it('debe hacer login correctamente', () => {
    // Llenar formulario
    cy.get('input[type="email"]').type('user@example.com');
    cy.get('input[type="password"]').type('password123');
    
    // Submit
    cy.get('button[type="submit"]').click();
    
    // Verificar redirección
    cy.url().should('include', '/dashboard');
    cy.get('h1').should('contain', 'Panel de Control');
  });
  
  it('debe mostrar error con credenciales inválidas', () => {
    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpass');
    cy.get('button[type="submit"]').click();
    
    cy.contains('Error al iniciar sesión').should('be.visible');
  });
});
```

### Ejecutar

```bash
npx cypress run                        # Headless
npx cypress run --spec "cypress/e2e/auth.cy.js"  # Test específico
```

---

## Testing de Componentes React

### Snapshot Tests

```javascript
import { render } from '@testing-library/react';
import StoryCard from '../../components/StoryCard';

it('debe coincidir con snapshot', () => {
  const story = {
    id: 1,
    title: 'Test Story',
    author: { displayName: 'Test Author' }
  };
  
  const { container } = render(<StoryCard story={story} />);
  expect(container).toMatchSnapshot();
});
```

### Accessibility Tests

```javascript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import StoryCard from '../../components/StoryCard';

expect.extend(toHaveNoViolations);

it('debe cumplir estándares de accesibilidad', async () => {
  const { container } = render(<StoryCard story={mockStory} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Testing de Hooks

### Ejemplo: useAuth

```javascript
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../context/AuthContext';
import { AuthProvider } from '../../context/AuthContext';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

it('debe iniciar sin usuario', () => {
  const { result } = renderHook(() => useAuth(), { wrapper });
  expect(result.current.isAuthenticated).toBe(false);
});

it('debe permitir login', async () => {
  const { result } = renderHook(() => useAuth(), { wrapper });
  
  await act(async () => {
    await result.current.login({
      email: 'user@example.com',
      password: 'password'
    });
  });
  
  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user).toBeDefined();
});
```

---

## Manual Testing Checklist

### Flujo de Usuario Completo

- [ ] Acceder sin autenticación
- [ ] Ver feed de historias públicas
- [ ] Buscar historia
- [ ] Abrir portada de historia
- [ ] Leer capítulo
- [ ] Dejar comentario (requiere login)
- [ ] Calificar historia
- [ ] Agregar a favoritos
- [ ] Seguir autor
- [ ] Ver perfil de autor
- [ ] Logout
- [ ] Volver a home

### Registro

- [ ] Ir a /acceso?modo=registro
- [ ] Llenar formulario
- [ ] Validar contraseña (8+ chars)
- [ ] Submit
- [ ] Verificar email
- [ ] Click en link de verificación
- [ ] Redirecciona a dashboard

### Editor

- [ ] Crear nueva historia
- [ ] Agregar capítulo
- [ ] Editar contenido
- [ ] Publicar
- [ ] Ver en home

### Responsividad

- [ ] Desktop (1400px+)
- [ ] Laptop (980px)
- [ ] Tablet (650px)
- [ ] Mobile (320px)

### Performance

- [ ] FCP < 1.8s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Sin console errors

### Accesibilidad

- [ ] Tab navigation
- [ ] Screen reader
- [ ] Contrast ratio
- [ ] Alt text en imágenes

---

## Coverage Report

### Generar

```bash
npm test -- --coverage
```

### Objetivos

```
Statements   : 80%+
Branches     : 75%+
Functions    : 80%+
Lines        : 80%+
```

### Ignorar en Coverage

```javascript
// .test.js files
// node_modules

// O en archivo
/* istanbulIgnore next */
```

---

## Debugging Tests

### Console.log

```javascript
it('debe hacer algo', () => {
  const result = myFunction();
  console.log('[test] Result:', result);
  expect(result).toBe(expected);
});
```

### Debugger

```javascript
it('debe hacer algo', () => {
  debugger;  // Se pausa aquí
  const result = myFunction();
  expect(result).toBe(expected);
});
```

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
# Luego abrir chrome://inspect
```

---

**Pendiente de completar según framework de testing elegido del proyecto.**
