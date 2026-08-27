<script setup lang="ts">
import { Role } from "#shared/enums/Role";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

// The Auth data
const { user } = useUserSession();

// Fetch trending movies and shows
const {
  data: trendingData,
  pending: trendingPending,
  error: trendingError,
} = await useFetch("/api/tmdb/trending");

// Fetch the top rated movies and shows
const {
  data: topRatedData,
  pending: topRatedPending,
  error: topRatedError,
} = await useFetch("/api/tmdb/topRated");

// Discover movies and shows
const {
  data: discoverData,
  pending: discoverPending,
  error: discoverError,
} = await useFetch("/api/tmdb/discover");
</script>

<template>
  <Navbar />
  <div class="flex-1 w-full flex flex-col bg-background text-foreground">
    <!-- Hero section -->
    <HeroSection />

    <!-- Main Content Area -->
    <div class="px-4 py-12 flex-1 flex flex-col gap-10">
      <!-- Welcome message -->
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary-background border border-border/40 p-6 rounded-2xl shadow-sm"
      >
        <div>
          <h2 class="text-2xl font-bold tracking-tight">
            Welcome back, {{ user?.userName }}!
          </h2>
          <p class="text-muted-foreground text-sm mt-1">
            Explore what's popular this week, search the database, or manage
            your personal media shelf.
          </p>
        </div>
        <div class="flex gap-2">
          <UButton
            v-if="user?.role === Role.ADMIN"
            color="neutral"
            variant="subtle"
            to="/admin"
            icon="i-lucide-settings"
            class="rounded-xl font-medium"
          >
            Admin Dashboard
          </UButton>
        </div>
      </div>

      <!-- Trending -->
      <Section
        :loading="trendingPending"
        :error="trendingError"
        :data="trendingData?.trending || []"
        sectionTitle="Trending Now"
        sectionDescription="The most popular movies and shows this week"
      />

      <!-- Top Rated -->
      <Section
        :loading="topRatedPending"
        :error="topRatedError"
        :data="topRatedData?.topRated || []"
        sectionTitle="Top Rated"
        sectionDescription="The highest rated movies and shows"
        to="/more/topRated"
      />

      <!-- Discover -->
      <Section
        :loading="discoverPending"
        :error="discoverError"
        :data="discoverData?.discovered || []"
        sectionTitle="Discover"
        sectionDescription="Discover new movies and shows"
        to="/more/discover"
      />
    </div>
  </div>
</template>
