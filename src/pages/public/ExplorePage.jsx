import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PublicNavbar from '../../components/layout/PublicNavbar';
import { StoryCard, StoryCardGrid } from '../../components/StoryCard';
import { LoadingCard } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { PaginationControls } from '../../components/PaginationControls';
import { storiesService } from '../../services/storiesService';
import { Search, SlidersHorizontal } from 'lucide-react';

const GENRES = [
  'Todos',
  'Romance',
  'Fantasía',
  'Misterio',
  'Poesía',
  'Drama',
  'Ciencia Ficción',
  'Suspense',
];

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Más recientes' },
  { value: 'createdAt,asc', label: 'Más antiguos' },
  { value: 'viewCount,desc', label: 'Más vistas' },
  { value: 'rating,desc', label: 'Mayor rating' },
];

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stories, setStories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '0');
  const sort = searchParams.get('sort') || 'createdAt,desc';
  const genre = searchParams.get('genre') || 'Todos';

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          size: 12,
          sort,
          visibilityState: 'PUBLIC',
        };

        if (query) {
          params.q = query;
        }

        if (genre && genre !== 'Todos') {
          params.genre = genre;
        }

        const response = await storiesService.getStories(params);

        setStories(response.content || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        console.error('Error loading stories:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, [query, page, sort, genre]);

  const handleSearch = (e) => {
    const newQuery = e.target.value;
    setSearchParams((prev) => ({
      q: newQuery,
      page: '0',
      sort: prev.get('sort') || 'createdAt,desc',
      genre: prev.get('genre') || 'Todos',
    }));
  };

  const handleSort = (value) => {
    setSearchParams((prev) => ({
      q: prev.get('q') || '',
      page: '0',
      sort: value,
      genre: prev.get('genre') || 'Todos',
    }));
  };

  const handleGenreChange = (value) => {
    setSearchParams((prev) => ({
      q: prev.get('q') || '',
      page: '0',
      sort: prev.get('sort') || 'createdAt,desc',
      genre: value,
    }));
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({
      q: prev.get('q') || '',
      page: String(newPage),
      sort: prev.get('sort') || 'createdAt,desc',
      genre: prev.get('genre') || 'Todos',
    }));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-sand)] bg-[rgba(255,254,251,0.72)] px-5 py-2 text-sm font-semibold text-[var(--color-brown)]">
                <span className="text-lg">📚</span>
                Biblioteca Pública
              </span>
            </div>
            <h1 className="font-serif text-5xl font-bold text-[var(--color-text)] mb-3">
              Explorar historias
            </h1>
            <p className="text-[var(--color-muted)] font-sans text-lg">
              Descubre nuevas lecturas por género, autor o popularidad.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)] w-5 h-5" />
            <input
              type="search"
              placeholder="Buscar por título, autor o descripción..."
              value={query}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] font-sans text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)] focus:ring-offset-2"
            />
          </div>

          {/* Genre Filters */}
          <div className="flex gap-3 flex-wrap mb-6 pb-6 border-b border-[var(--color-border)]">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => handleGenreChange(g)}
                className={`px-4 py-2 rounded-full font-sans text-sm font-semibold transition-all ${
                  genre === g
                    ? 'bg-[var(--color-brown)] text-white'
                    : 'bg-[var(--color-light-accent)] text-[var(--color-brown)] hover:bg-[var(--color-sand)]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Sort and View Options */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[var(--color-muted)]" />
              <span className="text-sm font-sans text-[var(--color-muted)]">Ordenar por:</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSort(option.value)}
                  className={`px-3 py-1 rounded-full text-sm font-sans transition-all ${
                    sort === option.value
                      ? 'bg-[var(--color-brown)] text-white'
                      : 'border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-brown)] hover:text-[var(--color-brown)]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <LoadingCard count={12} />
        ) : error ? (
          <ErrorState message={error.message} onRetry={() => window.location.reload()} />
        ) : stories.length === 0 ? (
          <EmptyState
            title="Sin resultados"
            message={`No encontramos historias${query ? ` con "${query}"` : ''} en esta categoría. Intenta con otras palabras clave.`}
          />
        ) : (
          <>
            <StoryCardGrid stories={stories} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <PaginationControls
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
