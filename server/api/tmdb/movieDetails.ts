import type { MovieDetails } from "#shared/types/MovieDetails";
import formatCast from "~~/server/utils/formatCast";
import formatMovieDetails from "~~/server/utils/formatMovieDetails";
import formatVideos from "~~/server/utils/formatVideos";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    await requireAuth({ event: event });

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

    // Fetch the movie details
    const res = await $fetch(
      `https://api.themoviedb.org/3/movie/${mediaId}?language=en-US`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    // Fetch the movie related videos
    const videos: any = await $fetch(
      `https://api.themoviedb.org/3/movie/${mediaId}/videos?language=en-US`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    // console.log(videos);

    // Fetch the movie related credits
    const credits: any = await $fetch(
      `https://api.themoviedb.org/3/movie/${mediaId}/credits`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    // Get trailer URL
    const trailer = formatVideos({ videos: videos?.results });

    // Get cast
    const cast = formatCast({ cast: credits?.cast });

    // console.log(cast);

    // Format movie details
    const details = formatMovieDetails({ item: res, trailer: trailer, cast });

    // console.log(details);

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
