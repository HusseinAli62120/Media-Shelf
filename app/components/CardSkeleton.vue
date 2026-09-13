<script setup lang="ts">
const {
  isCollection = false,
  isWatchlist = false,
  topFive = false,
} = defineProps<{
  isCollection?: boolean;
  isWatchlist?: boolean;
  topFive?: boolean;
}>();
</script>

<template>
  <div
    class="flex flex-col justify-between relative bg-secondary-background border border-border/40 rounded-t-xl rounded-b-md overflow-hidden animate-pulse select-none"
    :class="[topFive && 'max-w-60 w-full mx-auto h-full']"
  >
    <!-- Poster Image Skeleton -->
    <div class="aspect-2/3 w-full bg-muted relative overflow-hidden" />

    <!-- Card Info Skeleton -->
    <div class="flex flex-row justify-between items-center">
      <!-- Title & Info Skeleton -->
      <div
        class="p-1 pb-2 xs:py-1.5 xs:px-3 flex flex-col space-y-1 justify-between w-full"
      >
        <!-- Title Skeleton (Hidden in collection except watchlist) -->
        <div
          v-if="isWatchlist || (!isCollection && !topFive)"
          class="flex items-center h-4 xs:h-5"
        >
          <div
            class="h-3 xs:h-3.5 w-3/4 bg-neutral-200 dark:bg-muted/80 rounded"
          />
        </div>

        <!-- Year, Type & Rating Badges Skeleton (Non-collection & Non-top-5) -->
        <div
          v-if="!isCollection && !topFive"
          class="flex flex-row justify-between items-center"
        >
          <!-- Year & Type -->
          <div class="flex flex-row items-center space-x-1">
            <div
              class="h-4 xs:h-5 w-8 xs:w-10 bg-neutral-200 dark:bg-muted/80 rounded-sm"
            />

            <USeparator orientation="vertical" class="h-2" />

            <div
              class="h-4 xs:h-5 w-9 xs:w-11 bg-neutral-200 dark:bg-muted/80 rounded-sm"
            />
          </div>

          <!-- Rating -->
          <div
            class="h-4 xs:h-5 w-8 xs:w-9 bg-neutral-200 dark:bg-muted/80 rounded-sm"
          />
        </div>

        <!-- Collection Engagement Skeleton (Rating stars) -->
        <div
          v-if="(isCollection && !isWatchlist) || topFive"
          class="flex flex-row items-center space-x-1 h-4 xs:h-5"
        >
          <div class="flex flex-row items-center space-x-1">
            <div
              v-for="star in 5"
              :key="star"
              class="w-3 h-3 xs:w-4 xs:h-4 rounded-sm bg-neutral-200 dark:bg-muted/80"
            />
          </div>
        </div>
      </div>

      <!-- Top-5 action button placeholder -->
      <div
        v-if="topFive"
        class="w-3 h-3 rounded-full bg-neutral-200 dark:bg-muted/80 shrink-0 mr-1.5"
      />
    </div>
  </div>
</template>
