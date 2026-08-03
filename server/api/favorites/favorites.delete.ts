import { db } from "../../utils/drizzleDriver";
import { favorites } from "../../db/schema";
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

    // Check if media for user is actually in favorites
    const inFavorites = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.mediaId, mediaId), eq(favorites.userId, userId)));

    if (inFavorites.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Media not found in your favorites",
      });
    }

    // Remove media from favorites
    await db
      .delete(favorites)
      .where(and(eq(favorites.mediaId, mediaId), eq(favorites.userId, userId)));

    return {
      statusCode: 200,
      statusMessage: "Removed from favorites",
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
