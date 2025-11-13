'use client';

import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  onEdit: (movie: Movie) => void;
  onDelete: (id: number) => void;
}

export default function MovieCard({ movie, onEdit, onDelete }: MovieCardProps) {
  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${movie.name}"?`)) {
      onDelete(movie.id);
    }
  };

  const handleEdit = () => {
    onEdit(movie);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-zinc-200 dark:border-zinc-800">
      {movie.imageUrl && (
        <div className="relative w-full h-48 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <img
            src={movie.imageUrl}
            alt={movie.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2 line-clamp-2">
          {movie.name}
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
          {movie.description}
        </p>
        <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-500 mb-4">
          <span>
            Created: {new Date(movie.createdAt).toLocaleDateString()}
          </span>
          {movie.updatedAt !== movie.createdAt && (
            <span>
              Updated: {new Date(movie.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

