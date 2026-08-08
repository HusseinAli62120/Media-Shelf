import type { TvDetails } from "#shared/types/TvDetails";
import formatCast from "~~/server/utils/formatCast";
import formatTvDetails from "~~/server/utils/formatTvDetails";

export default defineEventHandler(async (event) => {
  try {
    const { mediaId, mediaType } = getQuery(event);

    if (!mediaId || !mediaType) {
      throw createError({
        status: 400,
        message: "Bad Request Parameters",
      });
    }

    if (mediaType !== "tv") {
      console.log("movie");
      return;
    }

    const apiKey = process.env.NUXT_SHOW_MOVIE_API_KEY;

    if (!apiKey) {
      throw createError({
        status: 500,
        message: "Internal server error",
      });
    }

    // Fetch the movie details
    const res: any = await $fetch(
      `https://api.themoviedb.org/3/tv/${mediaId}?language=en-US`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    // Fetch the movie related credits
    const credits: any = await $fetch(
      `https://api.themoviedb.org/3/tv/${mediaId}/aggregate_credits?language=en-US`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    // Get cast
    const cast = formatCast({ cast: credits?.cast });

    // console.log(cast);

    // Format movie details
    const details = formatTvDetails({ item: res, cast: cast });

    // console.log(details);

    return {
      status: 200,
      message: "Success",
      details: details as TvDetails,
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
