import { and, asc, count, eq } from "drizzle-orm";
import { media, topFive, watched } from "~~/server/db/schema";
export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    const { mediaId, slotNumber } = await readBody(event);

    // Check request parameters
    if (!mediaId || !slotNumber) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
      });
    }

    // Check if media exists
    const existingMedia = await db.query.media.findFirst({
      where: eq(media.mediaId, mediaId),
    });

    if (!existingMedia) {
      throw createError({
        statusCode: 404,
        statusMessage: "Media not found",
      });
    }

    // Check if the user already has 5 favorites
    const existingTopFive = await db
      .select({ count: count(topFive.id) })
      .from(topFive)
      .where(eq(topFive.userId, userId));

    if (existingTopFive[0] && existingTopFive[0].count >= 5) {
      throw createError({
        statusCode: 400,
        statusMessage: "You can't add any more",
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

    // Add media to top five
    await db.insert(topFive).values({
      userId,
      mediaId,
      slotNumber,
    });

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
      statusMessage: "Media added to top five successfully",
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
