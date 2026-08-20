<script setup lang="ts">
import { Role } from "#shared/enums/Role";
import { useInfiniteScroll } from "@vueuse/core";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { getLocalTimeZone, today } from "@internationalized/date";

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

// Date Range
const tz = getLocalTimeZone();
const breakpoints = useBreakpoints(breakpointsTailwind);
const isDesktop = breakpoints.greaterOrEqual("sm");

const ranges = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 3 months", months: 3 },
  { label: "Last 6 months", months: 6 },
  { label: "Last year", years: 1 },
];

const initialEnd = today(tz);
const modelValue = shallowRef({
  start: initialEnd.subtract({ days: 14 }),
  end: initialEnd,
});

function computeStart(range: (typeof ranges)[number]) {
  const end = today(tz);
  return {
    start: end.subtract({
      days: range.days,
      months: range.months,
      years: range.years,
    }),
    end,
  };
}

function isRangeSelected(range: (typeof ranges)[number]) {
  if (!modelValue.value?.start || !modelValue.value?.end) return false;
  const { start, end } = computeStart(range);

  return (
    modelValue.value.start.compare(start) === 0 &&
    modelValue.value.end.compare(end) === 0
  );
}

function selectRange(range: (typeof ranges)[number]) {
  modelValue.value = computeStart(range);
}

let dateRangeOpen = ref(false);
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
      @open-diary="
        () => {
          diaryOpen = true;
        }
      "
      @on-filter-change="
        (value) => {
          if (value === 'dateRange') {
            dateRangeOpen = true;
            return;
          }
          filter = value;

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
      <Card
        :item="item"
        is-collection
        :item-liked="favoriteIds.includes(item?.mediaId!)"
        :is-watchlist="tab === 'watchlist'"
      />
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

  <!-- Date Range Calender -->
  <UModal
    :ui="{
      header: 'hidden',
      content: 'w-auto sm:max-w-fit',
    }"
    v-model:open="dateRangeOpen"
  >
    <template #body>
      <div class="flex items-stretch divide-x divide-default">
        <div class="hidden sm:flex flex-col justify-center py-2">
          <UButton
            v-for="(range, index) in ranges"
            :key="index"
            :label="range.label"
            color="neutral"
            variant="ghost"
            class="rounded-none px-4"
            :class="[
              isRangeSelected(range) ? 'bg-elevated' : 'hover:bg-elevated/50',
            ]"
            truncate
            @click="selectRange(range)"
          />
        </div>

        <UCalendar
          :ui="{
            gridRow: ' gap-10',
            body: ' gap-4',
            grid: isDesktop ? 'ml-4' : 'ml-0',
          }"
          v-model="modelValue"
          class="p-5"
          :number-of-months="isDesktop ? 2 : 1"
          range
        />
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-end gap-2 w-full">
        <UButton
          class="cursor-pointer"
          color="neutral"
          variant="soft"
          @click="
            () => {
              dateRangeOpen = false;
            }
          "
        >
          <UIcon name="i-lucide-x" class="w-4 h-4" />
          Cancel
        </UButton>
        <UButton
          class="cursor-pointer"
          variant="soft"
          color="info"
          @click="
            async () => {
              if (modelValue?.start && modelValue?.end) {
                filter = {
                  dateRange: {
                    startDate: generateTimestamp({
                      calendarDate: modelValue.start,
                    }).date,
                    endDate: generateTimestamp({
                      calendarDate: modelValue.end,
                    }).date,
                  },
                };
              }

              skip = 0;
              pageCount = 0;
              collection = [];

              await fetchCollection({ tab: tab });
              dateRangeOpen = false;
            }
          "
          :disabled="isFetching"
        >
          <UIcon
            :name="isFetching ? 'i-lucide-loader-2' : 'i-lucide-check'"
            :class="isFetching ? 'animate-spin' : ''"
            class="w-4 h-4"
          />
          {{ isFetching ? "Applying..." : "Apply" }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
