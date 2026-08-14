<script setup lang="ts">
defineOptions({
  tags: ["donutcharts", "basic", "barcharts", "vertical"],
});

const colorMode = useColorMode();

// Donut Data //
const mockDonutData = [
  { name: "Action", count: 35 },
  { name: "Comedy", count: 25 },
  { name: "Drama", count: 20 },
  { name: "Thriller", count: 15 },
  { name: "Other", count: 5 },
];
const donutData = computed(() => {
  return mockDonutData.map((item) => item.count);
});

const donutLabels = Object.fromEntries(
  mockDonutData.map((item, index) => [
    item.name,
    {
      name: item.name,
      color: `var(--chart-${index + 1})`,
    },
  ]),
);

// Bar chart Data //
// Rating bar chart data (0.5 to 5)
const ratingData = [
  { rating: "0.5 Stars", count: 4 },
  { rating: "1 Star", count: 8 },
  { rating: "1.5 Stars", count: 15 },
  { rating: "2 Stars", count: 28 },
  { rating: "2.5 Stars", count: 42 },
  { rating: "3 Stars", count: 200 },
  { rating: "3.5 Stars", count: 90 },
  { rating: "4 Stars", count: 412 },
  { rating: "4.5 Stars", count: 70 },
  { rating: "5 Stars", count: 45 },
];

const ratingCategories = computed(() => ({
  count: {
    name: "Rating",
    color: "var(--ui-info)",
  },
}));

const xFormatter = (i: number): string =>
  `${ratingData[i]?.rating?.split(" ")[0]}`;
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
        :data="donutData"
        :categories="donutLabels"
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
        :data="donutData"
        :categories="donutLabels"
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
      :data="ratingData"
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
