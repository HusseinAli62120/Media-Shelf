import { ApiData } from "#shared/types/ApiData";

const formatCardData = ({ item }: { item: any }) => {
  const baseURL = process.env.NUXT_PUBLIC_SHOW_MOVIE_BASE_URL;
  return item.map((value: ApiData) => {
    return {
      id: value.id,
      name: value.name || value.title,
      first_air_date: value.first_air_date || value?.release_date,
      overview: value.overview,
      imgURL: `${baseURL}${value.poster_path}`,
      averageRating: value.vote_average,
      media_type: value.media_type,
    };
  });
};

export default formatCardData;
