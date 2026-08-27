import { asc, eq } from "drizzle-orm";
import { media, topFive, watched } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    const entries = await db
      .select({
        id: topFive.id,
        name: media?.name,
        slotNumber: topFive?.slotNumber,
        mediaId: topFive?.mediaId,
        media_type: media?.media_type,
        rating: watched?.rating,
        imgURL: media?.imgURL,
      })
      .from(topFive)
      .fullJoin(media, eq(topFive.mediaId, media.mediaId))
      .fullJoin(watched, eq(media.mediaId, watched.mediaId))
      .where(eq(topFive.userId, userId))
      .orderBy(asc(topFive.slotNumber));

    return {
      statusCode: 200,
      statusMessage: "Successfully fetched top five entries",
      topFive: entries as TopFive[],
    };
  } catch (error) {
    if (error) {
      console.log(error);
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
