import React, { useState, useEffect } from 'react';
import { PublicNavbar } from '../../components/PublicNavbar';
import { StoryCardGrid } from '../../components/StoryCard';
import { EditorialButton } from '../../components/EditorialButton';
import { TextInput, SelectInput } from '../../components/FormInputs';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { Tabs } from '../../components/ui/Tabs';
import { storiesService } from '../../api';
import { Search, Filter } from 'lucide-react';

export function ExplorePage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('trending');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const genres = [
    { value: '', label: 'Todos los géneros' },
    { value: 'fantasia', label: 'Fantasía' },
    { value: 'romance', label: 'Romance' },
    { value: 'ciencia-ficcion', label: 'Ciencia Ficción' },
    { value: 'misterio', label: 'Misterio' },
    { value: 'drama', label: 'Drama' },
    { value: 'suspenso', label: 'Suspenso' },
  ];

  const sortOptions = [
    { value: 'trending', label: 'En tendencia' },
    { value: 'recent', label: 'Más reciente' },
    { value: 'popular', label: 'Más popular' },
    { value: 'rating', label: 'Mejor valoradas' },
  ];

  useEffect(() => {
    loadStories();
  }, [searchQuery, selectedGenre, sortBy, page]);

  const loadStories = async () => {
    try {
      setLoading(true);
      let response;

      if (searchQuery) {
        response = await storiesService.searchStories(searchQuery, page, 12);
      } else if (selectedGenre) {
        response = await storiesService.filterStories(
          { genre: selectedGenre },
          page,
          12
        );
      } else if (sortBy === 'trending') {
        response = await storiesService.getTrendingStories(page, 12);
      } else {
        response = await storiesService.listStories(page, 12, `${sortBy},desc`);
      }

      setStories(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Error loading stories:', err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSortBy('trending');
    setPage(0);
  };

  const tabsData = [
    {
      label: 'Todas',
      content: (
        <div className="space-y-6">
          {loading ? (
            <LoadingState />
          ) : stories.length === 0 ? (
            <EmptyState
              title="No hay historias"
              message="Intenta ajustando tus filtros de búsqueda"
            />
          ) : (
            <>
              <StoryCardGrid stories={stories} variant="default" />
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <EditorialButton
                    variant="secondary"
                    disabled={page === 0}
                    onClick={() => setPage(Math.max(0, page - 1))}
                  >
                    Anterior
                  </EditorialButton>
                  <span className="px-4 py-2 text-center">
                    Página {page + 1} de {totalPages}
                  </span>
                  <EditorialButton
                    variant="secondary"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                  >
                    Siguiente
                  </EditorialButton>
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
    {
      label: 'Recomendadas',
      content: (
        <div>
          <div className="text-center py-8 text-text-secondary">
            Basadas en tus lecturas favoritas
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-text-primary mb-4">
            Explorar historias
          </h1>
          <p className="text-text-secondary font-sans">
            Descubre miles de historias de autores de todo el mundo
          </p>
        </div>

        {/* Filters */}
        <div className="editorial-card p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TextInput
                placeholder="Buscar historias..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SelectInput
                options={genres}
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              />
              <SelectInput
                options={sortOptions}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              />
              <div className="flex gap-2">
                <EditorialButton type="submit" variant="primary" className="flex-1">
                  Buscar
                </EditorialButton>
                <EditorialButton
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                >
                  Limpiar
                </EditorialButton>
              </div>
            </div>
          </form>
        </div>

        {/* Content */}
        <Tabs tabs={tabsData} />
      </main>
    </div>
  );
}

export default ExplorePage;
