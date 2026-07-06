<script setup lang="ts">
import { Role } from "#shared/enums/Role";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

const route = useRoute();

// Fetch movie details
const {
  data: movie,
  pending: movieLoading,
  error: movieError,
} = await useFetch("/api/tmdb/movieDetails", {
  query: {
    mediaId: route.params.id,
    mediaType: route.params.type,
  },
});

const {
  data: recommendations,
  pending: recommendationsLoading,
  error: recommendationsError,
} = await useFetch("/api/tmdb/recommendations", {
  query: {
    mediaId: route.params.id,
    mediaType: route.params.type,
  },
});

const {
  isSeen,
  isWatchlisted,
  toggleSeen,
  toggleWatchlist,
  getCountryName,
  getLanguageName,
  getReleaseYear,
  hasBackdrop,
  hasPoster,
  goBack,
} = details({ movie: movie?.value?.details! });
</script>

<template>
  <Navbar transparent />
  <div
    class="flex-1 w-full overflow-y-auto flex flex-col bg-background text-foreground min-h-0 relative"
  >
    <!-- Loading State -->
    <div
      v-if="movieLoading"
      class="flex-1 flex flex-col items-center justify-center py-20"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"
      ></div>
      <p class="text-muted-foreground text-sm font-medium">
        Loading movie details...
      </p>
    </div>

    <!-- Error State -->
    <DetailsError
      v-else-if="movieError || !movie?.details"
      :movie-error="movieError"
      :go-back="goBack"
    />

    <!-- Main Content -->
    <div v-else class="w-full grow flex flex-col">
      <!-- Hero Banner -->
      <div
        class="relative w-full h-[30vh] sm:h-[40vh] md:h-[50vh] min-h-[220px] bg-neutral-950 overflow-hidden"
      >
        <!-- Backdrop Image -->
        <img
          v-if="hasBackdrop"
          :src="movie.details.backdrop_path"
          :alt="movie.details.title"
          class="w-full h-full object-cover opacity-60 dark:opacity-40 transition-transform duration-1000 scale-102 hover:scale-105"
          loading="eager"
        />
        <div
          v-else
          class="w-full h-full bg-linear-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/10 opacity-70"
        />

        <!-- Linear Gradient Overlay Fading to Page Background -->
        <div
          class="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent"
        />

        <!-- Top Left Back Action on Hero -->
        <div class="absolute top-[12vh] left-4 z-20">
          <UButton
            variant="ghost"
            color="neutral"
            class="rounded-full text-foreground hover:bg-neutral-50/0 active:bg-neutral-50/0 hover:scale-105 cursor-pointer"
            @click="goBack"
          >
            <LucideArrowLeft class="h-6 w-6" />
          </UButton>
        </div>
      </div>

      <!-- Details Section with Overlapping Poster -->
      <div
        class="relative max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-28 md:-mt-36 z-10 pb-16 flex-1"
      >
        <div class="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          <!-- Left Column: Poster -->
          <div class="w-40 sm:w-56 md:w-64 lg:w-72 mx-auto md:mx-0 shrink-0">
            <div
              class="aspect-2/3 w-full rounded-2xl overflow-hidden shadow-2xl border border-border/40 bg-secondary-background transform transition-all duration-500 hover:scale-[1.02] group relative"
            >
              <img
                v-if="hasPoster"
                :src="movie.details.poster_path"
                :alt="movie.details.title"
                class="w-full h-full object-cover"
                loading="eager"
              />
              <div
                v-else
                class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-secondary-background"
              >
                <LucideFilm class="h-12 w-12 text-muted-foreground mb-2" />
                <span
                  class="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider"
                  >No Poster Available</span
                >
              </div>
            </div>
          </div>

          <!-- Right Column: Info Details -->
          <div
            class="grow text-center md:text-left flex flex-col self-stretch md:pt-16 lg:pt-20"
          >
            <!-- Movie Title & Tagline -->
            <div>
              <h1
                class="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight"
              >
                {{ movie.details.title }}
              </h1>
              <p
                v-if="movie.details.tagline"
                class="text-base sm:text-lg md:text-xl text-neutral-500 dark:text-neutral-400 italic font-medium mt-3"
              >
                "{{ movie.details.tagline }}"
              </p>
            </div>

            <!-- Genres/Categories -->
            <div
              v-if="movie.details.genres && movie.details.genres.length > 0"
              class="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4"
            >
              <CategoryBadge
                v-for="genre in movie.details.genres"
                :key="genre"
                :genre="genre"
              />
            </div>

            <!-- Metadata Row -->
            <div
              class="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-5 text-xs font-bold uppercase tracking-wider"
            >
              <!-- Rating Star Badge -->
              <div
                class="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-3 py-1.5 rounded-full border border-yellow-500/20 shadow-sm"
              >
                <LucideStar
                  class="h-3.5 w-3.5 fill-yellow-600 dark:fill-yellow-500 text-yellow-600 dark:text-yellow-500"
                />
                <span
                  >{{ Number(movie.details.averageRating || 0).toFixed(1) }} /
                  10</span
                >
              </div>

              <!-- Release Date Badge -->
              <Badge
                v-if="movie.details?.release_date"
                :content="getReleaseYear(movie.details.release_date)"
              >
                <LucideCalendar class="h-3.5 w-3.5" />
              </Badge>

              <!-- Runtime Badge -->
              <Badge
                v-if="movie.details.runtime"
                :content="movie.details.runtime"
              >
                <LucideClock class="h-3.5 w-3.5" />
              </Badge>

              <!-- Origin Country Badge -->
              <Badge
                v-if="movie.details.origin_country"
                :content="getCountryName(movie.details.origin_country)"
              >
                <LucideGlobe class="h-3.5 w-3.5" />
              </Badge>

              <!-- Original Language Badge -->
              <Badge
                v-if="movie.details.original_language"
                :content="getLanguageName(movie.details.original_language)"
              >
                <LucideText class="h-3.5 w-3.5" />
              </Badge>
            </div>

            <div v-if="movie?.details?.trailer" class="flex justify-start mt-4">
              <!-- Trailer Badge -->
              <NuxtLink
                :to="movie.details.trailer"
                target="_blank"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-sky-500/10! text-sky-600! dark:text-sky-400! border-sky-500/20! shadow-xs text-xs font-bold uppercase tracking-wider hover:opacity-85 transition-opacity cursor-pointer"
              >
                <LucidePlay
                  class="h-3.5 w-3.5 fill-sky-600 dark:fill-sky-400 text-sky-600 dark:text-sky-400"
                />
                <span>Watch Trailer</span>
              </NuxtLink>
            </div>

            <!-- Library/Watchlist Actions -->
            <div
              class="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-8"
            >
              <!-- Watchlist Toggle CTA -->
              <UButton
                :variant="isWatchlisted ? 'solid' : 'outline'"
                :color="isWatchlisted ? 'primary' : 'neutral'"
                class="rounded-xl px-5 py-2.5 font-bold shadow-sm transition-all duration-300 hover:scale-102 cursor-pointer flex items-center gap-2 text-sm"
                @click="toggleWatchlist"
              >
                <LucideStar
                  class="h-4.5 w-4.5"
                  :class="{ 'fill-current': isWatchlisted }"
                />
                <span>{{
                  isWatchlisted ? "On Watchlist" : "Add to Watchlist"
                }}</span>
              </UButton>

              <!-- Seen Toggle CTA -->
              <UButton
                :variant="isSeen ? 'solid' : 'outline'"
                :color="isSeen ? 'neutral' : 'neutral'"
                class="rounded-xl px-5 py-2.5 font-bold shadow-sm transition-all duration-300 hover:scale-102 cursor-pointer flex items-center gap-2 text-sm"
                :class="
                  isSeen
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:border-emerald-500'
                    : ''
                "
                @click="toggleSeen"
              >
                <LucideCheck class="h-4.5 w-4.5 font-extrabold" />
                <span>{{ isSeen ? "Marked as Seen" : "Mark as Seen" }}</span>
              </UButton>
            </div>

            <!-- Overview Section -->
            <div class="mt-10 text-left">
              <h3
                class="text-[11px] font-black tracking-widest text-neutral-400 dark:text-neutral-500 uppercase border-b border-border/30 pb-2 mb-3"
              >
                Overview
              </h3>
              <p
                class="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed tracking-wide max-w-3xl font-light"
              >
                {{
                  movie.details.overview ||
                  "No overview available for this movie."
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Similar Section -->
      <div class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Section
          :loading="recommendationsLoading"
          :data="recommendations?.recommendations || []"
          :error="recommendationsError"
          sectionTitle="More To Watch"
          sectionDescription="Discover other titles you might enjoy"
        />
      </div>
    </div>
  </div>
</template>
