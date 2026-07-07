# Formularios y Validación

## Patrones de Formularios

### Formulario Controlado Básico

```jsx
function LoginForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email requerido';
    if (!formData.email.includes('@')) newErrors.email = 'Email inválido';
    if (!formData.password) newErrors.password = 'Contraseña requerida';
    if (formData.password.length < 6) newErrors.password = 'Mín. 6 caracteres';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          disabled={loading}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'error' : ''}
          disabled={loading}
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      {errors.submit && (
        <div className="error-alert">{errors.submit}</div>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Ingresar'}
      </button>
    </form>
  );
}
```

---

## Validaciones Comunes

### Email

```js
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
```

### Contraseña

```js
const validatePassword = (password) => {
  return {
    isLong: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password)
  };
};

// Validar que cumple requisitos mínimos
const isValidPassword = (password) => {
  const checks = validatePassword(password);
  return checks.isLong && checks.hasUpperCase && checks.hasLowerCase;
};
```

### URL

```js
const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

### Número de caracteres

```js
const validateLength = (text, min, max) => {
  return text.length >= min && text.length <= max;
};
```

### Campo requerido

```js
const validateRequired = (value) => {
  return value && value.trim().length > 0;
};
```

---

## Formulario de Edición de Historia

```jsx
function StoryForm({ initialStory, onSubmit }) {
  const [formData, setFormData] = useState({
    title: initialStory?.title || '',
    description: initialStory?.description || '',
    cover: initialStory?.cover || '',
    genre: initialStory?.genre || 'general',
    status: initialStory?.status || 'draft'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Título requerido';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Mínimo 3 caracteres';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Máximo 200 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descripción requerida';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Mínimo 10 caracteres';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Máximo 1000 caracteres';
    }

    if (formData.cover && !validateUrl(formData.cover)) {
      newErrors.cover = 'URL de portada inválida';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="story-form">
      <div className="form-group">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          maxLength={200}
          placeholder="Nombre de tu historia"
          disabled={loading}
        />
        <div className="char-count">
          {formData.title.length} / 200
        </div>
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          maxLength={1000}
          rows={6}
          placeholder="Describe tu historia..."
          disabled={loading}
        />
        <div className="char-count">
          {formData.description.length} / 1000
        </div>
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="cover">URL de Portada</label>
        <input
          id="cover"
          type="url"
          value={formData.cover}
          onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
          placeholder="https://..."
          disabled={loading}
        />
        {errors.cover && <span className="error-text">{errors.cover}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="genre">Género</label>
          <select
            id="genre"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            disabled={loading}
          >
            <option value="general">General</option>
            <option value="fantasy">Fantasy</option>
            <option value="scifi">Sci-Fi</option>
            <option value="romance">Romance</option>
            <option value="mistery">Misterio</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Estado</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            disabled={loading}
          >
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>
        </div>
      </div>

      {errors.submit && (
        <div className="error-alert">{errors.submit}</div>
      )}

      <div className="form-actions">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" onClick={() => window.history.back()} className="btn-secondary">
          Cancelar
        </button>
      </div>
    </form>
  );
}
```

---

## Formulario de Comentarios

```jsx
function CommentForm({ onSubmit, onCancel, isLoading }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }

    if (content.length < 2) {
      setError('Mínimo 2 caracteres');
      return;
    }

    if (content.length > 5000) {
      setError('Máximo 5000 caracteres');
      return;
    }

    try {
      await onSubmit(content.trim());
      setContent('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (error) setError(null);
        }}
        placeholder="Escribe un comentario..."
        maxLength={5000}
        rows={4}
        disabled={isLoading}
      />
      
      <div className="form-footer">
        <div className="char-count">
          {content.length} / 5000
        </div>
        
        {error && <span className="error-text">{error}</span>}

        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Comentar'}
          </button>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
```

---

## Validación en Tiempo Real

```jsx
function LiveValidationInput({ label, value, onChange, validator }) {
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState(false);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (touched) {
      const validationError = validator(newValue);
      setError(validationError);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const validationError = validator(value);
    setError(validationError);
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={error ? 'error' : 'success'}
      />
      {error && touched && <span className="error-text">{error}</span>}
      {!error && touched && <span className="success-text">✓ Válido</span>}
    </div>
  );
}
```

---

## Mejores Prácticas

### 1. Validar Tanto en Cliente como Backend

```jsx
// Cliente valida rápidamente
const errors = validateForm(formData);

// Backend valida seguridad
try {
  await api.submit(formData);  // Backend también valida
} catch (err) {
  // Mostrar errores del backend
}
```

### 2. Desabilitar Submit Mientras se Procesa

```jsx
<button type="submit" disabled={loading}>
  {loading ? 'Cargando...' : 'Enviar'}
</button>
```

### 3. Mostrar Feedback

```jsx
{errors.field && <span className="error">{errors.field}</span>}
{!errors.field && touched && <span className="success">✓</span>}
```

### 4. Limpiar Errores al Escribir

```jsx
const handleChange = (e) => {
  setFormData({ ...formData, [name]: value });
  if (errors[name]) {
    setErrors({ ...errors, [name]: null });
  }
};
```

### 5. Usar Readonly para Campos Deshabilitados

```jsx
<input
  type="text"
  value={value}
  readOnly  // No se puede editar pero se puede seleccionar
  disabled={false}
/>
```
