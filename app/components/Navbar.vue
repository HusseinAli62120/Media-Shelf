<script lang="ts" setup>
defineProps<{
  transparent?: boolean;
}>();

// Composables
const colorMode = useColorMode();
const { toggleTheme, menuItem, toast } = useNavbar();

// Fetch genres
const {
  data: movieGenres,
  error: movieError,
  pending: moviePending,
} = await useFetch("/api/tmdb/genres", {
  query: {
    type: "movie",
  },
  server: false,
  onResponseError({ response }) {
    toast.add({
      color: "error",
      title: "Error",
      description: response?._data?.message,
    });
  },
});

const {
  data: showGenres,
  error: showError,
  pending: showPending,
} = await useFetch("/api/tmdb/genres", {
  query: {
    type: "tv",
  },
  server: false, // So that the nav appears on the client when the request is being made
  onResponseError({ response }) {
    toast.add({
      color: "error",
      title: "Error",
      description: response?._data?.message,
    });
  },
});
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
        <UIcon name="i-lucide-film" class="h-6 w-6" />
        <h1 class="font-semibold text-lg">Media Shelf</h1>
      </NuxtLink>

      <div class="hidden sm:flex flex-row items-center">
        <UPopover mode="hover" enable-touch>
          <UButton label="Movies" color="neutral" variant="link" />

          <template #content>
            <div v-if="movieError" class="p-4 text-center text-error text-sm">
              <p>Failed to load movies genres</p>
            </div>
            <div v-else-if="moviePending" class="p-4 text-center text-sm">
              <p>Loading movies genres...</p>
            </div>
            <div v-else class="grid grid-cols-4 gap-x-2 gap-y-2 p-4">
              <ULink
                v-for="genre in movieGenres?.genres"
                :to="`/Movies-${genre.name}`"
                :key="genre.id"
                class="text-sm text-center text-muted hover:text-primary transition-colors whitespace-nowrap"
              >
                {{ genre.name }}
              </ULink>
            </div>
          </template>
        </UPopover>
        <UPopover mode="hover" enable-touch>
          <UButton label="Shows" color="neutral" variant="link" />

          <template #content>
            <div v-if="showError" class="p-4 text-center text-error text-sm">
              <p>Failed to load shows genres</p>
            </div>
            <div v-else-if="showPending" class="p-4 text-center text-sm">
              <p>Loading shows genres...</p>
            </div>
            <div v-else class="grid grid-cols-4 gap-x-1 gap-y-2 p-4">
              <ULink
                v-for="genre in showGenres?.genres"
                :to="`/Shows-${genre.name}`"
                :key="genre.id"
                class="text-sm text-center text-muted hover:text-primary transition-colors whitespace-nowrap"
              >
                {{ genre.name }}
              </ULink>
            </div>
          </template>
        </UPopover>
      </div>
    </div>

    <!-- Left section -->
    <div>
      <ClientOnly>
        <UButton
          class="rounded-full"
          variant="ghost"
          color="neutral"
          @click="toggleTheme"
        >
          <ClientOnly>
            <UIcon
              name="i-lucide-sun"
              class="text-yellow-500 w-6 h-6"
              v-if="colorMode.preference === 'light'"
            />
            <UIcon name="i-lucide-moon" class="w-6 h-6" v-else />
          </ClientOnly>
        </UButton>

        <template #fallback>
          <UButton
            disabled
            class="rounded-full"
            variant="ghost"
            color="neutral"
          >
            <UIcon name="i-lucide-moon" class="text-gray-500 w-6 h-6" />
          </UButton>
        </template>
      </ClientOnly>

      <UDropdownMenu :modal="false" :items="menuItem">
        <UButton variant="ghost" color="neutral" class="rounded-full">
          <UIcon name="i-lucide-user" class="h-6 w-6" />
        </UButton>
      </UDropdownMenu>
    </div>
  </div>
</template>
