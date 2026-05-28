import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { EditorialButton } from '../components/EditorialButton';
import { TextInput } from '../components/FormInputs';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../context/AuthContext';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const resetToken = searchParams.get('token');

  useEffect(() => {
    if (!resetToken) {
      setError('Token inválido o expirado. Por favor solicita uno nuevo.');
    }
  }, [resetToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await resetPassword(resetToken, formData.password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error al restablecer contraseña. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNavbar />

        <div className="max-w-md mx-auto py-16 px-6">
          <div className="editorial-card p-8 text-center">
            <h1 className="font-serif text-3xl font-bold text-text-primary mb-4">
              Contraseña restablecida
            </h1>
            <p className="text-text-secondary font-sans mb-6">
              Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </p>

            <EditorialButton
              variant="primary"
              onClick={() => navigate('/login')}
            >
              Ir a iniciar sesión
            </EditorialButton>
          </div>
        </div>
      </div>
    );
  }

  if (!resetToken) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNavbar />

        <div className="max-w-md mx-auto py-16 px-6">
          <div className="editorial-card p-8">
            <Alert
              type="error"
              title="Token inválido"
              message="Por favor solicita un nuevo correo de recuperación"
            />
            <div className="mt-6">
              <Link
                to="/forgot-password"
                className="text-coffee hover:text-sand font-medium font-sans"
              >
                Solicitar nuevo correo
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      <div className="max-w-md mx-auto py-16 px-6">
        <div className="editorial-card p-8">
          <h1 className="font-serif text-3xl font-bold text-text-primary mb-2">
            Restablecer contraseña
          </h1>
          <p className="text-text-secondary font-sans text-sm mb-6">
            Ingresa tu nueva contraseña
          </p>

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="Nueva contraseña"
              name="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <TextInput
              label="Confirmar contraseña"
              name="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <EditorialButton
              variant="primary"
              type="submit"
              loading={loading}
              className="w-full"
            >
              Restablecer contraseña
            </EditorialButton>
          </form>

          <div className="mt-6 text-center border-t border-cream pt-6">
            <Link
              to="/login"
              className="text-coffee hover:text-sand font-medium text-sm font-sans"
            >
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
