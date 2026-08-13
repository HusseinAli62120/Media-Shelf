<script setup lang="ts">
import { Role } from "#shared/enums/Role";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

// defineOptions({
//   tags: ["donutcharts", "basic"],
// });
// const donutData = ref([35, 25, 20, 15, 5]);

// const marketShareLabels = {
//   "Product A": {
//     name: "Product A",
//     color: "var(--ui-primary)",
//   },
//   "Product B": {
//     name: "Product B",
//     color: "var(--ui-info)",
//   },
//   "Product C": {
//     name: "Product C",
//     color: "var(--ui-success)",
//   },
//   "Product D": {
//     name: "Product D",
//     color: "var(--ui-warning)",
//   },
//   Other: {
//     name: "Other",
//     color: "var(--ui-error)",
//   },
// };

const { user } = useUserSession();
</script>

<template>
  <Navbar />
  <div class="flex-1 flex flex-col items-center w-full">
    <!-- Profile header -->
    <ProfileHeader />

    <!-- All time favorites/placeholders -->

    <div
      class="w-full px-4 py-6 grid grid-cols-2 xs:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-6"
    >
      <CardPlaceholder v-for="index in 5" :key="index" :slot-number="index" />
    </div>
  </div>
  <!-- Collection tabs -->
  <div class="border border-muted w-full">
    <p>Collection navigation</p>
  </div>
  <div class="h-screen overflow-hidden bg-red-50 w-full">
    <p>This is screen two</p>
  </div>
</template>

<!-- <DonutChart
          :data="donutData"
          :categories="marketShareLabels"
          :height="200"
          :radius="80"
          :pad-angle="0.1"
          :arc-width="20"
          :show-background="false"
          :style="{ color: '#0a0a0a' }"
        /> -->
