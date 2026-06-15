import { ApiData } from "#shared/types/ApiData";

const formatApiData = (data: any[], media_type?: string) => {
  const baseURL = process.env.NUXT_PUBLIC_SHOW_MOVIE_BASE_URL;

  return data
    .map((item: ApiData) => ({
      id: item.id,
      // Uses 'name' (shows) or 'title' (movies)
      name: item.name || item?.title,
      first_air_date: item.first_air_date || item?.release_date,
      genre_id: item.genre_ids,
      origin_country: item.origin_country,
      original_language: item.original_language,
      original_name: item.original_name || item?.original_title,
      overview: item.overview,
      imgURL: `${baseURL}${item.poster_path}`,
      backdropPath: `${baseURL}${item.backdrop_path}`,
      averageRating: item.vote_average,
      vote_count: item.vote_count,
      popularity: item.popularity,
      media_type: item.media_type || media_type || "",
    }))
    .filter((item) => item.vote_count! > 20)
    .sort((a, b) => b.vote_count! - a.vote_count!);
};

export default formatApiData;
