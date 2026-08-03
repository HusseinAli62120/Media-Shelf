import { db } from "../../utils/drizzleDriver";
import { favorites, media } from "../../db/schema";
import requireAuth from "../../utils/requireAuth";
import { eq } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    // Get user favorites
    const userFavorites = await db
      .select({
        id: favorites?.id,
        createdAt: favorites?.createdAt,
        mediaId: media?.mediaId,
        name: media?.name,
        first_air_date: media?.first_air_date,
        overview: media?.overview,
        imgURL: media?.imgURL,
        averageRating: media?.averageRating,
        media_type: media?.media_type,
        voteCount: media?.voteCount,
      })
      .from(favorites)
      .where(eq(favorites.userId, userId))
      .fullJoin(media, eq(favorites.mediaId, media.mediaId));

    return {
      statusCode: 200,
      statusMessage: "User favorites fetched successfully",
      userFavorites: userFavorites,
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
