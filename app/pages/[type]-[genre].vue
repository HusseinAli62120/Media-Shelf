<script setup lang="ts">
import { Role } from "#shared/enums/Role";
import { useInfiniteScroll } from "@vueuse/core";
import { onMounted } from "vue";
import type { Transition } from "motion-v";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

// Composables
const route = useRoute();
const toast = useToast();
const {
  fetchGenreData,
  page,
  totalMoviePages,
  isFetchingMore,
  data,
  startDate,
  endDate,
  dateRangeOpen,
  ranges,
} = useApi();

// Get the genre id from name
const genreId = getGenreId({
  type: route?.params?.type?.toString() as string,
  genre: route?.params?.genre?.toString() as string,
});

// Initial fetch
const {
  data: initialData,
  pending,
  error,
} = await useFetch("/api/tmdb/discoverByGenre", {
  query: {
    type: route.params.type === "Movies" ? "movie" : "tv",
    genreId: genreId,
    page: 1,
    startDate: null,
    endDate: null,
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
  data.value = initialData?.value.genreMedia;
  totalMoviePages.value = initialData.value.totalPages;
}

// Infinite scroll
const scrollArea = useTemplateRef("scrollArea");

onMounted(() => {
  useInfiniteScroll(
    scrollArea?.value?.$el,
    async () => {
      if (isFetchingMore.value || page.value >= totalMoviePages.value) return;

      page.value++;
      await fetchGenreData({
        genreId: genreId!,
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
      class="border-b border-border/40 px-4 py-2 w-full flex flex-row items-center justify-between"
    >
      <ScrewText
        :label="route.params.genre!.toString()"
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
          v-if="startDate && endDate"
          @click="
            () => {
              startDate = undefined;
              endDate = undefined;
              page = 1;
              data = [];
              fetchGenreData({ genreId: genreId! });
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
        <UButton
          :disabled="isFetchingMore || pending"
          variant="link"
          class="p-0 md:px-2.5 md:py-1.5"
          @click="
            () => {
              dateRangeOpen = true;
            }
          "
        >
          <UIcon
            :class="isFetchingMore ? 'animate-spin' : ''"
            class="w-6 h-6"
            :name="
              isFetchingMore ? 'i-lucide-loader-2' : 'i-lucide-calendar-search'
            "
          />
        </UButton>
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
          data = [];
          await fetchGenreData({
            genreId: genreId!,
            startDate: generateTimestamp({ calendarDate: newStartDate }).date,
            endDate: generateTimestamp({ calendarDate: newEndDate }).date,
          });
          dateRangeOpen = false;
        }
      "
    />
  </div>
</template>
