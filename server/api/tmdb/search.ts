import type { CardData } from "#shared/types/CardData";
import formatCardData from "~~/server/utils/formatCardData";

export default defineEventHandler(async (event) => {
  try {
    const { searchQuery } = getQuery(event);

    // Check the search query
    if (!searchQuery) {
      throw createError({
        statusCode: 400,
        message: "Bad Request Parameters",
      });
    }

    const apiKey = process.env.NUXT_SHOW_MOVIE_API_KEY;

    if (!apiKey) {
      throw createError({
        status: 500,
        message: "Internal server error",
      });
    }

    const response: any = await $fetch(
      `https://api.themoviedb.org/3/search/multi?query=${searchQuery}&language=en-US&include_adult=true&page=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    // console.log(response);

    let formattedData: any[] = [];
    if (response.results.length > 0) {
      formattedData = formatCardData({ item: response.results });

      // Keep only shows and movies
      formattedData = formattedData.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv",
      );

      return {
        status: 200,
        message: "Data fetched successfully",
        searchData: formattedData as CardData[],
        count: formattedData.length,
      };
    }

    return {
      status: 404,
      message: "No data found",
      searchData: [],
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
