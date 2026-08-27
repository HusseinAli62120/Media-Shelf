import formatCardData from "~~/server/utils/formatCardData";
import type { CardData } from "#shared/types/CardData";

export default defineEventHandler(async (event) => {
  try {
    await requireAuth({ event: event });
    const apiKey = process.env.NUXT_SHOW_MOVIE_API_KEY;

    if (!apiKey) {
      throw createError({
        status: 500,
        message: "Internal server error",
      });
    }

    // Random page between 1-50
    const randomPage = Math.floor(Math.random() * 50) + 1;

    // Get trending shows
    const showResponse: any = await $fetch(
      `https://api.themoviedb.org/3/discover/tv?language=en-US&include_adult=true&page=${randomPage}`,
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
      `https://api.themoviedb.org/3/discover/movie?language=en-US&include_adult=true&page=${randomPage}`,
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
      discoveredShows = formatCardData({
        items: showResponse?.results,
        mediaType: "tv",
      });
      // Format the returned movies
      discoveredMovies = formatCardData({
        items: movieResponse?.results,
        mediaType: "movie",
      });

      // Shuffle and return the first twelve elements of each array
      discoveredShows = discoveredShows
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);
      discoveredMovies = discoveredMovies
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);

      // Combine the arrays
      let discovered = discoveredShows.concat(discoveredMovies);

      discovered = optimizeApiResults({ data: discovered });
      // Shuffle the array
      discovered = discovered.sort(() => 0.5 - Math.random());

      return {
        status: 200,
        message: "Data fetched successfully",
        discovered: discovered as CardData[],
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
