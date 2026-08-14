<script setup lang="ts">
const { user } = useUserSession();

// Get Average Ratings
const { data } = await useFetch("/api/stats/averageRating", {
  method: "GET",
});
</script>

<template>
  <div class="w-full border-b border-t border-border px-4 py-6">
    <div class="flex flex-col gap-6 md:flex-row items-center justify-between">
      <!-- Profile -->
      <div class="flex flex-col md:flex-row min-w-0 items-center gap-4">
        <!-- Profile picture -->
        <div class="shrink-0 flex flex-row items-center gap-4">
          <UAvatar
            :alt="user?.userName"
            :text="user?.userName?.charAt(0).toUpperCase()"
            class="shrink-0 w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32"
          />

          <h6
            class="md:hidden truncate text-2xl font-bold text-center sm:text-start tracking-tight text-highlighted sm:text-3xl"
          >
            {{ user?.userName }}
          </h6>
        </div>

        <!-- Name & description -->
        <div class="min-w-0">
          <h6
            class="hidden md:block truncate text-2xl font-bold text-center sm:text-start tracking-tight text-highlighted sm:text-3xl"
          >
            {{ user?.userName }}
          </h6>

          <p
            class="mt-1 max-w-xl text-sm font-light text-center sm:text-start leading-6 text-muted sm:text-base"
          >
            Movie and TV enthusiast with a passion for discovering great
            stories, rating favorites, and building the perfect collection.
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos
            architecto iure ratione omnis amet vitae ut ex a eaque! Consequatur
            modi excepturi libero suscipit enim vero quas cum nemo saepe.
          </p>
        </div>
      </div>

      <!-- Average ratings -->
      <div
        class="flex w-full items-center justify-center gap-4 sm:gap-8 lg:w-auto lg:shrink-0"
      >
        <div class="flex flex-col items-center gap-2">
          <CircularRating
            label="Average Rating"
            :value="data?.averageMovieRating ?? 0"
            :size="100"
          />
          <span class="text-xs font-medium text-muted">Movies</span>
        </div>

        <USeparator orientation="vertical" class="h-32.5" />

        <div class="flex flex-col items-center gap-2">
          <CircularRating
            label="Average Rating"
            :value="data?.averageTvRating ?? 0"
            :size="100"
          />
          <span class="text-xs font-medium text-muted">TV Shows</span>
        </div>
      </div>
    </div>
  </div>
</template>
