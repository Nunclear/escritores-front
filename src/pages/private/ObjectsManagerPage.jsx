import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppShell } from '../../components/AppShell';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import EditorialButton from '../../components/ui/EditorialButton';
import { ChevronLeft, Plus, Edit, Trash2 } from 'lucide-react';

export default function ObjectsManagerPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();

  const [objects, setObjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    significance: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveObject = async () => {
    try {
      // TODO: Connect to actual objects service
      alert('Objeto guardado (integración pendiente)');
      setShowForm(false);
      setFormData({ name: '', type: '', description: '', significance: '' });
    } catch (err) {
      console.error('Error saving object:', err);
      alert('Error al guardar el objeto');
    }
  };

  const handleDeleteObject = async (objectId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este objeto?')) {
      try {
        // TODO: Connect to actual objects service
        alert('Objeto eliminado (integración pendiente)');
      } catch (err) {
        console.error('Error deleting object:', err);
        alert('Error al eliminar el objeto');
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
            Nuevo Objeto
          </EditorialButton>
        </div>

        <h1 className="font-serif text-4xl font-bold text-[var(--color-text)] mb-2">
          Objetos Importantes
        </h1>
        <p className="text-[var(--color-muted)] font-sans mb-8">
          Define objetos, artefactos o elementos importantes en tu narrativa.
        </p>

        {/* Form */}
        {showForm && (
          <div className="mb-8 p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <h2 className="font-serif text-2xl font-bold text-[var(--color-text)] mb-6">
              {editingId ? 'Editar Objeto' : 'Nuevo Objeto'}
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                  Nombre del Objeto
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: La Espada Ancestral..."
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
                />
              </div>

              <div>
                <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                  Tipo
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Ej: Arma, Joya, Libro, Documento..."
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)]"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                Descripción Física
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="¿Cómo se ve? ¿Cuáles son sus características?"
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)] resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="block font-sans font-semibold text-[var(--color-text)] mb-2">
                Significado / Importancia en la Historia
              </label>
              <textarea
                name="significance"
                value={formData.significance}
                onChange={handleInputChange}
                placeholder="¿Por qué es importante? ¿Qué rol juega en la trama?"
                rows="4"
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder-[var(--color-muted)] font-sans focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)] resize-none"
              />
            </div>

            <div className="flex gap-3">
              <EditorialButton onClick={handleSaveObject} className="flex-1">
                {editingId ? 'Actualizar Objeto' : 'Crear Objeto'}
              </EditorialButton>
              <EditorialButton
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: '', type: '', description: '', significance: '' });
                }}
              >
                Cancelar
              </EditorialButton>
            </div>
          </div>
        )}

        {/* Objects List */}
        {objects.length === 0 ? (
          <EmptyState
            title="Sin objetos"
            message="Aún no has creado objetos importantes. ¡Agrega elementos que enriquezcan tu narrativa!"
            icon="🗝️"
            action="Crear Objeto"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {objects.map((obj) => (
              <div
                key={obj.id}
                className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <h3 className="font-serif text-xl font-bold text-[var(--color-text)] mb-1">
                  {obj.name}
                </h3>
                <p className="text-sm text-[var(--color-brown)] font-sans font-semibold mb-3">
                  {obj.type}
                </p>
                <p className="text-sm text-[var(--color-muted)] font-sans mb-2">
                  <strong>Descripción:</strong> {obj.description}
                </p>
                <p className="text-sm text-[var(--color-muted)] font-sans mb-4">
                  <strong>Importancia:</strong> {obj.significance}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(obj.id);
                      setFormData(obj);
                      setShowForm(true);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] font-sans font-semibold text-sm hover:border-[var(--color-brown)] hover:text-[var(--color-brown)] transition-all flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteObject(obj.id)}
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
