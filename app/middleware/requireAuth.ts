import { Role } from "#shared/enums/Role";

export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn, user } = useUserSession();
  console.log("requireAuth");

  // redirect the user to the login screen if they're not authenticated
  if (!loggedIn.value) {
    return navigateTo("/login");
  }

  const allowedRoles = to.meta.allowedRoles as Role[];

  // Check the user role, if not included in the allowed roles, redirect the user to the unauthorized screen
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.value?.role as Role)
  ) {
    return navigateTo("/unauthorized");
  }
});
