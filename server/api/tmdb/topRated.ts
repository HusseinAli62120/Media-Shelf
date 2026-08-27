import formatCardData from "~~/server/utils/formatCardData";
import type { CardData } from "#shared/types/CardData";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    await requireAuth({ event: event });

    const apiKey = process.env.NUXT_SHOW_MOVIE_API_KEY;

    if (!apiKey) {
      throw createError({
        status: 500,
        message: "Internal server error",
      });
    }

    // Random number between 1-5
    const randomPage = Math.floor(Math.random() * 10) + 1;

    // For most relevent results
    const sortBy = "vote_count.desc";

    // Get top rated shows
    const showResponse: any = await $fetch(
      `https://api.themoviedb.org/3/discover/tv?language=en-US&include_adult=true&page=${randomPage}&sort_by=${sortBy}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    // Get top rated movies
    const movieResponse: any = await $fetch(
      `https://api.themoviedb.org/3/discover/movie?language=en-US&include_adult=true&page=${randomPage}&sort_by=${sortBy}`,
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
      topRatedShows = formatCardData({
        items: showResponse?.results,
        mediaType: "tv",
      });
      // Format the returned movies
      topRatedMovies = formatCardData({
        items: movieResponse?.results,
        mediaType: "movie",
      });

      // Shuffle the arrays
      topRatedShows = topRatedShows.sort(() => 0.5 - Math.random());
      topRatedMovies = topRatedMovies.sort(() => 0.5 - Math.random());

      // Return the first six elements of each array
      topRatedShows = topRatedShows.slice(0, 6);
      topRatedMovies = topRatedMovies.slice(0, 6);

      // Combine the arrays
      let topRated = topRatedShows.concat(topRatedMovies);

      topRated = optimizeApiResults({ data: topRated });

      // Shuffle the array
      topRated = topRated.sort(() => 0.5 - Math.random());
      return {
        status: 200,
        message: "Data fetched successfully",
        topRated: topRated as CardData[],
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
