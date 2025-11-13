'use client';

import { useState, useEffect } from 'react';
import { Movie, CreateMovieDto, UpdateMovieDto } from '@/types/movie';

interface MovieFormProps {
  movie?: Movie | null;
  onSubmit: (data: CreateMovieDto | UpdateMovieDto) => Promise<void>;
  onCancel: () => void;
}

export default function MovieForm({ movie, onSubmit, onCancel }: MovieFormProps) {
  const [name, setName] = useState(movie?.name || '');
  const [description, setDescription] = useState(movie?.description || '');
  const [imageUrl, setImageUrl] = useState(movie?.imageUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form fields when movie prop changes
  useEffect(() => {
    if (movie) {
      setName(movie.name || '');
      setDescription(movie.description || '');
      setImageUrl(movie.imageUrl || '');
    } else {
      setName('');
      setDescription('');
      setImageUrl('');
    }
    setError(null);
  }, [movie]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !description.trim()) {
      setError('Name and description are required');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim() || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save movie');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={200}
          required
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter movie name"
        />
        <p className="mt-1 text-xs text-zinc-500">{name.length}/200</p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          required
          rows={6}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Enter movie description"
        />
        <p className="mt-1 text-xs text-zinc-500">{description.length}/2000</p>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Image URL
        </label>
        <input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter image URL"
        />
        {imageUrl && (
          <div className="mt-2">
            <p className="text-sm text-zinc-500 mb-2">Preview:</p>
            <div className="relative w-full h-48 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-md transition-colors font-medium"
        >
          {isSubmitting ? 'Saving...' : movie ? 'Update Movie' : 'Create Movie'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-6 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 dark:text-zinc-50 rounded-md transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

