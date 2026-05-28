import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppShell } from '../../components/AppShell';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import EditorialButton from '../../components/ui/EditorialButton';
import { ChevronLeft, Plus, Edit, Trash2, Users } from 'lucide-react';

export default function CharactersManagerPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();

  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    appearance: '',
  });

  // In a real app, you would fetch from a characters service
  // For now, we'll just show the structure
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveCharacter = async () => {
    try {
      // TODO: Connect to actual characters service
      alert('Personaje guardado (integración pendiente)');
      setShowForm(false);
      setFormData({ name: '', role: '', description: '', appearance: '' });
    } catch (err) {
      console.error('Error saving character:', err);
      alert('Error al guardar el personaje');
    }
  };

  const handleDeleteCharacter = async (characterId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este personaje?')) {
      try {
        // TODO: Connect to actual characters service
        alert('Personaje eliminado (integración pendiente)');
      } catch (err) {
        console.error('Error deleting character:', err);
        alert('Error al eliminar el personaje');
      }
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to={`/app/historia/${storyId}`}
            className="flex items-center gap-2 text-[var(--color-brown)] hover:text-[var(--color-text)] transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-sans font-semibold">Volver</span>
          </Link>

          <EditorialButton
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Personaje
          </EditorialButton>
        </div>

        <h1 className="font-serif text-4xl font-bold text-[var(--color-text)] mb-2">
          Personajes
        </h1>
        <p className="text-[var(--color-muted)] font-sans mb-8">
          Crea y gestiona los personajes principales y secundarios de tu historia.
        </p>

        {/* Form */}
        {showForm && (
          <div className="mb-8 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <h2 className="font-serif text-2xl font-bold text-[var(--color-text)] mb-6">
              {editingId ? 'Editar Personaje' : 'Nuevo Personaje'}
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nombre del personaje..."
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
                />
              </div>

              <div>
                <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                  Rol
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="Ej: Protagonista, Antagonista, Personaje secundario..."
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                Apariencia
              </label>
              <textarea
                name="appearance"
                value={formData.appearance}
                onChange={handleInputChange}
                placeholder="Describe la apariencia física del personaje..."
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)] resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                Descripción / Historia
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Cuéntale al lector más sobre este personaje..."
                rows="6"
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)] resize-none"
              />
            </div>

            <div className="flex gap-3">
              <EditorialButton onClick={handleSaveCharacter} className="flex-1">
                {editingId ? 'Actualizar Personaje' : 'Crear Personaje'}
              </EditorialButton>
              <EditorialButton
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: '', role: '', description: '', appearance: '' });
                }}
              >
                Cancelar
              </EditorialButton>
            </div>
          </div>
        )}

        {/* Characters List */}
        {characters.length === 0 ? (
          <EmptyState
            title="Sin personajes"
            message="Aún no has creado personajes para tu historia. ¡Empieza a darle vida a tus personajes!"
            icon="👥"
            action="Crear Personaje"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {characters.map((character) => (
              <div
                key={character.id}
                className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <h3 className="font-serif text-xl font-bold text-[var(--color-text)] mb-1">
                  {character.name}
                </h3>
                <p className="text-sm text-[var(--color-brown)] font-sans font-semibold mb-3">
                  {character.role}
                </p>
                <p className="text-sm text-[var(--color-muted)] font-sans mb-4">
                  {character.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(character.id);
                      setFormData(character);
                      setShowForm(true);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] font-sans font-semibold text-sm hover:border-[var(--color-brown)] hover:text-[var(--color-brown)] transition-all flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteCharacter(character.id)}
                    className="px-3 py-2 rounded-lg border border-red-200 text-red-600 font-sans font-semibold text-sm hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
