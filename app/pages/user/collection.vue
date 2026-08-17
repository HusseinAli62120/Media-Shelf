<script setup lang="ts">
import { Role } from "#shared/enums/Role";
import { useInfiniteScroll } from "@vueuse/core";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth", "collection-query"],
  allowedRoles: [Role?.USER, Role?.ADMIN],
});

// Composables
const toast = useToast();
const route = useRoute();

let tab = ref(route?.query?.tab as "watched" | "watchlist" | "favorites");

const { fetchCollection, isFetching, limit, skip, pageCount, collection } =
  useCollection({});
let endpoint: string =
  tab.value === "watchlist"
    ? "/api/watchlist/watchlist"
    : tab.value === "favorites"
      ? "/api/favorites/favorites"
      : "/api/watched/watched";

// Initial fetch on the server
const { data, pending, error } = await useFetch<{
  statusCode: number;
  statusMessage: string;
  userWatchList?: CardData[];
  userWatched?: CardData[];
  userFavorites?: CardData[];
  pageCount?: number;
}>(endpoint, {
  method: "GET",
  query: {
    skip: skip.value,
    limit: limit.value,
  },

  onResponseError({ response }) {
    toast.add({
      title: "Error",
      description: response?._data?.statusMessage,
      color: "error",
    });
  },
});

if (
  data.value?.userWatched ||
  data.value?.userWatchList ||
  data.value?.userFavorites
) {
  collection.value =
    data.value.userWatched ||
    data.value.userWatchList ||
    data.value.userFavorites ||
    [];
  pageCount.value = data.value.pageCount ?? 0;
  skip.value = limit.value;
}

// Watch for query change in the route (tab click)
watch(route, () => {
  // Get the tab value
  tab.value = route?.query?.tab as "watched" | "watchlist" | "favorites";

  // Reset pagination
  skip.value = 0;
  limit.value = 16;
  pageCount.value = 0;
  collection.value = [];

  fetchCollection({ tab: tab?.value });
});

// diaryOpen state
let diaryOpen = ref(false);

// Infinite scroll
const scrollArea = useTemplateRef("scrollArea");

// Fetch more on scroll
useInfiniteScroll(
  () => scrollArea?.value?.$el,
  async () => {
    if (isFetching.value || skip.value >= pageCount.value * limit.value) return;
    await fetchCollection({ tab: tab?.value });
  },
  { distance: 200 },
);
</script>

<template>
  <Navbar />

  <div
    v-if="pending"
    class="flex flex-1 flex-col items-center justify-center w-full"
  >
    <p>Loading...</p>
  </div>
  <div
    v-else-if="error"
    class="flex flex-1 flex-col items-center justify-center w-full"
  >
    <FetchMessage :message="'Failed to fetch data'" :type="'error'" />
  </div>
  <!-- Page -->
  <div v-else class="flex h-[90vh] flex-col items-start justify-start w-full">
    <!-- Top Bar -->
    <Topbar
      @open-diary="
        () => {
          diaryOpen = true;
        }
      "
    />

    <DiaryListSlideover v-model:open="diaryOpen" />

    <!-- Media grid -->
    <UScrollArea
      v-if="collection?.length && collection?.length > 0"
      :items="collection"
      v-slot="{ item }"
      ref="scrollArea"
      :ui="{
        root: 'no-scrollbar',
        viewport:
          'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 py-4 px-4 ',
      }"
    >
      <Card :item="item" />
    </UScrollArea>

    <!-- Tab Switch loading -->
    <div
      v-else-if="isFetching"
      class="flex-1 flex items-center justify-center w-full"
    >
      <UProgress
        indeterminate
        size="xs"
        class="absolute top-0 inset-x-0 z-1"
        :ui="{ base: 'bg-default' }"
      />

      <UIcon
        name="i-lucide-loader-2"
        class="animate-spin text-muted-foreground w-10 h-10"
      />
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-1 flex-col items-center justify-center w-full">
      <FetchMessage :message="'Watched list is empty'" :type="'not-found'" />
    </div>

    <!-- Loading More -->
    <UProgress
      v-if="isFetching"
      indeterminate
      size="xs"
      class="absolute top-0 inset-x-0 z-1"
      :ui="{ base: 'bg-default' }"
    />
  </div>
</template>
