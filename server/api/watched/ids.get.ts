import { db } from "../../utils/drizzleDriver";
import { watched } from "../../db/schema";
import requireAuth from "../../utils/requireAuth";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    const userWatched = await db
      .select({ id: watched.mediaId })
      .from(watched)
      .where(eq(watched.userId, userId));

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
