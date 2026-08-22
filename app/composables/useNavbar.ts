import type { DropdownMenuItem } from "@nuxt/ui";

export default function useNavbar() {
  // Composables
  const toast = useToast();
  const { clear: clearSession, user } = useUserSession();
  const colorMode = useColorMode();

  // Variables
  const logoutLoading = ref<boolean>(false);

  const logout = async () => {
    try {
      logoutLoading.value = true;
      await clearSession();
      await navigateTo("/login");
    } catch (error) {
      console.log(error);
      toast.add({
        title: "Error",
        description: "Failed to logout",
        color: "error",
      });
    } finally {
      logoutLoading.value = false;
    }
  };

  const toggleTheme = () => {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  };

  // Dropdown menu items
  const menuItem = computed<DropdownMenuItem[][]>(() => [
    [
      {
        label: user?.value?.userName || "Profile",
        description: "View Profile",
        icon: "i-lucide-user",
        onSelect: () => {
          navigateTo("/user/profile");
        },
        class: "cursor-pointer",
      },
    ],
    [
      {
        label: "Watched",
        icon: "i-heroicons-eye",
        onSelect: () => {
          navigateTo({ path: "/user/collection", query: { tab: "watched" } });
        },
      },
      {
        label: "Watchlist",
        icon: "i-heroicons-bookmark",
        onSelect: () => {
          navigateTo({ path: "/user/collection", query: { tab: "watchlist" } });
        },
      },
      {
        label: "Favorites",
        icon: "i-heroicons-heart",
        onSelect: () => {
          navigateTo({ path: "/user/collection", query: { tab: "favorites" } });
        },
      },
    ],
    [
      {
        label: colorMode.value === "dark" ? "Dark" : "Light",
        icon: colorMode.value === "dark" ? "i-lucide-moon" : "i-lucide-sun",
        onSelect: () => {
          toggleTheme();
        },
      },
      {
        label: "Change Password",
        icon: "i-lucide-settings",
        onSelect: () => {
          console.log("Change password");
        },
      },
      {
        label: logoutLoading.value ? "Logging out..." : "Logout",
        icon: logoutLoading.value ? "i-lucide-loader-2" : "i-lucide-log-out",
        color: "error",
        onSelect: logout,
        disabled: logoutLoading.value,
      },
    ],
  ]);

  return {
    menuItem,
    toggleTheme,
    logout,
    logoutLoading,
  };
}
