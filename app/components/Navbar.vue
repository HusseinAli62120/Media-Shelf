<script lang="ts" setup>
defineProps<{
  transparent?: boolean;
}>();

// Composables
const { menuItem } = useNavbar();
const toast = useToast();

let isHydrated = ref<boolean>(false);

let showTitle = ref<boolean>(true);
onMounted(() => {
  isHydrated.value = true;
});

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
    <!-- Left / Brand & Navigation section -->
    <div class="flex flex-row items-center gap-2">
      <!-- Navbar Slideover (Mobile) -->
      <NavbarSlideover
        :movie-pending="moviePending"
        :movie-error="movieError"
        :movie-genres="movieGenres?.genres"
        :show-pending="showPending"
        :show-error="showError"
        :show-genres="showGenres?.genres"
      />
      <!-- Brand Logo -->
      <NuxtLink to="/" class="flex flex-row items-center gap-2">
        <UIcon name="i-lucide-film" class="h-6 w-6 hidden sm:inline" />
        <h1
          class="font-semibold text-lg"
          :class="!showTitle && 'hidden sm:inline'"
        >
          Media Shelf
        </h1>
      </NuxtLink>

      <!-- Desktop Navigation Popovers -->
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

    <!-- Right section -->
    <div class="flex flex-row items-center gap-1 sm:gap-2">
      <ExpandableSearchbar
        @show-title="
          (value) => {
            showTitle = value;
          }
        "
        class="inline"
        expand-direction="left"
      />

      <!-- User Dropdown -->
      <UDropdownMenu class="hidden sm:inline" :modal="false" :items="menuItem">
        <UButton
          :disabled="!isHydrated"
          variant="ghost"
          color="neutral"
          class="hover:bg-transparent cursor-pointer"
        >
          <UIcon name="i-lucide-user" class="h-6 w-6" />
        </UButton>
      </UDropdownMenu>
    </div>
  </div>
</template>
