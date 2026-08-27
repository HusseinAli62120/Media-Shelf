import formatCardData from "~~/server/utils/formatCardData";
import type { CardData } from "~~/shared/types/CardData";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    await requireAuth({ event: event });

    const { mediaType, mediaId } = getQuery(event);

    // Check the request parameters
    if (!mediaId || !mediaType) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request Parameters!!!!",
      });
    }

    // Get the TMDB API key
    const apiKey = process.env.NUXT_SHOW_MOVIE_API_KEY;
    if (!apiKey) {
      throw createError({
        status: 500,
        message: "Internal Server Error",
      });
    }

    const res: any = await $fetch(
      `https://api.themoviedb.org/3/${mediaType?.toString()?.toLowerCase()}/${mediaId}/recommendations?language=en-US&page=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    if (res?.results?.length > 0) {
      const desiredType = mediaType === "tv" ? "tv" : "movie";

      let formattedResults = formatCardData({
        items: res.results,
        mediaType: desiredType,
      });

      formattedResults = optimizeApiResults({ data: formattedResults });

      // Shuffle the array
      formattedResults.sort(() => 0.5 - Math.random());
      // Return the first six element of the array
      const recommendations = formattedResults.slice(0, 12);

      return {
        status: 200,
        message: "Success",
        recommendations: recommendations as CardData[],
        count: recommendations.length,
      };
    }

    return {
      status: 400,
      message: "Unexpected error",
      recommendations: [],
      count: 0,
    };
  } catch (error) {
    if (error) {
      throw error;
    }

    throw createError({
      status: 500,
      message: "Internal Server Error",
    });
  }
});
