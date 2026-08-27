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
const { favoriteIds } = useIdRef({ autoFetch: true });

let tab = ref(route?.query?.tab as "watched" | "watchlist" | "favorites");

const {
  fetchCollection,
  isFetching,
  limit,
  skip,
  pageCount,
  collection,
  filter,
  order,
  totalCount,
} = useCollection({});
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
  count: number;
}>(endpoint, {
  method: "GET",
  query: {
    skip: skip.value,
    limit: limit.value,
    order: order.value,
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
  // set values
  collection.value =
    data.value.userWatched ||
    data.value.userWatchList ||
    data.value.userFavorites ||
    [];
  pageCount.value = data.value.pageCount ?? 0;
  skip.value = limit.value;
  totalCount.value = data.value.count;
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
  filter.value = "";
  order.value = "Desc";

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

// calendar date range & open state
let dateRangeOpen = ref(false);
const ranges = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 3 months", months: 3 },
  { label: "Last 6 months", months: 6 },
  { label: "Last year", years: 1 },
];
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
      :count="totalCount ?? 0"
      :is-fetching="isFetching"
      @open-diary="
        () => {
          diaryOpen = true;
        }
      "
      @on-filter-change="
        (filterType, selectedOrder) => {
          if (filterType === 'dateRange') {
            dateRangeOpen = true;
            return;
          }
          filter = filterType;

          order = selectedOrder!;

          // Reset pagination
          skip = 0;
          pageCount = 0;
          collection = [];

          // Fetch based on the filter
          fetchCollection({ tab: tab });
        }
      "
    />

    <DiaryListSlideover v-model:open="diaryOpen" />

    <!-- Media grid -->
    <UScrollArea
      v-show="collection?.length && collection?.length > 0"
      :items="collection"
      v-slot="{ item }"
      ref="scrollArea"
      :ui="{
        root: 'no-scrollbar',
        viewport: 'card-grid',
      }"
    >
      <Card
        :item="item"
        is-collection
        :item-liked="favoriteIds.includes(item?.mediaId!)"
        :is-watchlist="tab === 'watchlist'"
      />
    </UScrollArea>

    <!-- Tab Switch loading -->
    <div
      v-if="isFetching"
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
    <div
      v-if="!isFetching && collection?.length === 0"
      class="flex flex-1 flex-col items-center justify-center w-full"
    >
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

    <!-- Background Particles -->
    <div class="relative">
      <ClientOnly>
        <vue-particles
          id="tsparticles"
          class="absolute inset-0 z-0"
          :options="particlesOptions"
        />
      </ClientOnly>
    </div>
  </div>

  <!-- Date Range Calender -->
  <DateRangeModal
    v-model:open="dateRangeOpen"
    :loading="isFetching"
    :ranges="ranges"
    @apply="
      async (startDate, endDate) => {
        filter = {
          dateRange: {
            startDate: generateTimestamp({
              calendarDate: startDate,
            }).date,
            endDate: generateTimestamp({
              calendarDate: endDate,
            }).date,
          },
        };

        skip = 0;
        pageCount = 0;
        collection = [];

        await fetchCollection({ tab: tab });
        dateRangeOpen = false;
      }
    "
  />
</template>
