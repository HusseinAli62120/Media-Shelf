import optimizeApiResults from "~~/server/utils/optimizeApiResults";

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

    const { viewMoreType, page, fetchShows, fetchMovies, startDate, endDate } =
      getQuery(event);

    if (!viewMoreType || !page) {
      throw createError({
        statusCode: 400,
        message: "Bad Request Parameters",
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

    // Since the query values are passed as strings, not boolean
    const shouldFetchShows = String(fetchShows) === "true";
    const shouldFetchMovies = String(fetchMovies) === "true";

    // For most relevent results
    let sortBy = "vote_count.desc";
    let showResponse: any;
    // Get trending shows
    if (shouldFetchShows) {
      showResponse = await $fetch(
        `https://api.themoviedb.org/3/discover/tv?language=en-US&include_adult=true&page=${page}${showDateFilter ? "&" + showDateFilter : ""}&sort_by=${sortBy}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );
    }

    let movieResponse: any;
    // Get trending movies
    if (shouldFetchMovies) {
      movieResponse = await $fetch(
        `https://api.themoviedb.org/3/discover/movie?language=en-US&include_adult=true&page=${page}${movieDateFilter ? "&" + movieDateFilter : ""}&sort_by=${sortBy}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );
    }

    if (
      showResponse?.results?.length > 0 ||
      movieResponse?.results?.length > 0
    ) {
      let shows = [];
      let movies = [];

      // Format the returned shows
      shows = showResponse?.results
        ? formatCardData({
            items: showResponse?.results,
            mediaType: "tv",
          })
        : [];
      // Format the returned movies
      movies = movieResponse?.results
        ? formatCardData({
            items: movieResponse?.results,
            mediaType: "movie",
          })
        : [];

      let data = [...movies, ...shows];
      data = optimizeApiResults({ data });

      // Shuffle the array so movies and shows are mixed
      data = data.sort(() => 0.5 - Math.random());
      // Sort by rating if top rated
      if (viewMoreType === "topRated") {
        data = data.sort((a, b) => b.averageRating - a.averageRating);
      }

      const totalShowPages: number = showResponse?.total_pages ?? 1;
      const totalMoviePages: number = movieResponse?.total_pages ?? 1;

      return {
        statusCode: 200,
        message: "Data fetched successfully",
        viewMoreData: data as CardData[],
        totalMoviePages: totalMoviePages,
        totalShowPages: totalShowPages,
      };
    }

    return {
      statusCode: 400,
      message: "Unexpected Error",
      viewMoreData: [],
      totalShowPages: 0,
      totalMoviePages: 0,
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
