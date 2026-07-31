import { db } from "../../utils/drizzleDriver";
import { watchList } from "../../db/schema";

export default defineEventHandler(async (event) => {
  try {
    const userWatchlist = await db
      .select({ id: watchList.mediaId })
      .from(watchList);

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
