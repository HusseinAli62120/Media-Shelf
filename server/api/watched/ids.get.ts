import { db } from "../../utils/drizzleDriver";
import { watched } from "../../db/schema";
import requireAuth from "../../utils/requireAuth";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    await requireAuth({ event: event });

    const userWatched = await db.select({ id: watched.mediaId }).from(watched);

    return {
      statusCode: 200,
      statusMessage: "Watched refrerence fetched successfully",
      watchedIds: userWatched,
    };
  } catch (error) {
    console.log(error);

    if (error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
