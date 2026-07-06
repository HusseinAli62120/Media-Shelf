export type MovieDetails = {
  id: number;
  title: string;
  tagline: string;
  origin_country: string;
  original_language: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  averageRating: string; // vote_average
  release_date: string;
  runtime: string;
  trailer: string;
  genres: string[];
};
