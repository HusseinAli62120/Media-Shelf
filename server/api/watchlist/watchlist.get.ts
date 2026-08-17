import { db } from "../../utils/drizzleDriver";
import { watchList, media } from "../../db/schema";
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
        userWatchList: [],
        pageCount: 0,
      };
    }

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
      .fullJoin(media, eq(watchList.mediaId, media.mediaId))
      .limit(Number(limit))
      .offset(Number(skip));

    // Get total count
    const totalCount = await db
      .select({ count: count(watchList.id) })
      .from(watchList)
      .where(eq(watchList.userId, userId));

    return {
      statusCode: 200,
      statusMessage: "User watchlist fetched successfully",
      userWatchList: userWatchlist as CardData[],
      pageCount:
        Math.ceil(Number(totalCount[0]?.count) / Number(limit)) ?? 0,
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
