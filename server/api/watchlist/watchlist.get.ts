import { db } from "../../utils/drizzleDriver";
import { watchList, media } from "../../db/schema";
import requireAuth from "../../utils/requireAuth";
import { eq } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    // Get user watchlist
    const userWatchlist = await db
      .select({
        id: watchList?.id,
        createdAt: watchList?.createdAt,
        mediaId: media?.mediaId,
        name: media?.name,
        first_air_date: media?.first_air_date,
        overview: media?.overview,
        imgURL: media?.imgURL,
        averageRating: media?.averageRating,
        media_type: media?.media_type,
        voteCount: media?.voteCount,
      })
      .from(watchList)
      .where(eq(watchList.userId, userId))
      .fullJoin(media, eq(watchList.mediaId, media.mediaId));

    return {
      statusCode: 200,
      statusMessage: "User watchlist fetched successfully",
      userWatchList: userWatchlist,
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
