import { db } from "../../utils/drizzleDriver";
import { favorites, media, watched } from "../../db/schema";
import requireAuth from "../../utils/requireAuth";
import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    const { skip, limit, filter } = getQuery(event);

    // Check request parameters
    if (
      skip === undefined ||
      limit === undefined ||
      skip === "" ||
      limit === ""
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad request parameters",
      });
    }

    // Parse filter (string or object / JSON)
    let parsedFilter: any = filter;
    if (typeof filter === "string") {
      try {
        parsedFilter = JSON.parse(filter);
      } catch {
        parsedFilter = filter;
      }
    }

    let startDate: string | undefined;
    let endDate: string | undefined;

    if (parsedFilter && typeof parsedFilter === "object") {
      if (parsedFilter.dateRange) {
        startDate = parsedFilter.dateRange.startDate;
        endDate = parsedFilter.dateRange.endDate;
      }
    }

    // Determine ordering based on filter
    let orderByClause;
    if (parsedFilter === "dateAdded") {
      orderByClause = desc(favorites.createdAt);
    } else if (parsedFilter === "releaseDate") {
      orderByClause = sql`${media.first_air_date} DESC NULLS LAST`;
    } else if (parsedFilter === "rating") {
      orderByClause = desc(watched?.rating);
    } else {
      orderByClause = desc(favorites.createdAt);
    }

    // Build WHERE clause
    const whereClause =
      startDate && endDate
        ? and(
            eq(favorites.userId, userId),
            gte(favorites.createdAt, new Date(startDate)),
            lte(favorites.createdAt, new Date(endDate)),
          )
        : eq(favorites.userId, userId);

    // Get user favorites
    const userFavorites = await db
      .select({
        id: favorites?.id,
        createdAt: favorites?.createdAt,
        rating: watched?.rating,
        mediaId: media?.mediaId,
        name: media?.name,
        first_air_date: media?.first_air_date,
        overview: media?.overview,
        imgURL: media?.imgURL,
        averageRating: media?.averageRating,
        media_type: media?.media_type,
        voteCount: media?.voteCount,
      })
      .from(favorites)
      .where(whereClause)
      .fullJoin(media, eq(favorites.mediaId, media.mediaId))
      .fullJoin(watched, eq(media.mediaId, watched.mediaId))
      .orderBy(orderByClause)
      .limit(Number(limit))
      .offset(Number(skip));

    // Get total count
    const totalCount = await db
      .select({ count: count(favorites.id) })
      .from(favorites)
      .where(whereClause);

    return {
      statusCode: 200,
      statusMessage: "User favorites fetched successfully",
      userFavorites: userFavorites as CardData[],
      pageCount: Math.ceil(Number(totalCount[0]?.count) / Number(limit)) ?? 0,
      count: totalCount[0]?.count,
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
