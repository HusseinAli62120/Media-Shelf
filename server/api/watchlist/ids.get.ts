import { db } from "../../utils/drizzleDriver";
import { watchList } from "../../db/schema";
import requireAuth from "../../utils/requireAuth";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    const userWatchlist = await db
      .select({ id: watchList.mediaId })
      .from(watchList)
      .where(eq(watchList.userId, userId));

    return {
      statusCode: 200,
      statusMessage: "Watchlist refrerence fetched successfully",
      watchListIds: userWatchlist,
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
