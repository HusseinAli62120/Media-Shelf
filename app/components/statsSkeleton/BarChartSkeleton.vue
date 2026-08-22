<template>
  <div class="w-full flex flex-col animate-pulse pt-4">
    <!-- Chart Legend placeholder (top right) -->
    <div class="flex justify-end mb-4">
      <div class="h-4 w-20 bg-muted/70 rounded-full" />
    </div>

    <!-- Bar Chart Grid & Bars Area -->
    <div
      class="h-65 w-full flex items-end justify-between gap-2 sm:gap-4 pb-2 border-b border-border/40"
    >
      <div
        v-for="(height, index) in [35, 60, 45, 80, 25, 90, 50, 70, 40, 65]"
        :key="index"
        class="flex-1 flex flex-col items-center justify-end h-full"
      >
        <div
          class="w-full max-w-10 bg-muted/80 rounded-t-lg"
          :style="{ height: `${height}%` }"
        />
      </div>
    </div>

    <!-- X-axis tick labels placeholder -->
    <div class="flex items-center justify-between gap-2 sm:gap-4 mt-2 px-1">
      <div v-for="i in 10" :key="i" class="flex-1 flex justify-center">
        <div class="h-3 w-4 sm:w-6 bg-muted/50 rounded" />
      </div>
    </div>
  </div>
</template>
