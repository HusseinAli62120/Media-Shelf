const formatMovieDetails = ({
  item,
  trailer,
}: {
  item: any;
  trailer: string;
}) => {
  const baseURL = process.env.NUXT_PUBLIC_SHOW_MOVIE_BASE_URL;
  const backdropURL = process.env.NUXT_PUBLIC_SHOW_MOVIE_BACKDROP_URL;

  // calculate the runtime
  let runtime = "";
  if (item.runtime) {
    runtime = `${Math.floor(item.runtime / 60)}h ${item.runtime % 60}m`;
  }

  return {
    id: item.id,
    title: item.title,
    tagline: item.tagline,
    origin_country: item.origin_country[0],
    original_language: item.original_language,
    overview: item.overview,
    poster_path: `${baseURL}${item.poster_path}`,
    backdrop_path: `${backdropURL}${item.backdrop_path}`,
    averageRating: item.vote_average,
    release_date: item.release_date,
    runtime: runtime,
    trailer: trailer || "",
    genres: item.genres.map((genre: any) => genre.name),
  };
};

export default formatMovieDetails;
