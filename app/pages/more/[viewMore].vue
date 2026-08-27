<script setup lang="ts">
import { Role } from "#shared/enums/Role";
import { useInfiniteScroll } from "@vueuse/core";
import { onMounted } from "vue";
import type { Transition } from "motion-v";
import type { DropdownMenuItem } from "@nuxt/ui";

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

const {
  fetchMore,
  data,
  totalMoviePages,
  totalShowPages,
  page,
  isFetchingMore,
  dateRangeOpen,
  ranges,
  fetchMovies,
  fetchShows,
  startDate,
  endDate,
  type,
} = useApi();

// Set title
let title = ref("");
if (route.params.viewMore === "topRated") {
  title.value = "Top Rated";
} else if (route.params.viewMore === "discover") {
  title.value = "Discover";
}

// Initial fetch
const {
  data: initialData,
  pending,
  error,
} = await useFetch("/api/tmdb/viewMore", {
  method: "get",
  query: {
    viewMoreType: route.params.viewMore,
    page: 1,
    // Flags to prevent fetching after one has reached the max number of pages
    fetchShows: fetchShows.value,
    fetchMovies: fetchMovies.value,
    startDate: null,
    endDate: null,
    type: type.value,
  },
  onResponseError({ response }) {
    toast.add({
      title: "Error",
      description: response?._data?.message,
      color: "error",
    });
  },
});

if (
  initialData?.value?.statusCode === 200 ||
  initialData?.value?.statusCode === 304
) {
  data.value = initialData.value.viewMoreData;
  totalMoviePages.value = initialData.value.totalMoviePages;
  totalShowPages.value = initialData.value.totalShowPages;
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

      page.value++;

      await fetchMore({
        startDate: startDate.value
          ? generateTimestamp({ calendarDate: startDate.value }).date
          : null,
        endDate: endDate.value
          ? generateTimestamp({ calendarDate: endDate.value }).date
          : null,
      });
    },
    { distance: 200 },
  );
});

const transition = computed<Transition>(() => ({
  type: "spring",
  stiffness: 160,
  damping: 25,
}));

// Filter options
let filterOptions = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Type",
      icon: "i-heroicons-adjustments-vertical",
      children: [
        {
          label: "Movies",
          onSelect: async () => {
            type.value = "movie";
            page.value = 1;
            fetchMovies.value = true;
            fetchShows.value = false;
            data.value = [];
            await fetchMore({
              startDate: startDate.value
                ? generateTimestamp({ calendarDate: startDate.value }).date
                : null,
              endDate: endDate.value
                ? generateTimestamp({ calendarDate: endDate.value }).date
                : null,
            });
          },
          icon: "i-heroicons-film",
        },
        {
          label: "TV",
          onSelect: async () => {
            type.value = "tv";
            page.value = 1;
            fetchMovies.value = false;
            fetchShows.value = true;
            data.value = [];
            await fetchMore({
              startDate: startDate.value
                ? generateTimestamp({ calendarDate: startDate.value }).date
                : null,
              endDate: endDate.value
                ? generateTimestamp({ calendarDate: endDate.value }).date
                : null,
            });
          },
          icon: "i-heroicons-tv",
        },
      ],
    },
    {
      label: "Date Range",
      onSelect: () => {
        dateRangeOpen.value = true;
      },
      icon: "i-lucide-calendar-search",
    },
  ],
]);
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
    <!-- Title and filters -->
    <div
      class="border-b border-border/40 pb-4 px-4 py-4 w-full flex flex-row items-center justify-between"
    >
      <ScrewText
        :label="title"
        :rotate-direction="'top'"
        :stagger-duration="0.03"
        :stagger-from="'first'"
        :transition="transition"
        class="text-xl xs:text-3xl font-bold tracking-tight inline"
        front-face-class="bg-background text-foreground"
        second-face-class="bg-background text-foreground"
      />
      <!-- Filters -->
      <div class="flex flex-row items-center space-x-2">
        <UIcon
          :disabled="isFetchingMore || pending"
          v-if="(startDate && endDate) || type"
          @click="
            () => {
              startDate = undefined;
              endDate = undefined;
              type = null;
              page = 1;
              fetchMovies = true;
              fetchShows = true;
              data = [];
              fetchMore({});
            }
          "
          :name="isFetchingMore ? 'i-lucide-loader-2' : 'i-lucide-x'"
          :class="isFetchingMore ? 'animate-spin' : ''"
          class="w-3 h-3 mt-1 text-muted-foreground cursor-pointer"
        />

        <p
          v-if="startDate && endDate"
          class="text-xs text-muted-foreground hidden xs:inline"
        >
          {{ formatDateTime({ timestamp: startDate }).date }} -
          {{ formatDateTime({ timestamp: endDate }).date }}
        </p>

        <UBadge
          v-if="type"
          variant="soft"
          :color="type === 'movie' ? 'success' : 'error'"
          size="xs"
        >
          {{ type === "movie" ? "Movie" : "TV" }}
        </UBadge>
        <UDropdownMenu arrow :disabled="isFetchingMore" :items="filterOptions">
          <UButton
            variant="link"
            class="p-0 md:px-2.5 md:py-1.5 cursor-pointer"
          >
            <UIcon
              :class="isFetchingMore && 'animate-spin'"
              class="w-6 h-6"
              :name="
                isFetchingMore ? 'i-lucide-loader-2' : 'i-heroicons-funnel'
              "
            />
          </UButton>
        </UDropdownMenu>
      </div>
    </div>
    <UScrollArea
      v-show="data.length > 0"
      :items="data"
      v-slot="{ item }"
      ref="scrollArea"
      :ui="{
        root: 'no-scrollbar',
        viewport: 'card-grid',
      }"
    >
      <Card :item="item" />
    </UScrollArea>

    <div
      v-if="data.length === 0"
      class="flex-1 flex flex-col items-center justify-center w-full"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="animate-spin text-muted-foreground w-10 h-10"
      />
    </div>

    <!-- Loading more indicator -->
    <UProgress
      v-if="isFetchingMore"
      indeterminate
      size="xs"
      class="absolute top-0 inset-x-0 z-1"
      :ui="{ base: 'bg-default' }"
    />

    <DateRangeModal
      v-model:open="dateRangeOpen"
      :loading="isFetchingMore"
      :ranges="ranges"
      @apply="
        async (newStartDate, newEndDate) => {
          startDate = newStartDate;
          endDate = newEndDate;

          page = 1;
          fetchMovies = type === 'movie' || type === null;
          fetchShows = type === 'tv' || type === null;
          data = [];
          await fetchMore({
            startDate: generateTimestamp({ calendarDate: newStartDate }).date,
            endDate: generateTimestamp({ calendarDate: newEndDate }).date,
          });
          dateRangeOpen = false;
        }
      "
    />
  </div>
</template>
