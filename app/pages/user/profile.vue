<script setup lang="ts">
import { Role } from "#shared/enums/Role";
import { useInfiniteScroll } from "@vueuse/core";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

// Composables
const { favoriteIds } = useIdRef({ autoFetch: true });

const {
  data: personalRecommendations,
  pending: personalRecommendationsPending,
  error: personalRecommendationsError,
} = await useFetch("/api/tmdb/personalRecommendations");

const {
  topFive,
  removeTopFive,
  openTopFiveDrawer,
  isReplace,
  slotNumber,
  replacedId,
} = useTopFive();

const { data: fetchedTopFive, pending: topFivePending } = await useFetch(
  "/api/topFive/getTopFive",
  {
    method: "GET",
  },
);

// Set the top five value
if (
  fetchedTopFive?.value?.statusCode === 200 ||
  fetchedTopFive?.value?.statusCode === 304
) {
  topFive.value = fetchedTopFive.value.topFive || [];
}

// Fetch the count stats
const { data: counts, pending: countsPending } = await useFetch(
  "/api/stats/counts",
  { method: "GET" },
);
</script>

<template>
  <Navbar />
  <div class="flex-1 flex flex-col items-center w-full">
    <!-- Profile header -->
    <ProfileHeader />

    <!-- All time favorites/placeholders -->
    <div
      class="w-full px-4 pt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 lg:gap-6"
    >
      <!-- Top-5 & Placeholder -->
      <div v-for="index in 5">
        <Card
          v-if="topFive.some((value) => value.slotNumber === index)"
          :topFiveItem="topFive.find((value) => value.slotNumber === index)"
          :item-liked="
            topFive.find((value) => value.slotNumber === index) &&
            favoriteIds?.includes(
              topFive.find((value) => value.slotNumber === index)?.mediaId!,
            )
          "
          @remove-top-five="
            () => {
              removeTopFive({
                id: topFive.find((value) => value.slotNumber === index)?.id!,
              });
            }
          "
          @replace-top-five="
            () => {
              isReplace = true;
              replacedId = topFive.find(
                (value) => value.slotNumber === index,
              )?.id!;
              openTopFiveDrawer = true;
            }
          "
        />
        <CardPlaceholder
          v-else
          @open-top-five-drawer="
            () => {
              openTopFiveDrawer = true;
              slotNumber = index;
            }
          "
          :key="index"
          :slot-number="index"
        />
      </div>
      <TopFiveSelectionDrawer />
    </div>

    <!-- Collection tabs -->
    <div
      class="border-b border-muted w-full px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-8"
    >
      <!-- Emerald 300-500-700 -->
      <CollectionTab
        title="Watched"
        :substring="
          countsPending
            ? 'Loading...'
            : counts && counts?.watchedCount > 0
              ? `${counts.watchedCount} Entries (${counts.watchedThisYear} This year)`
              : 'Start Watching!!!'
        "
        iconName="i-heroicons-eye-solid"
        iconColor="text-emerald-500"
        :to="'/user/collection?tab=watched'"
        :border-color-1="'oklch(84.5% 0.143 164.978)'"
        :border-color-2="'oklch(69.6% 0.17 162.48)'"
        :border-color-3="'oklch(50.8% 0.118 165.612)'"
      />

      <!-- Diary Slideover -->
      <DiaryListSlideover>
        <!-- Sky 300-500-700 -->

        <CollectionTab
          title="Diary"
          iconName="i-lucide-notebook"
          iconColor="text-sky-500"
          :substring="
            countsPending
              ? 'Loading...'
              : counts && counts?.diaryEntriesCount > 0
                ? `${counts.diaryEntriesCount} Entries (${counts.diaryEntriesThisYear} This year)`
                : 'Start Watching!!!'
          "
          :border-color-1="'oklch(82.8% 0.111 230.318)'"
          :border-color-2="'oklch(68.5% 0.169 237.323)'"
          :border-color-3="'oklch(50% 0.134 242.749)'"
        />
      </DiaryListSlideover>

      <!-- Red 300-500-700 -->
      <CollectionTab
        title="Favorites"
        iconName="i-heroicons-heart-solid"
        iconColor="text-red-600"
        :to="'/user/collection?tab=favorites'"
        :border-color-1="'oklch(80.8% 0.114 19.571)'"
        :border-color-2="'oklch(63.7% 0.237 25.331)'"
        :border-color-3="'oklch(50.5% 0.213 27.518)'"
      />

      <!-- Violet 300-500-700 -->
      <CollectionTab
        title="Watchlist"
        iconName="i-heroicons-bookmark-solid"
        iconColor="text-indigo-400"
        :to="'/user/collection?tab=watchlist'"
        :border-color-1="'oklch(81.1% 0.111 293.571)'"
        :border-color-2="'oklch(60.6% 0.25 292.717)'"
        :border-color-3="'oklch(49.1% 0.27 292.581)'"
      />
    </div>

    <!-- Stats -->
    <Stats />

    <!-- Recommended for you -->
    <div class="w-full px-4 py-6">
      <Section
        v-if="
          personalRecommendations?.recommendations &&
          personalRecommendations?.recommendations?.length > 0
        "
        :loading="personalRecommendationsPending"
        :error="personalRecommendationsError"
        :data="personalRecommendations?.recommendations || []"
        sectionTitle="Recommended for you"
        sectionDescription="Discover new movies & shows based on your watchlist"
      />
    </div>

    <!-- Background Particles -->
    <div class="relative">
      <ClientOnly>
        <vue-particles
          id="tsparticles"
          class="absolute inset-0 z-0"
          :options="particlesOptions"
        />
      </ClientOnly>
    </div>
  </div>
</template>
