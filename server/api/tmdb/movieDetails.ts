import type { MovieDetails } from "#shared/types/MovieDetails";
import formatMovieDetails from "~~/server/utils/formatMovieDetails";

export default defineEventHandler(async (event) => {
  try {
    const { mediaId, mediaType } = getQuery(event);

    if (!mediaId || !mediaType) {
      throw createError({
        status: 400,
        message: "Bad Request Parameters",
      });
    }

    if (mediaType !== "movie") {
      console.log("Show");
      return;
    }

    const apiKey = process.env.NUXT_SHOW_MOVIE_API_KEY;

    if (!apiKey) {
      throw createError({
        status: 500,
        message: "Internal server error",
      });
    }

    const res = await $fetch(
      `https://api.themoviedb.org/3/${mediaType?.toString()?.toLowerCase()}/${mediaId}?language=en-US`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    const details = formatMovieDetails({ item: res });
    return {
      status: 200,
      message: "Success",
      details: details as MovieDetails,
    };
  } catch (error) {
    if (error) {
      console.log(error);
      throw error;
    }

    throw createError({
      status: 500,
      message: "Internal server error",
    });
  }
});
