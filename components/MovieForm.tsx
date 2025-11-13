'use client';

import { useState, useEffect } from 'react';
import { Movie, CreateMovieDto, UpdateMovieDto } from '@/types/movie';

interface MovieFormProps {
  movie?: Movie | null;
  onSubmit: (data: CreateMovieDto | UpdateMovieDto) => Promise<void>;
  onCancel: () => void;
}

export default function MovieForm({ movie, onSubmit, onCancel }: MovieFormProps) {
  const [title, setTitle] = useState(movie?.title || '');
  const [genre, setGenre] = useState(movie?.genre || '');
  const [rating, setRating] = useState(movie?.rating?.toString() || '1');
  const [posterImage, setPosterImage] = useState(movie?.posterImage || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form fields when movie prop changes
  useEffect(() => {
    if (movie) {
      setTitle(movie.title || '');
      setGenre(movie.genre || '');
      setRating(movie.rating?.toString() || '1');
      setPosterImage(movie.posterImage || '');
    } else {
      setTitle('');
      setGenre('');
      setRating('1');
      setPosterImage('');
    }
    setError(null);
  }, [movie]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !genre.trim()) {
      setError('Title and genre are required');
      return;
    }

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5 || !Number.isInteger(parseFloat(rating))) {
      setError('Rating must be a whole number between 1 and 5');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        genre: genre.trim(),
        rating: ratingNum,
        posterImage: posterImage.trim() || null,
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
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter movie title"
        />
        <p className="mt-1 text-xs text-zinc-500">{title.length}/200</p>
      </div>

      <div>
        <label htmlFor="genre" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Genre *
        </label>
        <input
          type="text"
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          maxLength={100}
          required
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter movie genre (e.g., Action, Drama, Comedy)"
        />
        <p className="mt-1 text-xs text-zinc-500">{genre.length}/100</p>
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Rating * (1-5)
        </label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '' || (Number.isInteger(parseFloat(value)) && parseFloat(value) >= 1 && parseFloat(value) <= 5)) {
              setRating(value);
            }
          }}
          min="1"
          max="5"
          step="1"
          required
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter rating (1-5)"
        />
        <p className="mt-1 text-xs text-zinc-500">Rating: {rating}/5</p>
      </div>

      <div>
        <label htmlFor="posterImage" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Poster Image URL
        </label>
        <input
          type="url"
          id="posterImage"
          value={posterImage}
          onChange={(e) => setPosterImage(e.target.value)}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter poster image URL"
        />
        {posterImage && (
          <div className="mt-2">
            <p className="text-sm text-zinc-500 mb-2">Preview:</p>
            <div className="relative w-full h-48 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden">
              <img
                src={posterImage}
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
