import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { EditorialButton } from '../components/EditorialButton';
import { TextInput } from '../components/FormInputs';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../context/AuthContext';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Por favor ingresa tu email');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await forgotPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Error al enviar instrucciones. Intenta de nuevo.');
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
              Revisa tu email
            </h1>
            <p className="text-text-secondary font-sans mb-6">
              Te hemos enviado instrucciones para restablecer tu contraseña. Revisa tu correo (y carpeta de spam).
            </p>

            <Link
              to="/login"
              className="text-coffee hover:text-sand font-medium font-sans"
            >
              Volver a iniciar sesión
            </Link>
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
            Recuperar contraseña
          </h1>
          <p className="text-text-secondary font-sans text-sm mb-6">
            Ingresa tu email para recibir instrucciones de recuperación
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
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <EditorialButton
              variant="primary"
              type="submit"
              loading={loading}
              className="w-full"
            >
              Enviar instrucciones
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
