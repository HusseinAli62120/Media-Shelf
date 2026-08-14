import { desc, eq } from "drizzle-orm";
import { diary, media } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    // Get the TMDB API key
    const apiKey = process.env.NUXT_SHOW_MOVIE_API_KEY;
    if (!apiKey) {
      throw createError({
        status: 500,
        message: "Internal Server Error",
      });
    }

    // Fetch the three most recent diary entry ids
    const recentDiaryEntries = await db
      .select({ mediaId: diary?.mediaId, mediaType: media?.media_type })
      .from(diary)
      .fullJoin(media, eq(diary?.mediaId, media.mediaId))
      .where(eq(diary?.userId, userId))
      .orderBy(desc(diary.createdAt))
      .limit(3);

    if (recentDiaryEntries?.length > 0) {
      let recommendations: CardData[] = [];
      let indexExists = true;
      let baseExistingIndex = 0;

      for (let index = 0; index < 3; index++) {
        // Check if the index has a corresponding dairy entry, if so, use it, if not, use the previous one that exists
        indexExists = recentDiaryEntries?.[index] ? true : false;
        if (indexExists) {
          baseExistingIndex = index;
        }

        let currentEntryMediaType =
          recentDiaryEntries[baseExistingIndex]?.mediaType;
        let currentEntryID = recentDiaryEntries[baseExistingIndex]?.mediaId;

        // Fetch recommendations
        const res: any = await $fetch(
          `https://api.themoviedb.org/3/${currentEntryMediaType?.toString()?.toLowerCase()}/${currentEntryID}/recommendations?language=en-US&page=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          },
        );

        if (res?.results?.length > 0) {
          const desiredType = recentDiaryEntries[index]?.mediaType;

          let formattedResults = formatCardData({
            items: res.results,
            mediaType: desiredType!,
          });

          // Shuffle the array
          formattedResults.sort(() => 0.5 - Math.random());

          // filter shows & movies without a poster
          formattedResults = formattedResults.filter(
            (item: any) =>
              item?.imgURL?.length > 0 && !item?.imgURL?.endsWith("null"),
          );

          // remove duplicates by mediaId
          formattedResults = formattedResults.filter(
            (item: any, index: number) => {
              return (
                formattedResults.findIndex(
                  (i: any) => i.mediaId === item.mediaId,
                ) === index
              );
            },
          );

          // Filter results with rating less that 4.5
          formattedResults = formattedResults.filter(
            (item: any) => item?.averageRating >= 4.5,
          );
          // Return the first four element of the array
          recommendations.push(...formattedResults.slice(0, 4));

          // Shuffle the final array
          recommendations.sort(() => 0.5 - Math.random());
        }
      }

      return {
        statusCode: 200,
        statusMessage: "Success",
        recommendations: recommendations as CardData[],
      };
    }

    return {
      statusCode: 200,
      statusMessage: "No Diary Entries",
      recommendations: [],
    };
  } catch (error) {
    if (error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Failed to fetch personal recommendations",
    });
  }
});
