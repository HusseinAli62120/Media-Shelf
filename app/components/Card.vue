<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useWindowSize } from "@vueuse/core";

const {
  isCollection = false,
  isTopFive = false,
  itemLiked,
  isWatchlist,
  item,
} = defineProps<{
  item: CardData;
  itemLiked?: boolean;
  isWatchlist?: boolean; // To hide rating & like if watchlist
  isTopFive?: boolean; // To indicate card is in top-5
  isCollection?: boolean;
}>();

const cardItems = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Replace",
      icon: "i-lucide-arrow-left-right",
      onSelect: () => {
        console.log("Replace");
      },
    },
    {
      label: "Remove",
      icon: "i-lucide-x",
      onSelect: () => {
        console.log("Remove");
      },
    },
  ],
]);

// Composables
const { width } = useWindowSize();

const isMobile = computed(() => {
  return width.value < 400;
});
</script>

<template>
  <div
    class="group flex flex-col gap-2 relative bg-secondary-background border border-border/40 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    :class="isTopFive && 'max-w-55 w-full mx-auto'"
  >
    <!-- Poster Image -->
    <NuxtLink
      :to="
        item?.media_type === 'movie'
          ? `/movie/details-${item.mediaId}`
          : `/tv/details-${item.mediaId}`
      "
      class="aspect-2/3 w-full overflow-hidden relative bg-muted"
    >
      <img
        v-if="item.imgURL"
        :src="item.imgURL"
        :alt="item.name!"
        class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </NuxtLink>

    <!-- Card Info -->
    <div class="flex flex-row justify-between items-center">
      <!-- Title & Info -->
      <div
        class="p-1 pb-2 xs:p-3 flex flex-col space-y-1 justify-between w-full"
      >
        <!-- Title -->
        <NuxtLink
          :to="
            item?.media_type === 'movie'
              ? `/movie/details-${item.mediaId}`
              : `/tv/details-${item.mediaId}`
          "
          class="font-bold line-clamp-1 text-xs xs:text-sm group-hover:text-primary transition-colors cursor-pointer"
        >
          {{ item.name }}
        </NuxtLink>
        <!-- Year, type & Rating (Non-colllection & Non-top-5) -->
        <div
          v-if="!isCollection && !isTopFive"
          class="flex flex-row justify-between items-center"
        >
          <!-- Year & Type -->
          <div class="flex flex-row items-center space-x-1">
            <UBadge
              variant="soft"
              color="primary"
              :size="isMobile ? 'xs' : 'sm'"
            >
              {{
                item.first_air_date
                  ? new Date(item.first_air_date).getFullYear()
                  : "N/A"
              }}
            </UBadge>

            <USeparator orientation="vertical" class="h-2" />

            <UBadge
              variant="soft"
              :color="item?.media_type === 'movie' ? 'success' : 'error'"
              :size="isMobile ? 'xs' : 'sm'"
            >
              {{ item?.media_type === "movie" ? "Movie" : "TV" }}
            </UBadge>
          </div>
          <!-- Rating -->
          <UBadge
            :leading-icon="'i-heroicons-star-solid'"
            variant="soft"
            color="warning"
            :size="isMobile ? 'xs' : 'sm'"
            :label="Number(item.averageRating).toFixed(1)"
          >
          </UBadge>
        </div>

        <!-- Rating & liked (Collection Only (watched & favorites)) -->
        <div
          v-if="isCollection && !isWatchlist"
          class="flex flex-row items-center space-x-1 min-h-4"
        >
          <div
            v-if="item.rating && Number(item?.rating) > 0"
            class="flex flex-row items-center space-x-0.5 min-h-4"
          >
            <div v-for="star in 5" :key="star">
              <div
                v-if="Number(item.rating) >= star - 0.5"
                class="relative w-4 h-4 shrink-0 flex items-center justify-center"
              >
                <UIcon
                  name="i-heroicons-star"
                  class="w-4 h-4 text-amber-400/25"
                />

                <!-- Full Solid Star -->
                <UIcon
                  v-if="Number(item.rating) >= star"
                  name="i-heroicons-star-solid"
                  class="absolute inset-0 w-4 h-4 text-amber-400"
                />

                <!-- Half Solid Star Clipped -->
                <UIcon
                  v-else
                  name="i-heroicons-star-solid"
                  class="absolute inset-0 w-4 h-4 text-amber-400 [clip-path:inset(0_55%_0_0)]"
                />
              </div>
            </div>
          </div>

          <USeparator
            v-if="item?.rating && Number(item?.rating) > 0 && itemLiked"
            orientation="vertical"
            class="h-2"
          />

          <UIcon
            v-if="itemLiked"
            name="i-heroicons-heart-solid"
            class="text-red-500"
          />
        </div>
      </div>
      <!-- Show options only if they are placed in top-5 -->
      <UDropdownMenu v-if="isTopFive" :modal="false" :items="cardItems">
        <UButton
          class="rounded-full px-1"
          size="xs"
          variant="ghost"
          color="neutral"
        >
          <UIcon class="h-4 w-4" name="i-lucide-more-horizontal" />
        </UButton>
      </UDropdownMenu>
    </div>
  </div>
</template>
