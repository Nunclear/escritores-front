import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PublicNavbar from '../../components/layout/PublicNavbar';
import { LoadingState } from '../../components/LoadingState';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { PaginationControls } from '../../components/PaginationControls';
import { usersService } from '../../services/usersService';
import { Search, User, BookOpen, Heart } from 'lucide-react';

export default function AuthorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [authors, setAuthors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '0');
  const sort = searchParams.get('sort') || 'createdAt,desc';

  useEffect(() => {
    const loadAuthors = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          size: 12,
          sort,
        };

        if (query) {
          params.q = query;
        }

        const response = await usersService.getAuthors(params);

        setAuthors(response.content || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        console.error('Error loading authors:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadAuthors();
  }, [query, page, sort]);

  const handleSearch = (e) => {
    const newQuery = e.target.value;
    setSearchParams((prev) => ({
      q: newQuery,
      page: '0',
      sort: prev.get('sort') || 'createdAt,desc',
    }));
  };

  const handleSort = (value) => {
    setSearchParams((prev) => ({
      q: prev.get('q') || '',
      page: '0',
      sort: value,
    }));
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({
      q: prev.get('q') || '',
      page: String(newPage),
      sort: prev.get('sort') || 'createdAt,desc',
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
                <span className="text-lg">✍️</span>
                Comunidad de Autores
              </span>
            </div>
            <h1 className="font-serif text-5xl font-bold text-[var(--color-text)] mb-3">
              Autores
            </h1>
            <p className="text-[var(--color-muted)] font-sans text-lg">
              Descubre los escritores más activos de nuestra comunidad.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-muted)] w-5 h-5" />
            <input
              type="search"
              placeholder="Buscar autores por nombre..."
              value={query}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] font-sans text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brown)] focus:ring-offset-2"
            />
          </div>

          {/* Sort Options */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-[var(--color-border)]">
            <span className="text-sm font-sans text-[var(--color-muted)]">Ordenar por:</span>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'createdAt,desc', label: 'Más recientes' },
                { value: 'createdAt,asc', label: 'Más antiguos' },
                { value: 'storyCount,desc', label: 'Más historias' },
                { value: 'followers,desc', label: 'Más seguidores' },
              ].map((option) => (
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error.message} onRetry={() => window.location.reload()} />
        ) : authors.length === 0 ? (
          <EmptyState
            title="Sin resultados"
            message={`No encontramos autores${query ? ` con "${query}"` : ''}. Intenta con otros términos.`}
          />
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:shadow-[var(--shadow-warm-lg)] transition-shadow group"
                >
                  {/* Cover/Background */}
                  <div className="h-24 bg-gradient-to-r from-[var(--color-light-accent)] to-[var(--color-sand)] relative overflow-hidden">
                    {author.coverImageUrl && (
                      <img
                        src={author.coverImageUrl}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>

                  {/* Author Info */}
                  <div className="p-6 text-center -mt-12 relative z-10">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-[var(--color-surface)] border-4 border-[var(--color-bg)] mx-auto mb-3 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {author.profileImageUrl ? (
                        <img
                          src={author.profileImageUrl}
                          alt={author.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-[var(--color-muted)]" />
                      )}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[var(--color-text)]">
                      {author.displayName}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)] font-sans mb-4">
                      @{author.username}
                    </p>

                    {author.bio && (
                      <p className="text-sm text-[var(--color-text)] font-sans leading-relaxed mb-4 line-clamp-2">
                        {author.bio}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 py-4 border-y border-[var(--color-border)] mb-4">
                      <div>
                        <p className="font-semibold text-[var(--color-text)] text-lg">
                          {author.storyCount || 0}
                        </p>
                        <p className="text-xs text-[var(--color-muted)] font-sans">
                          Historias
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-text)] text-lg">
                          {author.followerCount || 0}
                        </p>
                        <p className="text-xs text-[var(--color-muted)] font-sans">
                          Seguidores
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-text)] text-lg">
                          {author.rating?.toFixed(1) || '0.0'}
                        </p>
                        <p className="text-xs text-[var(--color-muted)] font-sans">
                          Rating
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 rounded-full bg-[var(--color-brown)] text-white font-sans font-semibold hover:bg-[#6d4423] transition-colors text-sm">
                        Ver historias
                      </button>
                      <button className="flex-1 px-4 py-2 rounded-full border border-[var(--color-border)] text-[var(--color-muted)] font-sans font-semibold hover:border-[var(--color-brown)] hover:text-[var(--color-brown)] transition-colors text-sm">
                        Seguir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
