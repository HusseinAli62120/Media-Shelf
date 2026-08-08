import { CastData } from "~~/shared/types/CastData";

export default function formatTvDetails({
  item,
  cast,
}: {
  item: any;
  cast: CastData[];
}) {
  const baseURL = process.env.NUXT_PUBLIC_SHOW_MOVIE_BASE_URL;
  const backdropURL = process.env.NUXT_PUBLIC_SHOW_MOVIE_BACKDROP_URL;

  return {
    id: item.id,
    title: item.name,
    tagline: item.tagline,
    original_language: item.original_language,
    overview: item.overview,
    poster_path: `${baseURL}${item.poster_path}`,
    backdrop_path: `${backdropURL}${item.backdrop_path}`,
    averageRating: item.vote_average, // vote_average
    release_date: item.first_air_date,
    status: item.status,
    number_of_episodes: item.number_of_episodes,
    number_of_seasons: item.number_of_seasons,
    voteCount: item?.vote_count,
    genres: item.genres.map((genre: any) => genre.name),
    cast: cast,
  };
}
