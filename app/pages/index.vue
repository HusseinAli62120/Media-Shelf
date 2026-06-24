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
  pending,
  error,
} = await useFetch<{ trending: ApiData[] }>("/api/tmdb/trending");
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

      <!-- Section -->
      <div class="flex flex-col gap-6">
        <!-- Section headline -->
        <div
          class="flex justify-between items-end border-b border-border/40 pb-4"
        >
          <div>
            <h3 class="text-2xl font-black tracking-tight">Trending Now</h3>
            <p class="text-muted-foreground text-sm mt-0.5">
              The most popular movies and shows this week
            </p>
          </div>
        </div>

        <!-- Loading Skeleton -->
        <div
          v-if="pending"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
        >
          <div
            v-for="i in 10"
            :key="i"
            class="flex flex-col gap-3 animate-pulse"
          >
            <div class="aspect-2/3 w-full bg-muted rounded-xl" />
            <div class="h-4 w-3/4 bg-muted rounded" />
            <div class="h-3 w-1/2 bg-muted rounded" />
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12 text-red-500">
          <p class="font-medium">
            Failed to load media. Please try again later.
          </p>
        </div>

        <!-- Media Grid -->
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
        >
          <!-- Card -->
          <Card
            v-for="item in trendingData?.trending"
            :key="item.id"
            :item="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>
