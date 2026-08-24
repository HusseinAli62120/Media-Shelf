<script setup lang="ts">
// Props
defineProps<{
  moviePending: boolean;
  movieError: any;
  movieGenres: any;
  showPending: boolean;
  showError: any;
  showGenres: any;
}>();

// Variables
const isSlideoverOpen = ref<boolean>(false);
const isMoviesOpen = ref<boolean>(true);
const isShowsOpen = ref<boolean>(false);
const collectionTabs = ref<string[]>(["watched", "watchlist", "favorites"]);

// Composables
const { user } = useUserSession();
const { toggleTheme, logout, logoutLoading } = useNavbar();
const colorMode = useColorMode();
</script>

<template>
  <USlideover
    v-model:open="isSlideoverOpen"
    side="left"
    :ui="{
      body: 'no-scrollbar',
      content: 'max-w-xs xs:max-w-sm w-full ',
    }"
  >
    <!-- Trigger -->
    <UIcon name="i-lucide-menu" class="h-6 w-6 sm:hidden" />

    <!-- Title -->
    <template #title>
      <NuxtLink
        to="/"
        @click="isSlideoverOpen = false"
        class="flex flex-row items-center gap-2"
      >
        <UIcon name="i-lucide-film" class="h-6 w-6 text-primary" />
        <h1 class="font-semibold text-lg">Media Shelf</h1>
      </NuxtLink>
    </template>

    <template #body>
      <div class="flex flex-col h-full justify-between p-4 space-y-6">
        <div class="space-y-5">
          <!-- User Summary / Collection Links -->
          <div
            v-if="user"
            class="p-3 bg-muted/40 rounded-xl space-y-3 border dark:border-border/50 border-border/60"
          >
            <!-- Profile -->
            <NuxtLink
              to="/user/profile"
              @click="isSlideoverOpen = false"
              class="flex items-center gap-2.5 hover:opacity-80 transition"
            >
              <div
                class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm"
              >
                <UAvatar
                  v-if="user?.profileImg"
                  :src="user?.profileImg"
                  :alt="user?.userName"
                  :text="user?.userName?.charAt(0).toUpperCase()"
                  class="shrink-0 w-8 h-8"
                />
                <UIcon v-else name="i-lucide-user" class="w-4 h-4" />
              </div>
              <div class="flex flex-col truncate">
                <span class="text-sm font-semibold truncate">
                  {{ user.userName }}
                </span>
                <span class="text-xs text-muted-foreground">
                  View Profile
                </span>
              </div>
            </NuxtLink>

            <!-- Collection tabs -->
            <div class="grid grid-cols-3 gap-1.5 pt-1">
              <NuxtLink
                v-for="tab in collectionTabs"
                :key="tab"
                :to="`/user/collection?tab=${tab}`"
                @click="isSlideoverOpen = false"
                class="flex flex-col items-center justify-center p-2 rounded-lg bg-background/60 hover:bg-background transition text-xs font-medium text-muted-foreground hover:text-foreground hover:scale-105 active:scale-95 border dark:border-border/50 border-border/60 text-center gap-1"
              >
                <UIcon
                  :name="
                    tab === 'watched'
                      ? 'i-heroicons-eye-solid'
                      : tab === 'watchlist'
                        ? 'i-heroicons-bookmark-solid'
                        : 'i-heroicons-heart-solid'
                  "
                  class="w-4 h-4"
                  :class="
                    tab === 'watchlist'
                      ? 'text-indigo-400'
                      : tab === 'favorites'
                        ? 'text-error'
                        : 'text-success'
                  "
                />
                <span>
                  {{ tab?.charAt(0).toUpperCase() + tab?.slice(1) }}
                </span>
              </NuxtLink>
            </div>
          </div>

          <!-- Movies Section -->
          <div class="space-y-2">
            <button
              type="button"
              @click="isMoviesOpen = !isMoviesOpen"
              class="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition text-sm font-semibold cursor-pointer dark:border-none border border-border/60"
            >
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-film" class="w-4 h-4 text-primary" />
                <span>Movies</span>
              </div>
              <UIcon
                name="i-lucide-chevron-down"
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': isMoviesOpen }"
              />
            </button>

            <div v-show="isMoviesOpen" class="pl-1 pr-1">
              <div
                v-if="movieError"
                class="py-2 text-center text-error text-xs"
              >
                Failed to load movie genres
              </div>
              <div
                v-else-if="moviePending"
                class="py-2 text-center text-xs text-muted-foreground"
              >
                Loading movie genres...
              </div>
              <div
                v-else
                class="grid grid-cols-2 gap-1.5 pt-1 max-h-52 no-scrollbar overflow-y-auto"
              >
                <NuxtLink
                  v-for="genre in movieGenres"
                  :key="genre.id"
                  :to="`/Movies-${genre.name}`"
                  @click="isSlideoverOpen = false"
                  class="px-2.5 py-1.5 text-xs rounded-md bg-muted/20 hover:bg-primary/15 hover:text-primary transition-colors text-muted-foreground font-medium text-center truncate border dark:border-border/30 border-border/60"
                >
                  {{ genre.name }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Shows Section -->
          <div class="space-y-2">
            <button
              type="button"
              @click="isShowsOpen = !isShowsOpen"
              class="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition text-sm font-semibold cursor-pointer dark:border-none border border-border/60"
            >
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-tv" class="w-4 h-4 text-primary" />
                <span>TV Shows</span>
              </div>
              <UIcon
                name="i-lucide-chevron-down"
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': isShowsOpen }"
              />
            </button>

            <div v-show="isShowsOpen" class="pl-1 pr-1">
              <div v-if="showError" class="py-2 text-center text-error text-xs">
                Failed to load show genres
              </div>
              <div
                v-else-if="showPending"
                class="py-2 text-center text-xs text-muted-foreground"
              >
                Loading show genres...
              </div>
              <div
                v-else
                class="grid grid-cols-2 gap-1.5 pt-1 max-h-52 no-scrollbar overflow-y-auto"
              >
                <NuxtLink
                  v-for="genre in showGenres"
                  :key="genre.id"
                  :to="`/Shows-${genre.name}`"
                  @click="isSlideoverOpen = false"
                  class="px-2.5 py-1.5 text-xs rounded-md bg-muted/20 hover:bg-primary/15 hover:text-primary transition-colors text-muted-foreground font-medium text-center truncate border dark:border-border/30 border-border/60"
                >
                  {{ genre.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <!-- Slideover Actions: Theme Switching & Logout -->
      <div class="w-full border-border/50 flex flex-col space-y-2">
        <!-- Theme switcher button -->
        <UButton
          variant="outline"
          color="neutral"
          class="justify-center cursor-pointer w-full"
          @click="toggleTheme"
        >
          <UIcon
            :name="
              colorMode.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'
            "
            class="w-4 h-4 text-muted-foreground"
          />
          <span class="text-xs text-muted-foreground capitalize">
            {{ colorMode.value }} Mode
          </span>
        </UButton>

        <!-- Logout button -->
        <UButton
          v-if="user"
          block
          color="error"
          variant="soft"
          class="justify-center cursor-pointer"
          :loading="logoutLoading"
          @click="
            async () => {
              await logout();
              isSlideoverOpen = false;
            }
          "
        >
          <UIcon
            :name="logoutLoading ? 'i-lucide-loader-2' : 'i-lucide-log-out'"
            class="w-4 h-4 text-error"
          />
          <span class="text-xs text-error">
            {{ logoutLoading ? "Logging out..." : "Logout" }}
          </span>
        </UButton>
      </div>
    </template>
  </USlideover>
</template>
