export interface Movie {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMovieDto {
  name: string;
  description: string;
  imageUrl?: string | null;
}

export interface UpdateMovieDto {
  name: string;
  description: string;
  imageUrl?: string | null;
}

