import formatActorData from "~~/server/utils/formatActorData";
import formatCardData from "~~/server/utils/formatCardData";
import type { CardData } from "#shared/types/CardData";
import type { ActorData } from "#shared/types/ActorData";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    await requireAuth({ event: event });

    const { actorId } = getQuery(event);

    if (!actorId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request Parameters",
      });
    }

    const apiKey = process.env.NUXT_SHOW_MOVIE_API_KEY;
    if (!apiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: "Internal server error: API key missing",
      });
    }

    const actorData: any = await $fetch(
      `https://api.themoviedb.org/3/person/${actorId}?language=en-US`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    // Actor's shows and movies
    const combinedCredits: any = await $fetch(
      `https://api.themoviedb.org/3/person/${actorId}/combined_credits?language=en-US`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    // Shows/movies acted in
    const cast = combinedCredits?.cast || [];

    // Format data
    const formattedMovies = formatCardData({
      items: cast,
      mediaType: "movie",
    });

    const formattedShows = formatCardData({
      items: cast,
      mediaType: "tv",
    });

    let discovered = formattedMovies.concat(formattedShows);

    discovered = optimizeApiResults({ data: discovered });

    discovered = discovered.sort(
      (a: any, b: any) => (b.voteCount || 0) - (a.voteCount || 0),
    );

    const formattedActorData = formatActorData({ actorData: actorData });

    return {
      statusCode: 200,
      statusMessage: "Success",
      discovered: discovered as CardData[],
      actorData: formattedActorData as ActorData,
      count: discovered.length,
    };
  } catch (error) {
    if (error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
