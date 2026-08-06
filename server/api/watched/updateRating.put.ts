import requireAuth from "../../utils/requireAuth";
import { watched } from "../../db/schema";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event });

    const { mediaId, rating } = await readBody(event);

    // Check if the media is watched
    const existingMedia = await db
      .select()
      .from(watched)
      .where(and(eq(watched?.mediaId, mediaId), eq(watched?.userId, userId)));

    if (existingMedia.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "This media is not in your watched list",
      });
    }

    await db
      .update(watched)
      .set({ rating: rating.toString() })
      .where(and(eq(watched?.mediaId, mediaId), eq(watched?.userId, userId)));

    return {
      statusCode: 200,
      statusMessage: "Rating updated successfully",
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
