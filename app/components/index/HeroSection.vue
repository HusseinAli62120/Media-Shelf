<script setup lang="ts">
import { ref } from "vue";

// Hooks
const toast = useToast();

// Variables
const searchQuery = ref("");
const hydrated = ref<boolean>(false);

// To prevent form submission if the page is not hydrated
onMounted(() => {
  hydrated.value = true;
});

const handleSearch = () => {
  // Check if the search query is empty
  if (!searchQuery.value) {
    toast.add({
      title: "Please enter a title",
      color: "warning",
    });
    return;
  }

  navigateTo(`/search-${searchQuery?.value}`);
};
</script>

<template>
  <div
    class="relative w-full overflow-hidden border-b border-border/40 py-20 md:py-28 px-4 flex flex-col items-center justify-center bg-linear-to-b from-indigo-50/30 via-background to-background dark:from-indigo-950/10 dark:via-background dark:to-background"
  >
    <!-- Background Particles -->
    <ClientOnly>
      <vue-particles
        id="tsparticles"
        class="absolute inset-0 z-0"
        :options="particlesOptions"
      />
    </ClientOnly>

    <!-- Content Layer -->
    <div
      class="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center gap-6"
    >
      <h1
        class="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-foreground"
      >
        Your Personal
        <span
          class="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-size-[200%_auto] animate-[gradient_3s_ease_infinite]"
        >
          Media Shelf
        </span>
      </h1>

      <p
        class="text-base sm:text-lg md:text-xl text-foreground/80 max-w-2xl font-light leading-relaxed"
      >
        Track your favorite movies, TV shows, and media collections. Discover
        trending releases and organize your watchlist effortlessly.
      </p>

      <!-- Search Bar Form -->
      <form
        @submit.prevent="handleSearch"
        class="w-full max-w-lg mt-4 flex flex-row gap-2 relative z-20"
      >
        <UInput
          :disabled="!hydrated"
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search movies, TV shows..."
          size="lg"
          class="flex-1"
        />
        <UButton
          :disabled="!hydrated"
          type="submit"
          size="lg"
          color="primary"
          class="font-semibold shadow-md rounded-xl hover:scale-[1.02] active:scale-95 transition-all duration-150 px-6"
        >
          Search
        </UButton>
      </form>
    </div>
  </div>
</template>
