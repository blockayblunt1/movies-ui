import { Movie, CreateMovieDto, UpdateMovieDto } from '@/types/movie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://postbackend-y79c.onrender.com';

export async function getAllMovies(search?: string, sort: 'asc' | 'desc' = 'asc'): Promise<Movie[]> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  params.append('sort', sort);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/Movies?${params.toString()}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}. ${errorText}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend API at ${API_BASE_URL}. Make sure the backend is running.`);
    }
    throw error;
  }
}

export async function getMovieById(id: number): Promise<Movie> {
  const response = await fetch(`${API_BASE_URL}/api/Movies/${id}`);
  if (!response.ok) throw new Error('Failed to fetch movie');
  return response.json();
}

export async function createMovie(dto: CreateMovieDto): Promise<Movie> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to create movie: ${response.status} ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.title || errorMessage;
      } catch {
        if (errorText) errorMessage += `. ${errorText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend API at ${API_BASE_URL}. Make sure the backend is running.`);
    }
    throw error;
  }
}

export async function updateMovie(id: number, dto: UpdateMovieDto): Promise<Movie> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Movies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to update movie: ${response.status} ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.title || errorMessage;
      } catch {
        if (errorText) errorMessage += `. ${errorText}`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to backend API at ${API_BASE_URL}. Make sure the backend is running.`);
    }
    throw error;
  }
}

export async function deleteMovie(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/Movies/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete movie');
}
