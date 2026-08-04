<script setup lang="ts">
const { movie } = defineProps<{ movie: MovieDetails }>();

const {
  isFavorite,
  toggleFavorite,
  handleMediaRating,
  rating,
  reviewText,
  getReleaseYear,
  hasPoster,
} = details({ movie: movie });

const { preference } = useColorMode();
</script>

<template>
  <div
    class="w-full flex-1 flex flex-col justify-between overflow-hidden space-y-6"
  >
    <!-- Header Details (Poster + Title + Metadata) -->
    <div class="flex gap-4 items-center">
      <!-- Poster -->
      <div
        class="w-20 h-28 shrink-0 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 shadow-md hover:scale-105 transition-all duration-300"
      >
        <img
          v-if="hasPoster"
          :src="movie.poster_path"
          :alt="movie.title"
          class="w-full h-full object-cover"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-neutral-950"
        >
          <UIcon name="i-lucide-film" class="h-8 w-8 text-neutral-600" />
        </div>
      </div>

      <!-- Title & Meta -->
      <div class="flex-1 min-w-0">
        <h2
          class="text-2xl font-bold tracking-tight text-foreground line-clamp-2"
        >
          {{ movie.title }}
        </h2>
        <p class="italic text-sm font-semibold text-neutral-400">
          {{ `"${movie?.tagline}"` }}
        </p>
        <div class="flex items-center gap-2 mt-2 text-xs">
          <Badge :content="`${getReleaseYear(movie.release_date)}`">
            <UIcon name="i-lucide-calendar" class="h-3.5 w-3.5" />
          </Badge>
          <Badge :content="`${movie.runtime}`">
            <UIcon name="i-lucide-clock" class="h-3.5 w-3.5" />
          </Badge>
        </div>
      </div>
    </div>

    <!-- Rating + Like -->
    <div
      class="flex items-center justify-between bg-accent/50 dark:bg-neutral-950/40 p-4 rounded-2xl border border-neutral-300/80 dark:border-neutral-800/60 shadow-xs"
    >
      <!-- Rating -->
      <div class="flex items-center gap-1">
        <NuxtRating
          :read-only="false"
          :clearable="true"
          border-color="#db8403"
          active-color="#ffa41c"
          :inactive-color="preference === 'light' ? '#cecece' : '#fff'"
          :border-width="0"
          :rating-step="0.5"
          :rating-value="rating"
          :rating-size="25"
          @rating-hovered="
            (event: number) => {
              handleMediaRating({ selectedRating: event });
            }
          "
        />
      </div>

      <!-- Like Toggle -->
      <UButton
        :variant="'ghost'"
        :size="'lg'"
        :color="isFavorite ? 'error' : 'neutral'"
        class="rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        @click="toggleFavorite"
      >
        <UIcon
          :name="isFavorite ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
          class="h-8 w-8"
        />
      </UButton>
    </div>

    <!-- Review Text Box -->
    <div
      class="space-y-2 h-full flex flex-col items-start justify-between rounded-2xl border border-neutral-300 bg-accent dark:border-neutral-800/80 dark:bg-neutral-950 p-2 transition-all"
    >
      <UTextarea
        :ui="{
          root: 'flex-1',
          base: 'resize-none! no-scrollbar h-full ',
        }"
        v-model="reviewText"
        :placeholder="`Share your thoughts on ${movie.title}... (What made it memorable? Your favorite scenes, acting, visuals?)`"
        :maxlength="1000"
        class="w-full text-sm text-neutral-200 bg-transparent border-0 p-2 placeholder:text-neutral-500"
        variant="none"
      />
      <div
        class="flex w-full justify-end p-2 text-xs text-neutral-500 font-semibold uppercase tracking-wider"
      >
        {{ reviewText.length }}/1000 Characters
      </div>
    </div>
  </div>
</template>
