import { ApiData } from "#shared/types/ApiData";

const formatCardData = ({
  items,
  mediaType,
}: {
  items: any;
  mediaType?: "T.V" | "Movie";
}) => {
  const baseURL = process.env.NUXT_PUBLIC_SHOW_MOVIE_BASE_URL;
  return items.map((value: ApiData) => {
    return {
      mediaId: value.id,
      name: value.name || value.title,
      first_air_date: value.first_air_date || value?.release_date,
      overview: value.overview,
      imgURL: `${baseURL}${value.poster_path}`,
      averageRating: value.vote_average,
      media_type: value?.media_type?.toLowerCase() || mediaType?.toLowerCase(),
    };
  });
};

export default formatCardData;
