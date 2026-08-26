<script setup lang="ts">
import { Role } from "#shared/enums/Role";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

const route = useRoute();

// Fetch tv details
const {
  data: tvDetails,
  pending: tvLoading,
  error: tvError,
} = await useFetch("/api/tmdb/tvDetails", {
  query: {
    mediaId: route.params.id,
    mediaType: "tv",
  },
});

const {
  data: recommendations,
  pending: recommendationsLoading,
  error: recommendationsError,
} = await useFetch("/api/tmdb/recommendations", {
  query: {
    mediaId: route.params.id,
    mediaType: "tv",
  },
});

// Composables
const { getLanguageName, getReleaseYear, hasBackdrop, hasPoster, goBack } =
  details({ media: tvDetails?.value?.details! });

const {
  isSeen,
  isWatchlisted,
  isFavorite,
  addToWatched,
  handleMediaRating,
  toggleWatchlist,
  rating,
  ratingRef,
  updateRating,
  loading,
  toggleFavorite,
} = useEngagement({ media: tvDetails?.value?.details!, autoFetch: true });

const { watchedIds } = useIdRef({ autoFetch: false });

// Fetch rating if it exists, if not, set it to 0
const {
  data: userRating,
  pending: ratingLoading,
  error: ratingError,
} = await useFetch("/api/watched/rating", {
  method: "GET",
  server: false,
  query: {
    mediaId: route.params.id,
  },
  onResponse({ response }) {
    // Set the stored rating to both dynamic and reference values
    rating.value = Number(response?._data?.rating) || 0;
    ratingRef.value = Number(response?._data?.rating) || 0;
  },
});

const colorMode = useColorMode();

let watchedPopoverOpen = ref<boolean>(false);

const handleCastClick = ({ memberId }: { memberId: number }) => {
  navigateTo(`/person-${memberId}`);
};
</script>

