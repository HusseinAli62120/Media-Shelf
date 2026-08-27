import type { CastData } from "./CastData";

export type TvDetails = {
  id: number;
  title: string;
  tagline: string;
  original_language: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  averageRating: string; // vote_average
  release_date: string;
  status: string;
  number_of_episodes: number;
  number_of_seasons: number;
  voteCount: number;
  genres: string[];
  cast: CastData[];
};
