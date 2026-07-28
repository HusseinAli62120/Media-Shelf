import formatActorData from "~~/server/utils/formatActorData";
import formatCardData from "~~/server/utils/formatCardData";
import type { CardData } from "#shared/types/CardData";
import type { ActorData } from "#shared/types/ActorData";

export default defineEventHandler(async (event) => {
  try {
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

    // Filter and sort by popularity
    const topMovies = cast.filter(
      (item: any) =>
        item.media_type === "movie" &&
        item.poster_path &&
        item?.vote_average > 3.5, // To remove obscure results
    );

    const topShows = cast.filter(
      (value: any) =>
        value.media_type === "tv" &&
        value.poster_path &&
        value?.vote_average > 3.5, // To remove obscure results
    );

    // Format data
    const formattedMovies = formatCardData({
      items: topMovies,
      mediaType: "movie",
    });

    const formattedShows = formatCardData({
      items: topShows,
      mediaType: "tv",
    });

    let discovered = formattedMovies.concat(formattedShows);

    discovered = discovered.sort(
      (a: any, b: any) => (b.voteCount || 0) - (a.voteCount || 0),
    );

    // remove duplicates by mediaId
    discovered = discovered.filter((item: any, index: number) => {
      return (
        discovered.findIndex((i: any) => i.mediaId === item.mediaId) === index
      );
    });

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
