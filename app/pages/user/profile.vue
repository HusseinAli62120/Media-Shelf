<script setup lang="ts">
import { Role } from "#shared/enums/Role";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

const {
  data: personalRecommendations,
  pending: personalRecommendationsPending,
  error: personalRecommendationsError,
} = await useFetch("/api/tmdb/personalRecommendations");
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

    <!-- Collection tabs -->
    <div
      class="border-b border-muted w-full px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-8"
    >
      <!-- Emerald 300-500-700 -->
      <CollectionTab
        title="Watched"
        :substring="'200 Entries (10 This year)'"
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
          :substring="'200 Entries (10 This year)'"
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
  </div>
</template>
