import { eq } from "drizzle-orm";
import { watched } from "../../db/schema";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event });

    const ratings = await db
      .select({ rating: watched.rating })
      .from(watched)
      .where(eq(watched.userId, userId));

    // Count ratings
    let ratingsCount: Record<string, number> = {
      "0.5": 0,
      "1": 0,
      "1.5": 0,
      "2": 0,
      "2.5": 0,
      "3": 0,
      "3.5": 0,
      "4": 0,
      "4.5": 0,
      "5": 0,
    };

    // Count the ratings
    ratings.forEach((rating) => {
      if (
        rating?.rating &&
        rating.rating !== null &&
        Number(rating?.rating) >= 0.5
      ) {
        ratingsCount[rating.rating] = (ratingsCount[rating?.rating] ?? 0) + 1;
      }
    });

    let ratingOverview = Object.entries(ratingsCount).map(([rating, count]) => {
      return {
        rating: `${rating} stars`,
        count: count,
      };
    });

    // Sort ratings in descending order
    ratingOverview?.sort(
      (a, b) =>
        Number(a?.rating?.split(" ")[0]) - Number(b?.rating?.split(" ")[0]),
    );

    return {
      statusCode: 200,
      statusMessage: "Success",
      ratingOverview: ratingOverview,
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
