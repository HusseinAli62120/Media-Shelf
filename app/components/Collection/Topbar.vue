<script setup lang="ts">
import type { DropdownMenuItem, TabsItem } from "@nuxt/ui";

const { count } = defineProps<{ count: number }>();

const emit = defineEmits<{
  (emit: "openDiary"): void;
  (
    emit: "onFilterChange",
    value: "dateAdded" | "releaseDate" | "rating" | "dateRange",
  ): void;
}>();

// Composables
const route = useRoute();

// Filter options
let filterOptions = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Date Added",
      onSelect: () => {
        emit("onFilterChange", "dateAdded");
      },
      icon: "i-lucide-calendar-check",
    },
    {
      label: "Release Date",
      onSelect: () => {
        emit("onFilterChange", "releaseDate");
      },
      icon: "i-lucide-calendar-1",
    },
    {
      label: "Date Range",
      onSelect: () => {
        emit("onFilterChange", "dateRange");
      },
      icon: "i-lucide-calendar-search",
    },
  ],
]);

let ratingFilter = {
  label: "Rating",
  onSelect: () => {
    emit("onFilterChange", "rating");
  },
  icon: "i-lucide-star",
};

// Don't show rating filter on watchlist tab
if (route.query.tab === "watchlist") {
  filterOptions.value?.[0]?.pop();
} else {
  filterOptions.value?.[0]?.push(ratingFilter);
}

// Tabs
const items: TabsItem[] = [
  {
    label: "Watched",
    icon: "i-heroicons-eye-solid",
    value: "watched",
  },
  {
    label: "Diary",
    icon: "i-lucide-notebook",
    value: "diary",
  },
  {
    label: "Favorites",
    icon: "i-heroicons-heart-solid",
    value: "favorites",
  },
  {
    label: "Watchlist",
    icon: "i-heroicons-bookmark-solid",
    value: "watchlist",
  },
];

// Tab value
const active = computed({
  // Get route name and set it to tab value
  get() {
    return (route.query.tab as string) || String(route?.name)?.split("-")[1];
  },
  // Do something on tab click
  set(tab) {
    if (tab === "diary") {
      emit("openDiary");
      return;
    }
    // navigateTo(`/user/${tab}`);
    navigateTo({ path: "/user/collection", query: { tab } });
  },
});
</script>

<template>
  <div
    class="border-b border-border/40 pb-4 px-4 lg:px-4 py-4 w-full flex flex-row items-center justify-between"
  >
    <!-- Tabs -->
    <UTabs
      v-model="active"
      :content="false"
      :items="items"
      :ui="{
        label: 'hidden min-[500px]:inline',
        // Background color
        list: 'dark:bg-muted bg-primary/90',
        indicator: 'hidden',
        trigger: [
          // Text and icon color when active & inactive
          'dark:data-[state=inactive]:text-muted-foreground dark:hover:data-[state=inactive]:not-disabled:text-foreground/80',
          'data-[state=inactive]:text-primary-foreground hover:data-[state=inactive]:not-disabled:text-primary-foreground/80',
          active === 'watched' && 'data-[state=active]:text-success',
          active === 'diary' && 'data-[state=active]:text-sky-500',
          active === 'favorites' && 'data-[state=active]:text-red-600',
          active === 'watchlist' && 'data-[state=active]:text-indigo-400',
        ],
      }"
    >
    </UTabs>

    <div class="flex flex-row gap-1 items-center">
      <p class="text-xs text-muted-foreground font-semibold hidden xs:block">
        Total : {{ count }}
      </p>
      <span class="xs:hidden text-xs text-muted-foreground font-semibold">
        {{ count }}
      </span>
      <!-- Filters -->
      <UDropdownMenu arrow :items="filterOptions">
        <UButton variant="link">
          <UIcon class="w-6 h-6" name="i-heroicons-funnel" />
        </UButton>
      </UDropdownMenu>
    </div>
  </div>
</template>
