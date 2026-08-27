import { and, asc, eq } from "drizzle-orm";
import { media, topFive, watched } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    const { id, mediaId } = await readBody(event);

    // Check request parameters
    if (!id || !mediaId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request Parameters",
      });
    }

    // Check if the entry actually exists
    const exists = await db.select().from(topFive).where(eq(topFive.id, id));

    if (!exists || exists.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Entry not found",
      });
    }

    // Check if the media is already added to the top five
    const existingTopFiveMedia = await db
      .select()
      .from(topFive)
      .where(and(eq(topFive.mediaId, mediaId), eq(topFive.userId, userId)));

    if (existingTopFiveMedia.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: "Already added to your top 5",
      });
    }

    // Replace the entry
    await db.update(topFive).set({ mediaId }).where(eq(topFive.id, id));

    // Fetch updated list
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
      statusMessage: "Entry replaced successfully",
      topFive: entries as TopFive[],
    };
  } catch (error) {
    if (error) {
      console.log(error);
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
