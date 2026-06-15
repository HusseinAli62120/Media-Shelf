export type ApiData = {
  backdrop_path?: string;
  first_air_date: string;
  release_date?: string; // For movies
  genre_ids: number[];
  id: number;
  name: string;
  title?: string; // For movies
  origin_country: string[];
  original_language: string;
  original_name?: string;
  original_title?: string; // For movies
  overview: string;
  popularity?: number;
  poster_path?: string;
  vote_average?: number;
  vote_count?: number;
  // Derived properties
  imgURL: string;
  backdropURL: string;
  averageRating: number;
  media_type?: "movie" | "tv";
};
