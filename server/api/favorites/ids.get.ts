import { db } from "../../utils/drizzleDriver";
import { favorites } from "../../db/schema";
import requireAuth from "../../utils/requireAuth";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    const userFavorites = await db
      .select({ id: favorites.mediaId })
      .from(favorites)
      .where(eq(favorites.userId, userId));

    return {
      statusCode: 200,
      statusMessage: "Favorites refrerence fetched successfully",
      favoriteIds: userFavorites,
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
