import { db } from "../../utils/drizzleDriver";
import { favorites } from "../../db/schema";
import requireAuth from "../../utils/requireAuth";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    await requireAuth({ event: event });

    const userFavorites = await db
      .select({ id: favorites.mediaId })
      .from(favorites);

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
