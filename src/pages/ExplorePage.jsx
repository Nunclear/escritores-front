import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { StoryCard, StoryCardGrid } from '../components/StoryCard';
import { TextInput, SelectInput } from '../components/FormInputs';
import { LoadingCard } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { EmptyState } from '../components/EmptyState';
import { PaginationControls } from '../components/PaginationControls';
import { storiesService } from '../services/storiesService';

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stories, setStories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '0');
  const sort = searchParams.get('sort') || 'createdAt,desc';
  const visibility = searchParams.get('visibility') || 'public';

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          size: 12,
          sort,
          visibilityState: visibility,
        };

        if (query) {
          params.q = query;
        }

        const response = query
          ? await storiesService.searchStories(params)
          : await storiesService.getStories(params);

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
  }, [query, page, sort, visibility]);

  const handleSearch = (e) => {
    const newQuery = e.target.value;
    setSearchParams({ q: newQuery, page: '0' });
  };

  const handleSort = (e) => {
    setSearchParams((prev) => ({
      ...prev,
      sort: e.target.value,
      page: '0',
    }));
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({
      ...prev,
      page: String(newPage),
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-text-primary mb-4">
            Explorar Historias
          </h1>
          <p className="text-text-secondary font-sans mb-6">
            Descubre las historias más cautivadoras de nuestra comunidad
          </p>

          {/* Search & Filters */}
          <div className="editorial-card p-6 space-y-4 md:flex md:gap-4 md:space-y-0">
            <div className="flex-1">
              <TextInput
                placeholder="Busca por título, autor o descripción..."
                value={query}
                onChange={handleSearch}
                type="search"
              />
            </div>
            <div className="md:w-48">
              <SelectInput
                value={sort}
                onChange={handleSort}
                options={[
                  { value: 'createdAt,desc', label: 'Más recientes' },
                  { value: 'createdAt,asc', label: 'Más antiguos' },
                  { value: 'viewCount,desc', label: 'Más vistas' },
                  { value: 'rating,desc', label: 'Mayor rating' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <LoadingCard count={12} />
        ) : error ? (
          <ErrorState onRetry={() => window.location.reload()} />
        ) : stories.length === 0 ? (
          <EmptyState
            title="Sin resultados"
            message={`No encontramos historias con "${query}". Intenta con otras palabras clave.`}
            icon="🔍"
          />
        ) : (
          <>
            <StoryCardGrid stories={stories} />

            {/* Pagination */}
            {totalPages > 1 && (
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                totalItems={stories.length * totalPages}
                pageSize={12}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
