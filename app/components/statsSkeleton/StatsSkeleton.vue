<template>
  <div class="w-full flex flex-col">
    <!-- Donuts Section -->
    <div class="w-full flex flex-col space-y-4 px-4 py-10 items-start">
      <div class="h-7 w-48 bg-muted/80 rounded-md animate-pulse" />
      <DonutSkeleton />
    </div>

    <!-- Bar Chart Section -->
    <div class="w-full sm:px-6 px-4 py-10">
      <div class="h-7 w-40 bg-muted/80 rounded-md animate-pulse mb-4" />
      <BarChartSkeleton />
    </div>
  </div>
</template>
