import optimizeApiResults from "~~/server/utils/optimizeApiResults";

export default defineEventHandler(async (event) => {
  try {
    const apiKey = process.env.NUXT_SHOW_MOVIE_API_KEY;
    if (!apiKey) {
      throw createError({
        statusCode: 500,
        message: "Internal Server Error",
      });
    }

    const { viewMoreType, page, fetchShows, fetchMovies } = getQuery(event);

    if (!viewMoreType || !page) {
      throw createError({
        statusCode: 400,
        message: "Bad Request Parameters",
      });
    }

    let sortBy =
      viewMoreType === "topRated" ? "vote_count.desc" : "popularity.desc";
    let showResponse: any;
    // Get trending shows
    if (fetchShows) {
      showResponse = await $fetch(
        `https://api.themoviedb.org/3/discover/tv?language=en-US&include_adult=true&page=${page}&sort_by=${sortBy}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );
    }

    let movieResponse: any;
    // Get trending movies
    if (fetchMovies) {
      movieResponse = await $fetch(
        `https://api.themoviedb.org/3/discover/movie?language=en-US&include_adult=true&page=${page}&sort_by=${sortBy}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );
    }

    if (
      showResponse?.results?.length > 0 ||
      movieResponse?.results?.length > 0
    ) {
      let shows = [];
      let movies = [];

      // Format the returned shows
      shows = formatCardData({
        items: showResponse?.results,
        mediaType: "tv",
      });
      // Format the returned movies
      movies = formatCardData({
        items: movieResponse?.results,
        mediaType: "movie",
      });

      let data = [...movies, ...shows];
      data = optimizeApiResults({ data });

      // Shuffle the array so movies and shows are mixed
      data = data.sort(() => 0.5 - Math.random());
      // Sort by rating if top rated
      if (viewMoreType === "topRated") {
        data = data.sort((a, b) => b.averageRating - a.averageRating);
      }

      const totalShowPages: number = showResponse?.total_pages ?? 1;
      const totalMoviePages: number = movieResponse?.total_pages ?? 1;

      return {
        statusCode: 200,
        message: "Data fetched successfully",
        viewMoreData: data as CardData[],
        totalMoviePages: totalMoviePages,
        totalShowPages: totalShowPages,
      };
    }

    return {
      statusCode: 400,
      message: "Unexpected Error",
      viewMoreData: [],
      totalShowPages: 0,
      totalMoviePages: 0,
    };
  } catch (error) {
    if (error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});
