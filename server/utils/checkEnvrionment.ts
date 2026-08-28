export default function checkEnvironment() {
  if (!process.env.NUXT_PUBLIC_APP_ENV) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }

  return process.env.NUXT_PUBLIC_APP_ENV;
}
