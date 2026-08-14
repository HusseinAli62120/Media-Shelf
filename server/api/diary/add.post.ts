import { media, diary, watched } from "../../db/schema";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    const {
      mediaId,
      review,
      rating,
      timestamp,
      name,
      first_air_date,
      overview,
      imgURL,
      averageRating,
      media_type,
      voteCount,
      genres,
    } = await readBody(event);

    // Check request parameters
    if (
      !mediaId ||
      !timestamp ||
      !name ||
      !first_air_date ||
      !overview ||
      !imgURL ||
      !averageRating ||
      !media_type ||
      !voteCount ||
      !genres
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request Parameters",
      });
    }

    // Check if the media refrerence already exists
    const mediaRef = await db
      .select()
      .from(media)
      .where(eq(media.mediaId, mediaId));

    if (mediaRef.length === 0) {
      // Add media to the media table
      await db.insert(media).values({
        mediaId: mediaId,
        name: name,
        first_air_date: first_air_date,
        overview: overview,
        imgURL: imgURL,
        averageRating: averageRating,
        media_type: media_type,
        voteCount: voteCount,
        genres: genres,
      });
    }

    // Check if the media is already watched
    const watchedRef = await db
      .select()
      .from(watched)
      .where(and(eq(watched.mediaId, mediaId), eq(watched.userId, userId)));

    // First watch, so add it to watched as well
    if (watchedRef.length === 0) {
      await db.insert(watched).values({
        mediaId: mediaId,
        userId: userId,
        rating: rating,
      });
    }
    // Already watched, update rating
    else if (rating > 0) {
      await db
        .update(watched)
        .set({ rating: rating })
        .where(and(eq(watched.mediaId, mediaId), eq(watched.userId, userId)));
    }

    // Add new diary entry
    await db.insert(diary).values({
      mediaId: mediaId,
      userId: userId,
      review: review,
      rating: rating,
      createdAt: new Date(timestamp),
    });

    return {
      statusCode: 200,
      statusMessage: "New Diary Entry Added",
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
