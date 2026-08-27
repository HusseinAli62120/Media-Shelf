import { eq } from "drizzle-orm";
import { watched, media } from "../../db/schema";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event });

    // Fetch media type and ratings for user
    const ratings = await db
      .select({
        mediaType: media.media_type,
        rating: watched.rating,
      })
      .from(watched)
      .fullJoin(media, eq(watched?.mediaId, media?.mediaId))
      .where(eq(watched.userId, userId));

    const movieRatings: number[] = ratings
      .filter((rating) => rating.mediaType === "movie")
      .map((rating) => Number(rating.rating))
      .filter((rating) => rating !== null);

    const tvRatings: number[] = ratings
      .filter((rating) => rating.mediaType === "tv")
      .map((rating) => Number(rating.rating))
      .filter((rating) => rating !== null);

    const averageMovieRating =
      movieRatings.length > 0
        ? movieRatings.reduce((prev, currentVal) => prev + currentVal) /
          movieRatings.length
        : 0;
    const averageTvRating =
      tvRatings.length > 0
        ? tvRatings.reduce((prev, currentVal) => prev + currentVal) /
          tvRatings.length
        : 0;

    return {
      statusCode: 200,
      statusMessage: "Success",
      averageMovieRating: Number(averageMovieRating.toFixed(2)),
      averageTvRating: Number(averageTvRating.toFixed(2)),
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
