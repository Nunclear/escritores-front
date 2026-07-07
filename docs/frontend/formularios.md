# Validación de Formularios

## Patrón General

Cada formulario en la aplicación sigue este patrón:

```jsx
import { useState } from 'react';
import { api } from '../api/client';

export default function MyForm() {
  const [formData, setFormData] = useState({
    field1: '',
    field2: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.field1.trim()) {
      newErrors.field1 = 'Campo requerido';
    }
    
    if (!formData.field2.trim()) {
      newErrors.field2 = 'Campo requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setSuccess(null);

    try {
      await api.someEndpoint.create(formData);
      setSuccess('¡Éxito!');
      setFormData({ field1: '', field2: '' });
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Campo 1</label>
        <input
          type="text"
          value={formData.field1}
          onChange={(e) => setFormData({ ...formData, field1: e.target.value })}
        />
        {errors.field1 && <span className="error">{errors.field1}</span>}
      </div>
      
      <div>
        <label>Campo 2</label>
        <textarea
          value={formData.field2}
          onChange={(e) => setFormData({ ...formData, field2: e.target.value })}
        />
        {errors.field2 && <span className="error">{errors.field2}</span>}
      </div>
      
      {errors.submit && <div className="error-box">{errors.submit}</div>}
      {success && <div className="success-box">{success}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
}
```

---

## Validaciones Comunes

### Email

```javascript
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Uso
if (!validateEmail(formData.email)) {
  errors.email = 'Email inválido';
}
```

### Contraseña

```javascript
const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Mínimo 8 caracteres';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Debe contener mayúscula';
  }
  if (!/[0-9]/.test(password)) {
    return 'Debe contener número';
  }
  return null;
};

// Uso
const passwordError = validatePassword(formData.password);
if (passwordError) {
  errors.password = passwordError;
}
```

### URL

```javascript
const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

### Rango de Números

```javascript
const validateRange = (value, min, max) => {
  const num = Number(value);
  if (isNaN(num)) return 'Debe ser número';
  if (num < min || num > max) {
    return `Debe estar entre ${min} y ${max}`;
  }
  return null;
};
```

### Longitud de Texto

```javascript
const validateLength = (text, min, max) => {
  if (text.length < min) {
    return `Mínimo ${min} caracteres`;
  }
  if (text.length > max) {
    return `Máximo ${max} caracteres`;
  }
  return null;
};
```

---

## Formulario: Login

```jsx
export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Requerido';
    else if (!validateEmail(email)) newErrors.email = 'Email inválido';
    if (!password) newErrors.password = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login({ email, password });
      // El AuthContext redirige a /dashboard
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </label>

      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </label>

      {errors.submit && <div className="alert-error">{errors.submit}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

---

## Formulario: Crear Historia

```jsx
export default function StoryForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    status: 'draft'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Título requerido';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Máximo 200 caracteres';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descripción requerida';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Mínimo 10 caracteres';
    }
    if (!formData.genre) {
      newErrors.genre = 'Género requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await api.stories.create({
        ...formData,
        authorId: user.id
      });
      navigate(`/editor/${result.id}`);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Título *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ej: La Aventura de los Siete..."
          maxLength="200"
        />
        {errors.title && <span className="error">{errors.title}</span>}
        <small>{formData.title.length}/200</small>
      </div>

      <div>
        <label>Descripción *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Cuenta de qué trata tu historia..."
          rows="4"
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      <div>
        <label>Género *</label>
        <select name="genre" value={formData.genre} onChange={handleChange}>
          <option value="">Seleccionar...</option>
          <option value="fantasy">Fantasía</option>
          <option value="scifi">Ciencia Ficción</option>
          <option value="romance">Romance</option>
          <option value="mystery">Misterio</option>
        </select>
        {errors.genre && <span className="error">{errors.genre}</span>}
      </div>

      {errors.submit && <div className="alert-error">{errors.submit}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Historia'}
      </button>
    </form>
  );
}
```

---

## Estilos para Errores

En `global.css`:

```css
.error {
  color: var(--wine);
  font-size: 0.9rem;
  margin-top: 4px;
  display: block;
}

input.error,
textarea.error,
select.error {
  border-color: var(--wine);
  background-color: rgba(139, 58, 58, 0.05);
}

.alert-error {
  background-color: rgba(139, 58, 58, 0.1);
  border: 1px solid var(--wine);
  color: var(--wine);
  padding: 12px 14px;
  border-radius: 18px;
  margin-bottom: 16px;
}

.alert-success {
  background-color: rgba(58, 107, 74, 0.1);
  border: 1px solid var(--green);
  color: var(--green);
  padding: 12px 14px;
  border-radius: 18px;
  margin-bottom: 16px;
}
```

---

**Pendiente de completar según configuración real del proyecto.**
