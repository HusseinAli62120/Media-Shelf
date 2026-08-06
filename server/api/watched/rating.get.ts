// Used to get rating for watched media if available
import { and, eq } from "drizzle-orm";
import { watched } from "../../db/schema";
import requireAuth from "../../utils/requireAuth";
export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    // Get media id from query parameters
    const { mediaId } = getQuery(event);

    // Check media id
    if (!mediaId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request Parameters",
      });
    }

    // Get media rating
    const rating = await db
      .select({ rating: watched.rating })
      .from(watched)
      .where(
        and(eq(watched.mediaId, Number(mediaId)), eq(watched.userId, userId)),
      );

    const ratingValue = rating?.length > 0 ? rating[0]?.rating : 0;
    return {
      statusCode: 200,
      statusMessage: "Rating fetched successfully",
      rating: ratingValue,
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
