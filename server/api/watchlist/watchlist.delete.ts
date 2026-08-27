import { db } from "../../utils/drizzleDriver";
import { watchList } from "../../db/schema";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const { id: userId } = await requireAuth({ event: event });
    const { mediaId } = await readBody(event);

    // Check the request parameters
    if (!mediaId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request Parameters",
      });
    }

    // Check if media for user is actually in watchlist
    const inWatchlist = await db
      .select()
      .from(watchList)
      .where(and(eq(watchList.mediaId, mediaId), eq(watchList.userId, userId)));

    if (inWatchlist.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Media not found in your watchlist",
      });
    }

    // Remove media from watchlist
    await db
      .delete(watchList)
      .where(and(eq(watchList.mediaId, mediaId), eq(watchList.userId, userId)));

    return {
      statusCode: 200,
      statusMessage: "Removed from watchlist",
    };
  } catch (error) {
    if (error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