<template>
  <Navbar transparent />
  <div
    class="flex-1 w-full overflow-y-auto flex flex-col bg-background text-foreground min-h-0 relative"
  >
    <!-- Loading State -->
    <div
      v-if="tvLoading"
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
      v-else-if="tvError || !tvDetails?.details"
      :movie-error="tvError"
      :go-back="goBack"
    />

    <!-- Main Content -->
    <div v-else class="w-full grow flex flex-col">
      <!-- Hero Banner -->
      <div
        class="relative w-full h-[30vh] sm:h-[40vh] md:h-[50vh] min-h-55 bg-neutral-950 overflow-hidden"
      >
        <!-- Backdrop Image -->
        <img
          v-if="hasBackdrop"
          :src="tvDetails.details.backdrop_path"
          :alt="tvDetails.details.title"
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
            <UIcon name="i-lucide-arrow-left" class="h-6 w-6" />
          </UButton>
        </div>
      </div>

      <!-- Details Section with Overlapping Poster -->
      <div
        class="relative max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-28 md:-mt-36 z-10 pb-16 flex-1"
      >
        <div class="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
          <!-- Left Column: Poster -->
          <div
            class="w-40 sm:w-56 md:w-64 lg:w-72 mx-auto md:mx-0 shrink-0 relative"
          >
            <div
              class="aspect-2/3 w-full rounded-2xl overflow-hidden shadow-2xl border border-border/40 bg-secondary-background transform transition-all duration-500 hover:scale-[1.02] group relative"
            >
              <img
                v-if="hasPoster"
                :src="tvDetails.details.poster_path"
                :alt="tvDetails.details.title"
                class="w-full h-full object-cover"
                loading="eager"
              />
              <div
                v-else
                class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-secondary-background"
              >
                <UIcon
                  name="i-lucide-film"
                  class="h-12 w-12 text-muted-foreground mb-2"
                />
                <span
                  class="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider"
                  >No Poster Available</span
                >
              </div>
            </div>

            <!-- History Slideover -->
            <HistorySlideover
              v-if="watchedIds.includes(tvDetails.details.id)"
              :media-id="tvDetails.details.id"
              :title="tvDetails.details.title"
            >
              <UTooltip
                arrow
                :delay-duration="0"
                :text="'Watch History'"
                :ui="{ text: 'border-none' }"
                class="absolute bottom-1 right-0"
              >
                <UButton
                  :variant="'ghost'"
                  :size="'lg'"
                  color="info"
                  class="hover:bg-transparent rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <UIcon
                    name="i-lucide-gallery-horizontal-end"
                    class="h-4 w-4"
                  />
                </UButton>
              </UTooltip>
            </HistorySlideover>
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
                {{ tvDetails.details.title }}
              </h1>
              <p
                v-if="tvDetails.details.tagline"
                class="text-base sm:text-lg md:text-xl text-neutral-500 dark:text-neutral-400 italic font-medium mt-3"
              >
                "{{ tvDetails.details.tagline }}"
              </p>
            </div>

            <!-- Genres/Categories -->
            <div
              v-if="
                tvDetails.details.genres && tvDetails.details.genres.length > 0
              "
              class="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4"
            >
              <CategoryBadge
                v-for="genre in tvDetails.details.genres"
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
                <UIcon
                  name="i-lucide-star"
                  class="h-3.5 w-3.5 fill-yellow-600 dark:fill-yellow-500 text-yellow-600 dark:text-yellow-500"
                />
                <span
                  >{{
                    Number(tvDetails.details.averageRating || 0).toFixed(1)
                  }}
                  / 10</span
                >
              </div>

              <!-- Release Date Badge -->
              <Badge
                v-if="tvDetails.details?.release_date"
                :content="getReleaseYear(tvDetails.details.release_date)"
              >
                <UIcon name="i-lucide-calendar" class="h-3.5 w-3.5" />
              </Badge>

              <!-- Original Language Badge -->
              <Badge
                v-if="tvDetails.details.original_language"
                :content="getLanguageName(tvDetails.details.original_language)"
              >
                <UIcon name="i-lucide-text" class="h-3.5 w-3.5" />
              </Badge>

              <!-- Number of episodes -->
              <Badge
                v-if="tvDetails.details.number_of_episodes"
                :content="`${tvDetails.details.number_of_episodes} episodes`"
              >
                <UIcon name="i-lucide-tv" class="h-3.5 w-3.5" />
              </Badge>

              <!-- Number of seasons -->
              <Badge
                v-if="tvDetails.details.number_of_seasons"
                :content="`${tvDetails.details.number_of_seasons} seasons`"
              >
                <UIcon name="i-lucide-list-checks" class="h-3.5 w-3.5" />
              </Badge>

              <!-- Status -->
              <Badge
                v-if="tvDetails.details.status"
                :content="tvDetails.details.status"
              >
                <UIcon name="i-lucide-info" class="h-3.5 w-3.5" />
              </Badge>
            </div>

            <!-- Library Actions -->
            <div
              class="flex flex-col xs:flex-row items-center justify-center md:justify-start gap-1 mt-8"
            >
              <!-- Diary -->
              <DiarySlideover :media="tvDetails.details" />
              <DiaryDrawer :media="tvDetails.details" />

              <!-- Watchlist & Favorites & Watched -->
              <div
                class="flex flex-wrap items-center justify-center gap-1 xs:mt-0 mt-2"
              >
                <!-- Watchlist Toggle -->
                <UTooltip
                  arrow
                  :delay-duration="0"
                  :text="isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'"
                  :ui="{ text: 'border-none' }"
                >
                  <UButton
                    :disabled="loading"
                    :variant="'ghost'"
                    :size="'lg'"
                    :class="isWatchlisted ? 'text-indigo-400' : 'text-neutral '"
                    class="rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                    @click="toggleWatchlist"
                  >
                    <UIcon
                      :name="
                        isWatchlisted
                          ? 'i-heroicons-bookmark-solid'
                          : 'i-heroicons-bookmark'
                      "
                      class="h-6 w-6"
                    />
                  </UButton>
                </UTooltip>
                <!-- Favorite Toggle -->
                <UTooltip
                  arrow
                  :delay-duration="0"
                  :text="isFavorite ? 'Favorite' : 'Add to Favorites'"
                  :ui="{ text: 'border-none' }"
                >
                  <UButton
                    :disabled="loading"
                    :variant="'ghost'"
                    :size="'lg'"
                    :color="isFavorite ? 'error' : 'neutral'"
                    class="rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                    @click="toggleFavorite"
                    :class="{ 'fill-current': isFavorite }"
                  >
                    <UIcon
                      :name="
                        isFavorite
                          ? 'i-heroicons-heart-solid'
                          : 'i-heroicons-heart'
                      "
                      class="h-6 w-6"
                    />
                  </UButton>
                </UTooltip>

                <!-- Watched Toggle -->
                <UPopover
                  arrow
                  mode="hover"
                  :open-delay="0"
                  :close-delay="0"
                  v-model:open="watchedPopoverOpen"
                  @update:open="
                    // Set rating back to ref when closing the popover without updating
                    (value) => {
                      if (!value) {
                        rating = ratingRef;
                      }
                    }
                  "
                >
                  <UButton
                    variant="ghost"
                    size="lg"
                    :color="isSeen ? 'success' : 'neutral'"
                    class="rounded-full font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                    :class="{ 'fill-current': isSeen }"
                  >
                    <UIcon
                      :name="
                        isSeen ? 'i-heroicons-eye-solid' : 'i-heroicons-eye'
                      "
                      class="h-6 w-6"
                    />
                  </UButton>

                  <template #content>
                    <div class="flex flex-col items-center space-y-2 px-3 py-2">
                      <p
                        class="text-xs text-center border-b-border text-neutral-500 dark:text-neutral-400"
                      >
                        {{ isSeen ? "Watched" : "Mark as Watched" }}
                      </p>
                      <NuxtRating
                        :read-only="false"
                        :clearable="true"
                        border-color="#db8403"
                        active-color="#ffa41c"
                        :inactive-color="
                          colorMode.preference === 'light' ? '#cecece' : '#fff'
                        "
                        :border-width="0"
                        :rating-step="0.5"
                        :rating-value="rating"
                        :rating-size="20"
                        @rating-hovered="
                          (event: number) => {
                            handleMediaRating({ selectedRating: event });
                          }
                        "
                      />
                      <UButton
                        :disabled="loading"
                        @click="
                          () => {
                            if (isSeen) {
                              updateRating();
                            } else {
                              addToWatched();
                            }

                            watchedPopoverOpen = false;
                          }
                        "
                        variant="subtle"
                        color="neutral"
                        class="cursor-pointer"
                        size="sm"
                        >{{
                          isSeen && !loading
                            ? "Update Rating"
                            : "Mark as Watched"
                        }}
                        <!-- Spinner -->
                        <UIcon
                          v-if="loading"
                          class="animate-spin"
                          name="i-lucide-loader-circle"
                        />
                      </UButton>
                    </div>
                  </template>
                </UPopover>
              </div>
            </div>

            <!-- Overview Section -->
            <div class="mt-10 text-left">
              <h3
                class="text-[11px] font-black tracking-widest text-neutral-400 dark:text-neutral-500 uppercase border-b border-border/30 pb-2 mb-3"
              >
                Overview
              </h3>
              <p
                class="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed tracking-wide max-w-3xl font-normal dark:font-light"
              >
                {{
                  tvDetails.details.overview ||
                  "No overview available for this movie."
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Cast Section -->
      <div
        v-if="tvDetails.details?.cast && tvDetails.details.cast.length > 0"
        class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 mt-6"
      >
        <div
          class="flex justify-between items-end border-b border-border/40 pb-4 mb-6"
        >
          <div>
            <h3 class="text-2xl font-black tracking-tight">Cast</h3>
            <p class="text-muted-foreground text-sm mt-0.5">
              Top billed cast members
            </p>
          </div>
        </div>

        <div class="flex flex-row overflow-x-auto gap-6 pb-4 no-scrollbar">
          <div
            v-for="member in tvDetails.details.cast"
            :key="member.id"
            class="flex flex-col items-center text-center gap-2 flex-none w-25 sm:w-30 group hover:cursor-pointer"
            @click="handleCastClick({ memberId: member?.id! })"
          >
            <!-- Avatar Image -->
            <div
              class="w-18 h-18 sm:w-25 sm:h-25 rounded-full overflow-hidden border border-border/40 bg-secondary-background shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
            >
              <img
                v-if="
                  member.image &&
                  !member.image.endsWith('null') &&
                  !member.image.endsWith('undefined')
                "
                :src="member.image"
                :alt="member.name"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-muted text-muted-foreground"
              >
                <UIcon name="i-lucide-user" class="h-8 w-8" />
              </div>
            </div>

            <!-- Name -->
            <span
              class="text-sm font-semibold text-foreground line-clamp-2 px-1 group-hover:text-primary transition-colors duration-300"
            >
              {{ member.name }}
            </span>
            <span class="text-xs font-medium text-muted line-clamp-2 px-1">
              {{ member.character }}
            </span>
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
