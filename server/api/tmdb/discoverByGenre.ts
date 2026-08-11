export default defineEventHandler(async (event) => {
  try {
    const apiKey = process.env.NUXT_SHOW_MOVIE_API_KEY;
    if (!apiKey) {
      throw createError({
        statusCode: 500,
        message: "Internal Server Error",
      });
    }

    const { type, genreId, page } = getQuery(event);

    if (!type || !genreId || !page) {
      throw createError({
        statusCode: 400,
        message: "Bad Request Parameters!!!!",
      });
    }

    const res: any = await $fetch(
      `https://api.themoviedb.org/3/discover/${type}?sort_by=popularity.desc&with_genres=${genreId}&page=${page}`,
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

      // remove duplicates by mediaId
      genreMedia.filter((item: any, index: number) => {
        return (
          genreMedia.findIndex((i: any) => i.mediaId === item.mediaId) === index
        );
      });

      // filter shows & movies without a poster
      genreMedia.filter(
        (item: any) =>
          item?.imgURL?.length > 0 && !item?.imgURL?.endsWith("null"),
      );

      const totalPages: number = res.total_pages ?? 1;
      const count: number = genreMedia.length;

      return {
        statusCode: 200,
        message: "Data fetched successfully",
        genreMedia: genreMedia as CardData[],
        totalPages: totalPages,
        count: count,
      };
    }

    return {
      statusCode: 400,
      message: "Unexpected Error",
      genreMedia: [],
      totalPages: 0,
      count: 0,
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
