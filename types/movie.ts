export interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  posterImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMovieDto {
  title: string;
  genre: string;
  rating: number;
  posterImage?: string | null;
}

export interface UpdateMovieDto {
  title: string;
  genre: string;
  rating: number;
  posterImage?: string | null;
}
