import { db } from "../../utils/drizzleDriver";
import { media, favorites } from "../../db/schema";
import requireAuth from "../../utils/requireAuth";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    // Body
    const {
      mediaId,
      name,
      first_air_date,
      overview,
      imgURL,
      averageRating,
      media_type,
      voteCount,
    } = await readBody(event);

    // Check request parameters
    if (
      !mediaId ||
      !userId ||
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

    // Check if the media is already in the user's favorites
    const existingMedia = await db
      .select()
      .from(favorites)
      .where(
        and(eq(favorites?.mediaId, mediaId), eq(favorites?.userId, userId)),
      );

    if (existingMedia.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: "Already in your Favorites",
      });
    }

    // Add media to favorites
    await db.insert(favorites).values({ mediaId: mediaId, userId: userId });

    return {
      statusCode: 200,
      statusMessage: "Added to Favorites",
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
