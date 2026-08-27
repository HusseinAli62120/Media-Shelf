import { db } from "../../utils/drizzleDriver";
import { watchList, media } from "../../db/schema";
import requireAuth from "../../utils/requireAuth";
import { and, asc, count, desc, eq, gte, lte, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    const { skip, limit, filter, order } = getQuery(event);

    // Check request parameters
    if (
      skip === undefined ||
      limit === undefined ||
      skip === "" ||
      limit === "" ||
      !order
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
    // Date added
    if (parsedFilter === "dateAdded") {
      orderByClause =
        order === "Desc"
          ? desc(watchList.createdAt)
          : asc(watchList?.createdAt);
      // Release date
    } else if (parsedFilter === "releaseDate") {
      const query =
        order === "Desc"
          ? desc(media.first_air_date)
          : asc(media.first_air_date);
      orderByClause = query;
    } else {
      orderByClause =
        order === "Desc"
          ? desc(watchList.createdAt)
          : asc(watchList?.createdAt);
    }

    // Build WHERE clause
    const whereClause =
      startDate && endDate
        ? and(
            eq(watchList.userId, userId),
            gte(watchList.createdAt, new Date(startDate)),
            lte(watchList.createdAt, new Date(endDate)),
          )
        : eq(watchList.userId, userId);

    // Get user watchlist
    const userWatchlist = await db
      .select({
        id: watchList?.id,
        createdAt: watchList?.createdAt,
        mediaId: media?.mediaId,
        name: media?.name,
        first_air_date: media?.first_air_date,
        overview: media?.overview,
        imgURL: media?.imgURL,
        averageRating: media?.averageRating,
        media_type: media?.media_type,
        voteCount: media?.voteCount,
      })
      .from(watchList)
      .where(whereClause)
      .fullJoin(media, eq(watchList.mediaId, media.mediaId))
      .orderBy(orderByClause)
      .limit(Number(limit))
      .offset(Number(skip));

    // Get total count
    const totalCount = await db
      .select({ count: count(watchList.id) })
      .from(watchList)
      .where(whereClause);

    return {
      statusCode: 200,
      statusMessage: "User watchlist fetched successfully",
      userWatchList: userWatchlist as CardData[],
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
