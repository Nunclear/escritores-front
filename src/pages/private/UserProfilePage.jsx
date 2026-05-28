import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/AppShell';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import EditorialButton from '../../components/ui/EditorialButton';
import { useAuth } from '../../context/AuthContext';
import { Edit, LogOut, Save } from 'lucide-react';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    avatarUrl: user?.avatarUrl || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // TODO: Connect to actual user service to update profile
      alert('Perfil actualizado correctamente (integración pendiente)');
      setEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      try {
        logout();
        navigate('/');
      } catch (err) {
        console.error('Error logging out:', err);
        alert('Error al cerrar sesión');
      }
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-4xl font-bold text-[var(--color-text)]">
            Mi Perfil
          </h1>
          <div className="flex gap-3">
            {!editing && (
              <EditorialButton
                variant="secondary"
                onClick={() => setEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Editar
              </EditorialButton>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="space-y-8">
          {/* Avatar Section */}
          <div className="p-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <h2 className="font-serif text-2xl font-bold text-[var(--color-text)] mb-6">
              Foto de Perfil
            </h2>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-light-accent)] to-[var(--color-sand)] flex items-center justify-center text-4xl overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[var(--color-text)] font-sans font-semibold mb-2">
                  {user?.name || 'Usuario'}
                </p>
                <p className="text-sm text-[var(--color-muted)] font-sans mb-4">
                  {user?.email}
                </p>
                {editing && (
                  <input
                    type="text"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleInputChange}
                    placeholder="URL de la imagen de perfil..."
                    className="w-full px-4 py-2 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <h2 className="font-serif text-2xl font-bold text-[var(--color-text)] mb-6">
              Información Personal
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                  Nombre
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
                  />
                ) : (
                  <p className="text-[var(--color-text)] font-sans">{formData.name || 'No especificado'}</p>
                )}
              </div>

              <div>
                <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                  Email
                </label>
                <p className="text-[var(--color-muted)] font-sans">{formData.email}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                  Ubicación
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Tu ciudad..."
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
                  />
                ) : (
                  <p className="text-[var(--color-text)] font-sans">{formData.location || 'No especificada'}</p>
                )}
              </div>

              <div>
                <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                  Sitio Web
                </label>
                {editing ? (
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
                  />
                ) : (
                  <p className="text-[var(--color-text)] font-sans">
                    {formData.website ? (
                      <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-[var(--color-brown)] hover:underline">
                        {formData.website}
                      </a>
                    ) : (
                      'No especificado'
                    )}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                Biografía
              </label>
              {editing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Cuéntale a los demás sobre ti..."
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)] resize-none"
                />
              ) : (
                <p className="text-[var(--color-text)] font-sans whitespace-pre-wrap">
                  {formData.bio || 'No hay biografía'}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {editing && (
              <>
                <EditorialButton
                  onClick={handleSaveProfile}
                  isLoading={loading}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Guardar Cambios
                </EditorialButton>
                <EditorialButton
                  variant="secondary"
                  onClick={() => setEditing(false)}
                  className="flex-1"
                >
                  Cancelar
                </EditorialButton>
              </>
            )}
          </div>

          {/* Logout Button */}
          <div className="p-6 rounded-xl border border-red-200 bg-red-50">
            <h3 className="font-serif text-lg font-bold text-red-700 mb-2">
              Cerrar Sesión
            </h3>
            <p className="text-sm text-red-600 font-sans mb-4">
              Cierra tu sesión en esta plataforma.
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-sans font-semibold hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
