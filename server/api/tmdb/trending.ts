import formatCardData from "~~/server/utils/formatCardData";
import type { CardData } from "#shared/types/CardData";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    await requireAuth({ event: event });

    const { dateRange } = getQuery(event);

    if (!dateRange) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request Parameters",
      });
    }

    const apiKey = process.env.NUXT_SHOW_MOVIE_API_KEY;

    if (!apiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: "Internal server error",
      });
    }

    // Get trending shows
    const showResponse: any = await $fetch(
      `https://api.themoviedb.org/3/trending/tv/${dateRange}?language=en-US`,
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
      `https://api.themoviedb.org/3/trending/movie/${dateRange}?language=en-US`,
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

      // console.log(movieResponse?.results);

      // Format the returned shows
      trendingShows = formatCardData({
        items: showResponse?.results,
        mediaType: "tv",
      });
      // Format the returned movies
      trendingMovies = formatCardData({
        items: movieResponse?.results,
        mediaType: "movie",
      });

      // Shuffle the arrays
      if (dateRange === "week") {
        trendingShows = trendingShows.sort(() => 0.5 - Math.random());
        trendingMovies = trendingMovies.sort(() => 0.5 - Math.random());
      }

      // Return the first five elements of each array
      trendingShows = trendingShows.slice(0, 6);
      trendingMovies = trendingMovies.slice(0, 6);

      // Combine the arrays
      let trending = trendingShows.concat(trendingMovies);

      trending = optimizeApiResults({ data: trending });
      // Shuffle the array
      trending = trending.sort(() => 0.5 - Math.random());

      return {
        statusCode: 200,
        statusMessage: "Data fetched successfully",
        trending: trending as CardData[],
        count: trending.length,
      };
    }

    return {
      statusCode: 400,
      statusMessage: "Unexpected error",
      trending: [],
      count: 0,
    };
  } catch (error) {
    if (error) {
      console.log(error);
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
