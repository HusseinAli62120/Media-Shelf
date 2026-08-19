<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useWindowSize } from "@vueuse/core";

const {
  isCollection = false,
  topFiveItem,
  selectTopFive = false,
  itemLiked,
  isWatchlist,
  item,
} = defineProps<{
  item?: CardData;
  itemLiked?: boolean; // To show heart if the card is liked
  isWatchlist?: boolean; // To hide rating & like if watchlist
  topFiveItem?: TopFive; // Top 5 card data
  selectTopFive?: boolean; // To trigger a function when card is clicked (used in selection drawer)
  isCollection?: boolean;
}>();

const emit = defineEmits(["replaceTopFive", "removeTopFive", "selectTopFive"]);

const cardItems = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Replace",
      icon: "i-lucide-arrow-left-right",
      onSelect: () => {
        emit("replaceTopFive");
      },
    },
    {
      label: "Remove",
      icon: "i-lucide-x",
      onSelect: () => {
        emit("removeTopFive");
      },
    },
  ],
]);

// Composables
const { width } = useWindowSize();

const isMobile = computed(() => {
  return width.value < 400;
});

// Title hidden when: favorite/watched/top-5 AND there is rating/liked

const showTitle = computed(() => {
  if (
    (isCollection && !isWatchlist && (Number(item?.rating) > 0 || itemLiked)) ||
    // Condition-2
    (topFiveItem && (Number(topFiveItem?.rating) > 0 || itemLiked))
  ) {
    return false;
  } else {
    return true;
  }
});

// Show rating/liked if collection BUT NOT watchlist or if Top-5
const showEngagement = computed(() => {
  if (
    (isCollection && !isWatchlist) ||
    (topFiveItem &&
      (Number(item?.rating) > 0 ||
        Number(topFiveItem?.rating) > 0 ||
        itemLiked))
  ) {
    return true;
  } else {
    return false;
  }
});

// Show stars if has rating
const hasRating = computed(() => {
  if (
    (item?.rating && Number(item?.rating) > 0) ||
    (topFiveItem?.rating && Number(topFiveItem?.rating) > 0)
  ) {
    return true;
  } else {
    return false;
  }
});
</script>

<template>
  <div
    @click="
      () => {
        if (selectTopFive) {
          emit('selectTopFive');
        }
      }
    "
    class="group flex flex-col justify-between relative bg-secondary-background border border-border/40 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    :class="topFiveItem && 'max-w-55 w-full mx-auto h-full'"
  >
    <!-- Poster Image -->
    <!-- Link in all cases except when making a top-5 selection -->
    <NuxtLink
      v-if="!selectTopFive"
      :to="
        (item?.media_type || topFiveItem?.media_type) === 'movie'
          ? `/movie/details-${item?.mediaId || topFiveItem?.mediaId}`
          : `/tv/details-${item?.mediaId || topFiveItem?.mediaId}`
      "
      class="aspect-2/3 w-full overflow-hidden relative bg-muted"
    >
      <img
        v-if="item?.imgURL || topFiveItem?.imgURL"
        :src="item?.imgURL || topFiveItem?.imgURL || ''"
        :alt="item?.name! || topFiveItem?.name!"
        class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </NuxtLink>

    <!-- Emit to select -->
    <div
      v-else
      class="aspect-2/3 w-full cursor-pointer overflow-hidden relative bg-muted"
    >
      <img
        v-if="item?.imgURL"
        :src="item?.imgURL"
        :alt="item?.name!"
        class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </div>

    <!-- Card Info -->
    <div class="flex flex-row justify-between items-center">
      <!-- Title & Info -->
      <div
        class="p-1 pb-2 xs:p-3 flex flex-col space-y-1 justify-between w-full"
      >
        <NuxtLink
          v-if="showTitle"
          :to="
            (item?.media_type || topFiveItem?.media_type) === 'movie'
              ? `/movie/details-${item?.mediaId || topFiveItem?.mediaId}`
              : `/tv/details-${item?.mediaId || topFiveItem?.mediaId}`
          "
          class="font-bold line-clamp-1 text-xs xs:text-sm group-hover:text-primary transition-colors cursor-pointer"
        >
          {{ item?.name ?? topFiveItem?.name }}
        </NuxtLink>
        <!-- Year, type & Rating (Non-colllection & Non-top-5) -->
        <div
          v-if="!isCollection && !topFiveItem"
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
                item?.first_air_date
                  ? new Date(item?.first_air_date).getFullYear()
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
            :label="Number(item?.averageRating).toFixed(1)"
          >
          </UBadge>
        </div>

        <!-- Rating & liked (Collection Only (watched & favorites)) -->
        <div v-if="showEngagement" class="flex flex-row items-center space-x-1">
          <div v-if="hasRating" class="flex flex-row items-center space-x-0.5">
            <div v-for="star in 5" :key="star">
              <div
                v-if="
                  Number(item?.rating) >= star - 0.5 ||
                  Number(topFiveItem?.rating) >= star - 0.5
                "
                class="relative w-4 h-4 shrink-0 flex items-center justify-center"
              >
                <UIcon
                  name="i-heroicons-star"
                  class="w-4 h-4 text-amber-400/25"
                />

                <!-- Full Solid Star -->
                <UIcon
                  v-if="
                    Number(item?.rating) >= star ||
                    Number(topFiveItem?.rating) >= star
                  "
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
            v-if="hasRating && itemLiked"
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
      <UDropdownMenu v-if="topFiveItem" :modal="false" :items="cardItems">
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
