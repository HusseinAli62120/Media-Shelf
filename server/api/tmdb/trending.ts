import formatCardData from "~~/server/utils/formatCardData";
import type { CardData } from "#shared/types/CardData";

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
      trendingShows = formatCardData({ item: showResponse?.results });
      // Format the returned movies
      trendingMovies = formatCardData({ item: movieResponse?.results });

      // Return the first five elements of each array
      trendingShows = trendingShows.slice(0, 5);
      trendingMovies = trendingMovies.slice(0, 5);

      // Combine the arrays
      let trending = trendingShows.concat(trendingMovies);
      // Shuffle the array
      trending = trending.sort(() => 0.5 - Math.random());

      return {
        status: 200,
        message: "Data fetched successfully",
        trending: trending as CardData[],
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
