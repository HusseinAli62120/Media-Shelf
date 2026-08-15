import { count, desc, eq } from "drizzle-orm";
import { diary, media } from "~~/server/db/schema";
import { DiaryData } from "#shared/types/DiaryData";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    const { skip, limit } = getQuery(event);

    const response = await db
      .select({
        id: diary?.id,
        mediaId: diary?.mediaId,
        name: media?.name,
        imgURL: media?.imgURL,
        rating: diary?.rating,
        review: diary?.review,
        mediaType: media?.media_type,
        createdAt: diary?.createdAt,
      })
      .from(diary)
      .fullJoin(media, eq(diary.mediaId, media.mediaId))
      .where(eq(diary.userId, userId))
      .orderBy(desc(diary.createdAt))
      .offset(Number(skip))
      .limit(Number(limit));

    // Get total pages
    const totalCount = await db
      .select({
        count: count(diary.id),
      })
      .from(diary)
      .where(eq(diary.userId, userId));

    return {
      statusCode: 200,
      statusMessage: "Entries fetched successfully",
      entries: response as DiaryData[],
      pageCount: Math.ceil(Number(totalCount[0]?.count) / Number(limit)),
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
