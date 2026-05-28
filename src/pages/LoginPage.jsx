import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { EditorialButton } from '../components/EditorialButton';
import { TextInput } from '../components/FormInputs';
import { ErrorAlert } from '../components/ErrorState';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    loginOrEmail: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.loginOrEmail || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Error al iniciar sesión. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      <div className="max-w-md mx-auto py-16 px-6">
        <div className="editorial-card p-8">
          {/* Header */}
          <h1 className="font-serif text-3xl font-bold text-text-primary mb-2">
            Iniciar sesión
          </h1>
          <p className="text-text-secondary font-sans text-sm mb-6">
            Accede a tu cuenta para continuar escribiendo
          </p>

          {/* Error */}
          {error && (
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="Usuario o Email"
              name="loginOrEmail"
              type="text"
              placeholder="usuario o email@ejemplo.com"
              value={formData.loginOrEmail}
              onChange={handleChange}
              required
            />

            <TextInput
              label="Contraseña"
              name="password"
              type="password"
              placeholder="Tu contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <EditorialButton
              variant="primary"
              type="submit"
              loading={loading}
              className="w-full"
            >
              Iniciar sesión
            </EditorialButton>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-3 text-center">
            <div>
              <Link
                to="/forgot-password"
                className="text-coffee hover:text-sand text-sm font-sans"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="border-t border-cream pt-3">
              <span className="text-text-secondary font-sans text-sm">
                ¿No tienes cuenta?{' '}
              </span>
              <Link
                to="/register"
                className="text-coffee hover:text-sand font-medium text-sm font-sans"
              >
                Crea una aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
