'use client';

import { useState, useEffect } from 'react';
import { Movie, CreateMovieDto, UpdateMovieDto } from '@/types/movie';
import { getAllMovies, createMovie, updateMovie, deleteMovie } from '@/lib/api';
import MovieCard from '@/components/MovieCard';
import MovieForm from '@/components/MovieForm';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const loadMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMovies(search || undefined, sort);
      setMovies(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load movies';
      setError(errorMessage);
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort]);

  const handleCreate = async (dto: CreateMovieDto) => {
    try {
      await createMovie(dto);
      setShowForm(false);
      setError(null);
      await loadMovies();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create movie';
      setError(errorMessage);
      throw err; // Re-throw so MovieForm can also show the error
    }
  };

  const handleUpdate = async (dto: UpdateMovieDto) => {
    if (!editingMovie) return;
    try {
      await updateMovie(editingMovie.id, dto);
      setEditingMovie(null);
      setError(null);
      await loadMovies();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update movie';
      setError(errorMessage);
      throw err; // Re-throw so MovieForm can also show the error
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMovie(id);
      await loadMovies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete movie');
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMovie(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Movie Management
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage your movies with ease
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full sm:w-auto">
            <div className="flex-1 sm:max-w-xs">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="asc">Sort A-Z</option>
              <option value="desc">Sort Z-A</option>
            </select>
          </div>
          <button
            onClick={() => {
              setEditingMovie(null);
              setShowForm(true);
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium whitespace-nowrap"
          >
            + Create Movie
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-600 dark:text-red-400 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Form Modal */}
        {(showForm || editingMovie) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
                {editingMovie ? 'Edit Movie' : 'Create New Movie'}
              </h2>
              <MovieForm
                movie={editingMovie}
                onSubmit={editingMovie ? handleUpdate : handleCreate}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading movies...</p>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && (
          <>
            {movies.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                  {search ? 'No movies found matching your search.' : 'No movies yet. Create your first movie!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
