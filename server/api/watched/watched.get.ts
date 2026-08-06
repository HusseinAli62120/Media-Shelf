import { db } from "../../utils/drizzleDriver";
import { watched, media } from "../../db/schema";
import requireAuth from "../../utils/requireAuth";
import { eq } from "drizzle-orm";
export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    // Get user watched
    const userWatched = await db
      .select({
        id: watched?.id,
        createdAt: watched?.createdAt,
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
      .from(watched)
      .where(eq(watched.userId, userId))
      .fullJoin(media, eq(watched.mediaId, media.mediaId));

    return {
      statusCode: 200,
      statusMessage: "User watched fetched successfully",
      userWatched: userWatched,
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
