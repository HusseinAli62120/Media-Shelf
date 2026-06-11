import formatApiData from "~~/server/utils/formatApiData";

export default defineEventHandler(async (event) => {
  try {
    const apiKey = process.env.NUXT_SHOW_MOVIE_API_KEY;

    if (!apiKey) {
      throw createError({
        status: 500,
        message: "Internal server error",
      });
    }

    // Get trending shows
    const showResponse: any = await $fetch(
      "https://api.themoviedb.org/3/tv/top_rated?language=en-US&include_adult=true&page=1",
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    // Get trending movies
    const movieResponse: any = await $fetch(
      `https://api.themoviedb.org/3/movie/top_rated?language=en-US&include_adult=true&page=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    if (
      showResponse?.results?.length > 0 ||
      movieResponse?.results?.length > 0
    ) {
      let topRatedShows = [];
      let topRatedMovies = [];

      // Format the returned shows
      topRatedShows = formatApiData(showResponse?.results, "show");
      // Format the returned movies
      topRatedMovies = formatApiData(movieResponse?.results, "movie");

      // Return the first ten elements of each array
      topRatedShows = topRatedShows.slice(0, 10);
      topRatedMovies = topRatedMovies.slice(0, 10);

      // Combine the arrays
      let topRated = topRatedShows.concat(topRatedMovies);
      // Shuffle the array
      topRated = topRated.sort(() => 0.5 - Math.random());
      return {
        status: 200,
        message: "Data fetched successfully",
        topRated: topRated,
        count: topRated.length,
      };
    }

    return {
      status: 400,
      message: "Unexpected error",
      topRated: [],
      count: 0,
    };
  } catch (error) {
    if (error) {
      console.log(error);
      throw error;
    }

    throw createError({
      status: 500,
      message: "Internal Server Error",
    });
  }
});
