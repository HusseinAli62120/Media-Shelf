import { db } from "../../utils/drizzleDriver";
import { watched, media } from "../../db/schema";
import requireAuth from "../../utils/requireAuth";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    const {
      mediaId,
      name,
      first_air_date,
      overview,
      imgURL,
      averageRating,
      media_type,
      voteCount,
      rating,
    } = await readBody(event);

    // Check request parameters
    if (
      !mediaId ||
      !name ||
      !first_air_date ||
      !overview ||
      !imgURL ||
      !averageRating ||
      !media_type ||
      !voteCount
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
      });
    }

    // Check if media exists in the watched table
    const existingMedia = await db
      .select()
      .from(watched)
      .where(and(eq(watched?.mediaId, mediaId), eq(watched?.userId, userId)));

    if (existingMedia.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: "Already in your Watched List",
      });
    }

    // Add media to watched list
    await db
      .insert(watched)
      .values({ mediaId: mediaId, userId: userId, rating: rating.toString() });

    return {
      statusCode: 200,
      statusMessage: "Watched!",
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
