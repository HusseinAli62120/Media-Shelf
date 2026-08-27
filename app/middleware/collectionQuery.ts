export default defineNuxtRouteMiddleware((to, from) => {
  // Used to check if there is a valid query & is valid, if not, default to watched
  if (
    !to?.query?.tab ||
    (to?.query?.tab !== "watched" &&
      to?.query?.tab !== "watchlist" &&
      to?.query?.tab !== "favorites")
  ) {
    return navigateTo({
      path: to.path,
      query: {
        tab: "watched",
      },
      replace: true,
    });
  }
});
