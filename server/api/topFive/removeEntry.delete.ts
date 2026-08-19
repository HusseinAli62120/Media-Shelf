import { eq } from "drizzle-orm";
import { topFive } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    await requireAuth({ event: event });

    const { id } = await readBody(event);

    // Check request parameters
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request Parameters",
      });
    }

    // Check if the entry actually exists
    const exists = await db.select().from(topFive).where(eq(topFive.id, id));

    if (!exists || exists.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Entry not found",
      });
    }

    // Delete the entry
    await db.delete(topFive).where(eq(topFive.id, id));

    return {
      statusCode: 200,
      statusMessage: "Entry removed successfully",
    };
  } catch (error) {
    if (error) {
      console.log(error);
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
