<script lang="ts" setup>
import type { DropdownMenuItem } from "@nuxt/ui";

defineProps<{
  transparent?: boolean;
}>();

// Variables
const loading = ref<boolean>(false);
// Composables
const colorMode = useColorMode();
const toast = useToast();
const { clear: clearSession, user } = useUserSession();

// Functions
const toggleTheme = () => {
  colorMode.preference = colorMode.preference === "light" ? "dark" : "light";
};

const logout = async () => {
  try {
    loading.value = true;
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
    loading.value = false;
  }
};

const menuItem = ref<DropdownMenuItem[][]>([
  [
    {
      label: user?.value?.userName,
      type: "label",
    },
  ],
  [
    {
      label: "Change Password",
      icon: "i-lucide-settings",
      onSelect: () => {
        console.log("Change password");
      },
    },
    {
      label: loading.value ? "Logging out..." : "Logout",
      icon: loading.value ? "i-lucide-loader-2" : "i-lucide-log-out",
      color: "error",
      onSelect: logout,
      disabled: loading.value,
    },
  ],
]);
</script>

<template>
  <div
    class="w-full px-4 py-2 min-h-[10vh] flex flex-row items-center justify-between transition-all duration-300"
    :class="
      transparent &&
      'absolute top-0 left-0 z-50 bg-transparent backdrop-blur-md '
    "
  >
    <!-- Right section -->
    <div class="flex flex-row items-center gap-0 sm:gap-16">
      <NuxtLink to="/" class="flex flex-row items-center gap-2">
        <LucideFilm class="h-6 w-6" />
        <h1 class="font-semibold text-lg">Media Shelf</h1>
      </NuxtLink>

      <div class="hidden sm:flex flex-row items-center">
        <UButton variant="link" color="neutral" to="/movies">Movies</UButton>
        <UButton variant="link" color="neutral" to="/shows">Shows</UButton>
      </div>
    </div>

    <!-- Left section -->
    <div>
      <ClientOnly>
        <UButton
          class="rounded-lg"
          variant="ghost"
          color="neutral"
          @click="toggleTheme"
        >
          <ClientOnly>
            <LucideSun
              class="text-yellow-500"
              v-if="colorMode.preference === 'light'"
            />
            <LucideMoon v-else />
          </ClientOnly>
        </UButton>

        <template #fallback>
          <UButton disabled class="rounded-lg" variant="ghost" color="neutral">
            <LucideMoon class="text-gray-500" />
          </UButton>
        </template>
      </ClientOnly>

      <UDropdownMenu :modal="false" :items="menuItem">
        <UButton variant="ghost" color="neutral" class="rounded-lg">
          <LucideUser class="h-6 w-6" />
        </UButton>
      </UDropdownMenu>
    </div>
  </div>
</template>
