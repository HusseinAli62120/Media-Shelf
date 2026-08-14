import { eq } from "drizzle-orm";
import { watched, media } from "../../db/schema";

export default defineEventHandler(async (event) => {
  try {
    // Auth
    const { id: userId } = await requireAuth({ event: event });

    // Fetch watched genres for user
    const watchedGenres = await db
      .select({
        mediaType: media.media_type,
        genres: media.genres,
      })
      .from(watched)
      .fullJoin(media, eq(watched?.mediaId, media?.mediaId))
      .where(eq(watched.userId, userId));

    const movieGenreCounts: Record<string, number> = {};
    watchedGenres.forEach((item) => {
      if (item.mediaType === "movie" && item.genres && item.genres.length > 0) {
        item.genres.forEach((genre) => {
          movieGenreCounts[genre] = (movieGenreCounts[genre] || 0) + 1;
        });
      }
    });

    // Convert object to an array
    const formattedMovieGenres = Object.entries(movieGenreCounts).map(
      ([name, count]) => ({
        name: name,
        count: count,
      }),
    );

    // Sort and take top 5
    formattedMovieGenres.sort((a, b) => b.count - a.count);
    const top5MovieGenres = formattedMovieGenres.slice(0, 5);

    const tvGenreCounts: Record<string, number> = {};
    watchedGenres.forEach((item) => {
      if (item.mediaType === "tv" && item.genres && item.genres.length > 0) {
        item.genres.forEach((genre) => {
          tvGenreCounts[genre] = (tvGenreCounts[genre] || 0) + 1;
        });
      }
    });

    // Convert object to an array
    const formattedTvGenres = Object.entries(tvGenreCounts).map(
      ([name, count]) => ({
        name: name,
        count: count,
      }),
    );

    // Sort and take top 5
    formattedTvGenres.sort((a, b) => b.count - a.count);
    const top5TvGenres = formattedTvGenres.slice(0, 5);

    return {
      statusCode: 200,
      statusMessage: "Success",
      movieGenres: top5MovieGenres,
      tvGenres: top5TvGenres,
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
