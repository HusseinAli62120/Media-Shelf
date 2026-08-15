import { eq } from "drizzle-orm";
import { diary } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    await requireAuth({ event: event });

    const { id } = await readBody(event);

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request Parameters",
      });
    }

    // Check if the diaryEntry exists
    const diaryEntry = await db.select().from(diary).where(eq(diary.id, id));

    if (diaryEntry.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Entry not found",
      });
    }

    const res: any = await db.delete(diary).where(eq(diary?.id, id));

    if (res.changes === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: "Error deleting entry",
      });
    }

    return {
      statusCode: 200,
      statusMessage: "Entry deleted successfully",
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
