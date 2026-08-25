<script setup lang="ts">
import { Role } from "#shared/enums/Role";
import { useInfiniteScroll } from "@vueuse/core";
import { onMounted } from "vue";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

// Composables
const route = useRoute();
const toast = useToast();

// Check if the route paramater exists
if (
  !route.params.viewMore ||
  (route.params.viewMore !== "topRated" && route.params.viewMore !== "discover")
) {
  toast.add({
    title: "Error",
    description: "Invalid page",
    color: "error",
  });
  navigateTo("*");
}

// Set title
let title = ref("");
if (route.params.viewMore === "topRated") {
  title.value = "Top Rated";
} else if (route.params.viewMore === "discover") {
  title.value = "Discover";
}

// Pagination state
let page = ref(1);
let totalShowPages = ref(1);
let totalMoviePages = ref(1);
let isFetchingMore = ref(false);
let viewMoreData = ref<CardData[]>([]);

// Flags to prevent fetching past the last page
let fetchMovies = ref(true);
let fetchShows = ref(true);

// Initial fetch
const { data, pending, error } = await useFetch("/api/tmdb/viewMore", {
  method: "get",
  query: {
    viewMoreType: route.params.viewMore,
    page: 1,
    // Flags to prevent fetching after one has reached the max number of pages
    fetchShows: fetchShows.value,
    fetchMovies: fetchMovies.value,
  },
  onResponseError({ response }) {
    toast.add({
      title: "Error",
      description: response?._data?.message,
      color: "error",
    });
  },
});

if (data?.value?.statusCode === 200 || data?.value?.statusCode === 304) {
  viewMoreData.value = data.value.viewMoreData;
  totalMoviePages.value = data.value.totalMoviePages;
  totalShowPages.value = data.value.totalShowPages;
}

// Infinite scroll
const scrollArea = useTemplateRef("scrollArea");

onMounted(() => {
  useInfiniteScroll(
    scrollArea?.value?.$el,
    async () => {
      if (isFetchingMore.value) {
        return;
      }

      if (fetchMovies.value && page.value >= totalMoviePages.value) {
        fetchMovies.value = false;
      }

      if (fetchShows.value && page.value >= totalShowPages.value) {
        fetchShows.value = false;
      }

      // Don't fetch more if both movie and show arrays have reached their max number of pages
      if (!fetchMovies.value && !fetchShows.value) {
        return;
      }

      isFetchingMore.value = true;
      page.value++;

      try {
        const res = await $fetch("/api/tmdb/viewMore", {
          method: "get",
          query: {
            viewMoreType: route.params.viewMore,
            page: page.value,
            // Flags to prevent fetching after one has reached the max number of pages
            fetchShows: fetchShows.value,
            fetchMovies: fetchMovies.value,
          },
        });

        if (res?.statusCode === 200 || res?.statusCode === 304) {
          viewMoreData.value = [...viewMoreData.value, ...res.viewMoreData];
          totalMoviePages.value = res.totalMoviePages;
          totalShowPages.value = res.totalShowPages;
        }
      } catch (err: any) {
        toast.add({
          title: "Error",
          description: err?.data?.message ?? "Failed to load more",
          color: "error",
        });
        page.value--;
      } finally {
        isFetchingMore.value = false;
      }
    },
    { distance: 200 },
  );
});
</script>

<template>
  <Navbar />
  <div
    v-if="pending"
    class="flex flex-1 flex-col items-center justify-center w-full"
  >
    <p>Loading...</p>
  </div>
  <!-- Error message -->
  <div
    v-else-if="error"
    class="flex flex-1 flex-col items-center justify-center w-full"
  >
    <FetchMessage :message="'Failed to fetch data'" :type="'error'" />
  </div>
  <!-- Content -->
  <div v-else class="flex h-[90vh] flex-col items-start justify-start w-full">
    <div class="border-b border-border/40 pb-4 px-4 py-4 w-full">
      <h1 class="text-3xl font-black tracking-tight">
        {{ title }}
      </h1>
    </div>
    <UScrollArea
      :items="viewMoreData"
      v-slot="{ item }"
      ref="scrollArea"
      :ui="{
        root: 'no-scrollbar',
        viewport:
          'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 py-4  px-4 ',
      }"
    >
      <Card :item="item" />
    </UScrollArea>

    <!-- Loading more indicator -->
    <UProgress
      v-if="isFetchingMore"
      indeterminate
      size="xs"
      class="absolute top-0 inset-x-0 z-1"
      :ui="{ base: 'bg-default' }"
    />
  </div>
</template>
