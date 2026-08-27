export default defineEventHandler(async (event) => {
  try {
    // Auth
    await requireAuth({ event: event });
    
    const apiKey = process.env.NUXT_SHOW_MOVIE_API_KEY;
    if (!apiKey) {
      throw createError({
        statusCode: 500,
        message: "Internal Server Error",
      });
    }

    const { type, genreId, page, startDate, endDate } = getQuery(event);

    if (!type || !genreId || !page) {
      throw createError({
        statusCode: 400,
        message: "Bad Request Parameters!!!!",
      });
    }

    const formattedStartDate = startDate
      ? new Date(startDate.toString()).toISOString().split("T")[0]
      : "";
    const formattedEndDate = endDate
      ? new Date(endDate.toString()).toISOString().split("T")[0]
      : "";

    const movieDateFilter =
      formattedStartDate && formattedEndDate
        ? `primary_release_date.gte=${formattedStartDate}&primary_release_date.lte=${formattedEndDate}`
        : "";

    const showDateFilter =
      formattedStartDate && formattedEndDate
        ? `first_air_date.gte=${formattedStartDate}&first_air_date.lte=${formattedEndDate}`
        : "";

    const usedFilter = type === "movie" ? movieDateFilter : showDateFilter;

    // For most relevent results
    let sortBy = "vote_count.desc";

    const res: any = await $fetch(
      `https://api.themoviedb.org/3/discover/${type}?with_genres=${genreId}&page=${page}&sort_by=${sortBy}${usedFilter ? "&" + usedFilter : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    if (res?.results?.length > 0) {
      let genreMedia = [];

      genreMedia = formatCardData({
        items: res?.results,
        mediaType: type === "movie" ? "movie" : "tv",
      });

      genreMedia = optimizeApiResults({ data: genreMedia });

      const totalPages: number = res.total_pages ?? 1;

      return {
        statusCode: 200,
        message: "Data fetched successfully",
        genreMedia: genreMedia as CardData[],
        totalPages: totalPages,
      };
    }

    return {
      statusCode: 400,
      message: "Unexpected Error",
      genreMedia: [],
      totalPages: 0,
    };
  } catch (error) {
    if (error) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
});
