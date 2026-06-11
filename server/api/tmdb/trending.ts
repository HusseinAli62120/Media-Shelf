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
      "https://api.themoviedb.org/3/trending/tv/week?language=en-US",
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
      `https://api.themoviedb.org/3/trending/movie/week?language=en-US`,
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
      let trendingShows = [];
      let trendingMovies = [];

      // Format the returned shows
      trendingShows = formatApiData(showResponse?.results, "show");
      // Format the returned movies
      trendingMovies = formatApiData(movieResponse?.results, "movie");

      // Return the first ten elements of each array
      trendingShows = trendingShows.slice(0, 10);
      trendingMovies = trendingMovies.slice(0, 10);

      // Combine the arrays
      let trending = trendingShows.concat(trendingMovies);
      // Shuffle the array
      trending = trending.sort(() => 0.5 - Math.random());
      return {
        status: 200,
        message: "Data fetched successfully",
        trending: trending,
        count: trending.length,
      };
    }

    return {
      status: 400,
      message: "Unexpected error",
      trending: [],
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
