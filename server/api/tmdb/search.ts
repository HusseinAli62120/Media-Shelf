import type { CardData } from "#shared/types/CardData";
import formatCardData from "~~/server/utils/formatCardData";

export default defineEventHandler(async (event) => {
  try {
    const { searchQuery, page } = getQuery(event);

    // Check the search query
    if (!searchQuery || !page) {
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
      `https://api.themoviedb.org/3/search/multi?query=${searchQuery}&language=en-US&include_adult=true&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    // console.log(response.results);

    let formattedData: any[] = [];
    if (response.results.length > 0) {
      formattedData = formatCardData({ items: response.results });

      // Keep only shows and movies
      formattedData = formattedData.filter(
        (item) => item.media_type === "movie" || item.media_type === "tv",
      );

      // filter shows & movies without a poster
      formattedData = formattedData.filter(
        (item) => item?.imgURL?.length > 0 && !item?.imgURL?.endsWith("null"),
      );

      // remove duplicates by mediaId
      formattedData = formattedData.filter((item: any, index: number) => {
        return (
          formattedData.findIndex((i: any) => i.mediaId === item.mediaId) ===
          index
        );
      });

      const totalPages: number = response.total_pages ?? 1;
      const count: number = formattedData.length;

      return {
        status: 200,
        message: "Data fetched successfully",
        searchData: formattedData as CardData[],
        count: count,
        totalPages: totalPages,
      };
    }

    return {
      status: 404,
      message: "No data found",
      searchData: [],
      count: 0,
      totalPages: 0,
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
