import { db } from "../../utils/drizzleDriver";
import { media, watchList } from "../../db/schema";
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
      !media_type
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
      });
    }

    // Check if the media is already in the user's watchlist
    const existingMedia = await db
      .select()
      .from(watchList)
      .where(
        and(eq(watchList?.mediaId, mediaId), eq(watchList?.userId, userId)),
      );

    if (existingMedia.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: "Already in your Watchlist",
      });
    }

    // Add media to watchlist
    await db.insert(watchList).values({ mediaId: mediaId, userId: userId });

    return {
      statusCode: 200,
      statusMessage: "Added to Watchlist",
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
