import { db } from "../../utils/drizzleDriver";
import { favorites, media, watched } from "../../db/schema";
import requireAuth from "../../utils/requireAuth";
import { count, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    const { skip, limit } = getQuery(event);

    // Check request parameters
    if (!skip || !limit) {
      return {
        statusCode: 400,
        statusMessage: "Bad request parameters",
        userFavorites: [],
        pageCount: 0,
      };
    }

    // Get user favorites
    const userFavorites = await db
      .select({
        id: favorites?.id,
        createdAt: favorites?.createdAt,
        rating: watched?.rating,
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
      .fullJoin(media, eq(favorites.mediaId, media.mediaId))
      .fullJoin(watched, eq(media.mediaId, watched.mediaId))
      .limit(Number(limit))
      .offset(Number(skip));

    // Get total count
    const totalCount = await db
      .select({ count: count(favorites.id) })
      .from(favorites)
      .where(eq(favorites.userId, userId));

    return {
      statusCode: 200,
      statusMessage: "User favorites fetched successfully",
      userFavorites: userFavorites as CardData[],
      pageCount: Math.ceil(Number(totalCount[0]?.count) / Number(limit)) ?? 0,
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
