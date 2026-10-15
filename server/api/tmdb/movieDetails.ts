import type { MovieDetails } from "#shared/types/MovieDetails";
import formatCast from "~~/server/utils/formatCast";
import formatCollection from "~~/server/utils/formatCollection";
import formatCrew from "~~/server/utils/formatCrew";
import formatMovieDetails from "~~/server/utils/formatMovieDetails";
import formatVideos from "~~/server/utils/formatVideos";
import { CollectionData } from "~~/shared/types/CollectionData";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    await requireAuth({ event: event });

    const { mediaId, mediaType } = getQuery(event);

    if (!mediaId || !mediaType) {
      throw createError({
        status: 400,
        statusMessage: "Bad Request Parameters",
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
        statusMessage: "Internal server error",
      });
    }

    // Fetch the movie details
    const res: any = await $fetch(
      `https://api.themoviedb.org/3/movie/${mediaId}?language=en-US`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    const collectionId = res?.belongs_to_collection?.id ?? null;

    let collection = {};

    // Fetch collection if it exists
    if (collectionId) {
      const res: any = await $fetch(
        `https://api.themoviedb.org/3/collection/${collectionId}?language=en-US`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      collection = formatCollection({ data: res });
    }

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

    // Get crew
    const crew = formatCrew({ crew: credits?.crew });

    // console.log(cast);

    // Format movie details
    const details = formatMovieDetails({
      item: res,
      trailer: trailer,
      cast,
      crew,
    });

    // console.log(details);

    return {
      status: 200,
      statusMessage: "Success",
      details: details as MovieDetails,
      collection: collection as CollectionData,
    };
  } catch (error) {
    if (error) {
      console.log(error);
      throw error;
    }

    throw createError({
      status: 500,
      statusText: "Internal server error",
    });
  }
});
