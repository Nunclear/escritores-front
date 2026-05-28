import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { EditorialButton } from '../components/EditorialButton';
import { TextInput, CheckboxInput } from '../components/FormInputs';
import { ErrorAlert } from '../components/ErrorState';
import { useAuth } from '../context/AuthContext';
import {
  validateEmail,
  validatePassword,
  validateLoginName,
} from '../utils/helpers';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    loginName: '',
    emailAddress: '',
    displayName: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateLoginName(formData.loginName)) {
      newErrors.loginName = 'Usuario debe tener al menos 3 caracteres (letras, números, guiones)';
    }

    if (!validateEmail(formData.emailAddress)) {
      newErrors.emailAddress = 'Email inválido';
    }

    if (!formData.displayName) {
      newErrors.displayName = 'Nombre requerido';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Contraseña debe tener al menos 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Debe aceptar los términos y condiciones';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Register
      await register({
        loginName: formData.loginName,
        emailAddress: formData.emailAddress,
        displayName: formData.displayName,
        password: formData.password,
      });

      // Auto-login
      await login({
        loginOrEmail: formData.loginName,
        password: formData.password,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      <div className="max-w-md mx-auto py-12 px-6">
        <div className="editorial-card p-8">
          {/* Header */}
          <h1 className="font-serif text-3xl font-bold text-text-primary mb-2">
            Crear cuenta
          </h1>
          <p className="text-text-secondary font-sans text-sm mb-6">
            Únete a nuestra comunidad de escritores
          </p>

          {/* Error */}
          {error && (
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="Nombre de usuario"
              name="loginName"
              type="text"
              placeholder="tu_usuario"
              value={formData.loginName}
              onChange={handleChange}
              error={errors.loginName}
              hint="Mínimo 3 caracteres"
              required
            />

            <TextInput
              label="Email"
              name="emailAddress"
              type="email"
              placeholder="tu@email.com"
              value={formData.emailAddress}
              onChange={handleChange}
              error={errors.emailAddress}
              required
            />

            <TextInput
              label="Nombre completo"
              name="displayName"
              type="text"
              placeholder="Tu Nombre"
              value={formData.displayName}
              onChange={handleChange}
              error={errors.displayName}
              required
            />

            <TextInput
              label="Contraseña"
              name="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              hint="Debe tener mayúsculas, minúsculas y números"
              required
            />

            <TextInput
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <CheckboxInput
              label="Acepto los términos y condiciones de uso"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              error={errors.agreeToTerms}
            />

            <EditorialButton
              variant="primary"
              type="submit"
              loading={loading}
              className="w-full"
            >
              Crear cuenta
            </EditorialButton>
          </form>

          {/* Links */}
          <div className="mt-6 text-center border-t border-cream pt-6">
            <span className="text-text-secondary font-sans text-sm">
              ¿Ya tienes cuenta?{' '}
            </span>
            <Link
              to="/login"
              className="text-coffee hover:text-sand font-medium text-sm font-sans"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
