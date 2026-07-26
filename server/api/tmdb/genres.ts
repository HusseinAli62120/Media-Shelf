import { Genre } from "~~/server/types/Genre";

export default defineEventHandler(async (event) => {
  try {
    const apiKey = process.env.NUXT_SHOW_MOVIE_API_KEY;

    if (!apiKey) {
      throw createError({
        statusCode: 500,
        message: "Internal server error",
      });
    }

    const { type } = getQuery(event);

    if (!type || type.toString().toLowerCase() === "") {
      throw createError({
        statusCode: 400,
        message: "Bad Request Parameters",
      });
    }

    const res: any = await $fetch(
      `https://api.themoviedb.org/3/genre/${type}/list`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );

    return {
      statusCode: 200,
      message: "Success",
      genres: res.genres as Genre[],
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
