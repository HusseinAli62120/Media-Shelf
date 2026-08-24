<script setup lang="ts">
const { user } = useUserSession();

// Get Average Ratings
const { data } = await useFetch("/api/stats/averageRating", {
  method: "GET",
});

let isOpen = ref<boolean>(false);
</script>

<template>
  <div class="w-full border-b border-t border-border px-4 py-6">
    <div class="flex flex-col gap-6 md:flex-row items-center justify-between">
      <!-- Profile -->
      <div class="flex flex-col md:flex-row min-w-0 items-center gap-4">
        <!-- Profile picture -->
        <div class="shrink-0 flex flex-row items-center gap-4">
          <div class="relative">
            <UAvatar
              v-if="user?.profileImg"
              :src="user?.profileImg"
              :alt="user?.userName"
              :text="user?.userName?.charAt(0).toUpperCase()"
              class="shrink-0 w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28"
            />

            <div
              v-else
              class="shrink-0 w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-muted flex items-center justify-center border border-neutral-700/50 text-neutral-400 group-hover:text-neutral-200 transition-colors"
            >
              <UIcon name="i-lucide-user" class="w-10 h-10" />
            </div>

            <div
              class="absolute right-0 bottom-0 sm:w-8 w-6 sm:h-8 h-6 rounded-full bg-muted/20 border border-muted/40 flex items-center justify-center cursor-pointer"
              @click="isOpen = true"
            >
              <UIcon name="i-lucide-user-pen" class="sm:w-4 w-3 sm:h-4 h-3" />
            </div>
          </div>

          <h6
            class="md:hidden truncate text-2xl font-bold text-center sm:text-start tracking-tight text-highlighted sm:text-3xl"
          >
            {{ user?.userName }}
          </h6>

          <EditProfileModal v-model:open="isOpen" />
        </div>

        <!-- Name & description -->
        <div class="min-w-0">
          <h6
            class="hidden md:block truncate text-2xl font-bold text-center sm:text-start tracking-tight text-highlighted sm:text-3xl"
          >
            {{ user?.userName }}
          </h6>

          <p
            v-if="user?.description"
            class="mt-1 max-w-xl text-sm font-light text-center sm:text-start leading-6 text-muted sm:text-base max-h-36 md:max-h-24 overflow-y-auto no-scrollbar"
          >
            {{ user?.description }}
          </p>
        </div>
      </div>

      <!-- Average ratings -->
      <div
        class="flex items-center justify-center gap-4 sm:gap-8 lg:w-auto lg:shrink-0"
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
