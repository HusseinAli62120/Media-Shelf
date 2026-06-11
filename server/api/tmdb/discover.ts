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
      "https://api.themoviedb.org/3/discover/tv?language=en-US&include_adult=true&page=1",
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
      `https://api.themoviedb.org/3/discover/movie?language=en-US&include_adult=true&page=1`,
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
      let discoveredShows = [];
      let discoveredMovies = [];

      // Format the returned shows
      discoveredShows = formatApiData(showResponse?.results, "show");
      // Format the returned movies
      discoveredMovies = formatApiData(movieResponse?.results, "movie");

      // Shuffle and return the first ten elements of each array
      discoveredShows = discoveredShows
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);
      discoveredMovies = discoveredMovies
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

      // Combine the arrays
      let discovered = discoveredShows.concat(discoveredMovies);
      // Shuffle the array
      discovered = discovered.sort(() => 0.5 - Math.random());
      return {
        status: 200,
        message: "Data fetched successfully",
        discovered: discovered,
        count: discovered.length,
      };
    }

    return {
      status: 400,
      message: "Unexpected error",
      discovered: [],
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
