<script setup lang="ts">
const toast = useToast();

defineOptions({
  tags: ["donutcharts", "basic", "barcharts", "vertical"],
});

// Donut Data
let movieGenreData: number[] = [];
let movieGenreLabels: Record<string, { name: string; color: string }> = {};

let tvGenreData: number[] = [];
let tvGenreLabels: Record<string, { name: string; color: string }> = {};

const { data } = await useFetch("/api/stats/mostWatchedGenres", {
  method: "GET",

  onResponse({ response }) {
    if (
      response?._data?.statusCode === 200 ||
      response?._data?.statusCode === 304
    ) {
      movieGenreData = response?._data?.movieGenres?.map((item) => item.count);
      movieGenreLabels = Object.fromEntries(
        response?._data?.movieGenres?.map((item, index) => [
          item.name,
          {
            name: item.name,
            color: `var(--chart-${index + 1})`,
          },
        ]),
      );
      // console.log("movieGenreLabels", movieGenreLabels);
      tvGenreData = response?._data?.tvGenres?.map((item) => item.count);
      tvGenreLabels = Object.fromEntries(
        response?._data?.tvGenres?.map((item, index) => [
          item.name,
          {
            name: item.name,
            color: `var(--chart-${index + 1})`,
          },
        ]),
      );
    }
  },

  onResponseError() {
    toast.add({
      title: "Error",
      description: "Failed to fetch genres",
      color: "error",
    });
  },
});

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
</script>

<template>
  <!-- Donuts -->
  <div class="w-full flex flex-col space-y-4 px-4 py-10 items-start">
    <h6 class="font-semibold text-xl pb-4 w-full">Most Watched Genres</h6>
    <div
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
  </div>

  <!-- Bar Chart -->
  <div class="w-full sm:px-6 px-4 py-10">
    <h6 class="font-semibold text-xl pb-4 w-full">Rating Overview</h6>
    <BarChart
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
  </div>
</template>
