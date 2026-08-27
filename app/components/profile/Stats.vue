<script setup lang="ts">
import type { Transition } from "motion-v";

const toast = useToast();

defineOptions({
  tags: ["donutcharts", "basic", "barcharts", "vertical"],
});

const { data } = await useFetch("/api/stats/mostWatchedGenres", {
  method: "GET",

  onResponseError() {
    toast.add({
      title: "Error",
      description: "Failed to fetch genres",
      color: "error",
    });
  },
});

// Donut Data
const movieGenreData = computed(
  () => data.value?.movieGenres?.map((item) => item.count) ?? [],
);

const movieGenreLabels = computed(() =>
  Object.fromEntries(
    data.value?.movieGenres?.map((item, index) => [
      item.name,
      {
        name: item.name,
        color: `var(--chart-${index + 1})`,
      },
    ]) ?? [],
  ),
);

const tvGenreData = computed(
  () => data.value?.tvGenres?.map((item) => item.count) ?? [],
);

const tvGenreLabels = computed(() =>
  Object.fromEntries(
    data.value?.tvGenres?.map((item, index) => [
      item.name,
      {
        name: item.name,
        color: `var(--chart-${index + 1})`,
      },
    ]) ?? [],
  ),
);

// Bar chart Data //
const { data: overviewData } = await useFetch("/api/stats/ratingOverview", {
  method: "GET",

  onResponseError() {
    toast.add({
      title: "Error",
      description: "Failed to fetch rating overview",
      color: "error",
    });
  },
});

const ratingCategories = computed(() => ({
  count: {
    name: "Ratings",
    color: "var(--ui-info)",
  },
}));

const xFormatter = (i: number): string =>
  `${overviewData?.value?.ratingOverview[i]?.rating?.split(" ")[0]}`;
const yFormatter = (tick: number) => tick.toString();

let noGenreStats = computed(() => {
  if (movieGenreData?.value?.length === 0 && tvGenreData?.value?.length === 0) {
    return true;
  }
  return false;
});

let noRatingStats = computed(() => {
  let ratingCount = 0;
  overviewData?.value?.ratingOverview?.forEach((item) => {
    ratingCount += item.count;
  });
  if (ratingCount === 0) {
    return true;
  }
  return false;
});

const transition = computed<Transition>(() => ({
  type: "spring",
  stiffness: 160,
  damping: 25,
}));
</script>

<template>
  <!-- Donuts -->
  <div class="w-full flex flex-col space-y-4 px-4 py-10 items-start">
    <ScrewText
      :label="'Most Watched Genres'"
      :rotate-direction="'top'"
      :stagger-duration="0.03"
      :stagger-from="'first'"
      :transition="transition"
      class="text-xl font-bold tracking-tight inline"
      front-face-class="bg-background text-foreground"
      second-face-class="bg-background text-foreground"
    />
    <ClientOnly>
      <div
        v-if="noGenreStats"
        class="w-full flex flex-col items-center justify-center gap-4"
      >
        <p class="text-muted text-center">Start Watching To See Your Stats</p>
      </div>
      <div
        v-else
        class="w-full flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-4"
      >
        <DonutChart
          :data="movieGenreData"
          :categories="movieGenreLabels"
          :height="285"
          :radius="80"
          :pad-angle="0.1"
          :arc-width="20"
          :hide-tooltip="false"
          :show-background="false"
          :hide-legend="false"
          :duration="250"
          class="sm:w-1/2 w-full"
          :legend-style="{
            display: 'flex',
            flexDirection: 'wrap',
            marginTop: '20px',
          }"
        >
          <div class="text-center">
            <p class="font-semibold text-foreground text-xl">Movies</p>
          </div>
        </DonutChart>

        <DonutChart
          :data="tvGenreData"
          :categories="tvGenreLabels"
          :height="285"
          :radius="80"
          :pad-angle="0.1"
          :arc-width="20"
          :hide-tooltip="false"
          :show-background="false"
          :hide-legend="false"
          class="sm:w-1/2 w-full"
          :legend-style="{
            display: 'flex',
            flexDirection: 'wrap',
            marginTop: '20px',
          }"
        >
          <div class="text-center">
            <p class="font-semibold text-foreground text-xl">TV Shows</p>
          </div>
        </DonutChart>
      </div>

      <template #fallback>
        <DonutSkeleton />
      </template>
    </ClientOnly>
  </div>

  <!-- Bar Chart -->
  <div class="w-full sm:px-6 px-4 py-10">
    <!-- <h6 class="font-semibold text-xl pb-4 w-full">Rating Overview</h6> -->
    <ScrewText
      :label="'Rating Overview'"
      :rotate-direction="'top'"
      :stagger-duration="0.03"
      :stagger-from="'first'"
      :transition="transition"
      class="text-xl font-bold tracking-tight inline"
      front-face-class="bg-background text-foreground"
      second-face-class="bg-background text-foreground"
    />
    <ClientOnly>
      <div
        v-if="noRatingStats"
        class="w-full flex flex-col items-center justify-center gap-4"
      >
        <p class="text-muted text-center">Start Watching to See Your Stats</p>
      </div>
      <BarChart
        v-else
        :data="overviewData?.ratingOverview ?? []"
        :height="300"
        :x-axis="'rating'"
        :y-axis="['count']"
        :categories="ratingCategories"
        :x-num-ticks="10"
        :radius="10"
        :x-formatter="xFormatter"
        :y-formatter="yFormatter"
        :legend-position="LegendPosition.TopRight"
        :hide-legend="false"
        :x-axis-config="{ tickTextColor: 'var(--muted-foreground)' }"
        :y-axis-config="{ tickTextColor: 'var(--muted-foreground)' }"
      />
      <template #fallback>
        <BarChartSkeleton />
      </template>
    </ClientOnly>
  </div>
</template>
