import { and, count, eq, gte, lte } from "drizzle-orm";
import { diary, watched } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    // Get this year date
    const year = new Date().getFullYear();

    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year + 1, 0, 1);

    // Watched count, and this year
    const watchedCount = await db
      .select({ count: count(watched) })
      .from(watched)
      .where(eq(watched.userId, userId));

    const watchedThisYear = await db
      .select({ count: count(watched) })
      .from(watched)
      .where(
        and(
          eq(watched.userId, userId),
          gte(watched.createdAt, yearStart),
          lte(watched.createdAt, yearEnd),
        ),
      );

    // Diary entries
    const diaryEntriesCount = await db
      .select({ count: count(diary) })
      .from(diary)
      .where(eq(diary.userId, userId));

    const diaryEntriesThisYear = await db
      .select({ count: count(diary) })
      .from(diary)
      .where(
        and(
          eq(diary.userId, userId),
          gte(diary.createdAt, yearStart),
          lte(diary.createdAt, yearEnd),
        ),
      );

    return {
      statusCode: 200,
      statusMessage: "Counts fetched successfully",
      watchedCount: Number(watchedCount[0]?.count) || 0,
      watchedThisYear: Number(watchedThisYear[0]?.count) || 0,
      diaryEntriesCount: Number(diaryEntriesCount[0]?.count) || 0,
      diaryEntriesThisYear: Number(diaryEntriesThisYear[0]?.count) || 0,
    };
  } catch (error) {
    if (error) {
      console.log(error);
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
