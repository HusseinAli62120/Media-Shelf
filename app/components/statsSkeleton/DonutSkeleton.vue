<template>
  <div
    class="w-full flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-4 animate-pulse"
  >
    <!-- Movie Donut Skeleton -->
    <div class="sm:w-1/2 w-full flex flex-col items-center justify-center">
      <!-- Donut Circle with center label -->
      <div class="relative w-71.25 h-71.25 flex items-center justify-center">
        <!-- Circular ring placeholder -->
        <div
          class="w-48 h-48 rounded-full border-20 border-muted/80 flex items-center justify-center"
        >
          <div class="h-6 w-20 bg-muted/90 rounded-md" />
        </div>
      </div>
      <!-- Legend badges placeholder -->
      <div class="flex flex-wrap justify-center gap-2.5 mt-5 max-w-xs">
        <div
          v-for="i in 5"
          :key="i"
          class="h-4 w-16 bg-muted/70 rounded-full"
        />
      </div>
    </div>

    <!-- TV Donut Skeleton -->
    <div class="sm:w-1/2 w-full flex flex-col items-center justify-center">
      <!-- Donut Circle with center label -->
      <div class="relative w-71.25 h-71.25 flex items-center justify-center">
        <!-- Circular ring placeholder -->
        <div
          class="w-48 h-48 rounded-full border-20 border-muted/80 flex items-center justify-center"
        >
          <div class="h-6 w-24 bg-muted/90 rounded-md" />
        </div>
      </div>
      <!-- Legend badges placeholder -->
      <div class="flex flex-wrap justify-center gap-2.5 mt-5 max-w-xs">
        <div
          v-for="i in 5"
          :key="i"
          class="h-4 w-16 bg-muted/70 rounded-full"
        />
      </div>
    </div>
  </div>
</template>
