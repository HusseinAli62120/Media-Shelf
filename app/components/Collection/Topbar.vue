<script setup lang="ts">
import type { DropdownMenuItem, TabsItem } from "@nuxt/ui";

const { count, isFetching } = defineProps<{
  count: number;
  isFetching: boolean;
}>();

const emit = defineEmits<{
  (emit: "openDiary"): void;
  (
    emit: "onFilterChange",
    filterType: "dateAdded" | "releaseDate" | "rating" | "dateRange",
    order?: "Asc" | "Desc",
  ): void;
}>();

// Composables
const route = useRoute();

let ratingFilter = {
  label: "Rating",
  icon: "i-lucide-star",
  children: [
    {
      label: "Desc",
      onSelect: () => {
        emit("onFilterChange", "rating", "Desc");
      },
      icon: "i-lucide-calendar-check",
    },
    {
      label: "Asc",
      onSelect: () => {
        emit("onFilterChange", "rating", "Asc");
      },
      icon: "i-lucide-calendar-check",
    },
  ],
};

// Filter options
let filterOptions = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Date Added",
      icon: "i-lucide-calendar-check",
      children: [
        {
          label: "Desc",
          onSelect: () => {
            emit("onFilterChange", "dateAdded", "Desc");
          },
          icon: "i-lucide-calendar-check",
        },
        {
          label: "Asc",
          onSelect: () => {
            emit("onFilterChange", "dateAdded", "Asc");
          },
          icon: "i-lucide-calendar-check",
        },
      ],
    },
    {
      label: "Release Date",
      icon: "i-lucide-calendar-1",
      children: [
        {
          label: "Desc",
          onSelect: () => {
            emit("onFilterChange", "releaseDate", "Desc");
          },
          icon: "i-lucide-calendar-check",
        },
        {
          label: "Asc",
          onSelect: () => {
            emit("onFilterChange", "releaseDate", "Asc");
          },
          icon: "i-lucide-calendar-check",
        },
      ],
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

// Add rating filter on mount if not watchlist
onMounted(() => {
  if (route.query.tab !== "watchlist") {
    filterOptions.value?.[0]?.push(ratingFilter);
  }
});

// Don't show rating filter on watchlist tab
watch(
  () => route.query.tab,
  (tab) => {
    if (
      tab === "watchlist" &&
      filterOptions.value?.[0]?.includes(ratingFilter)
    ) {
      filterOptions.value?.[0]?.pop();
    } else if (
      tab !== "watchlist" &&
      !filterOptions.value?.[0]?.includes(ratingFilter)
    ) {
      filterOptions.value?.[0]?.push(ratingFilter);
    }
  },
);
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
      :disabled="isFetching"
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

    <div class="flex md:flex-row flex-col-reverse gap-1 items-center">
      <p class="text-xs text-muted-foreground font-semibold">
        Total : {{ count }}
      </p>

      <!-- Filters -->
      <UDropdownMenu arrow :disabled="isFetching" :items="filterOptions">
        <UButton variant="link" class="p-0 md:px-2.5 md:py-1.5">
          <UIcon
            :class="isFetching && 'animate-spin'"
            class="w-6 h-6"
            :name="isFetching ? 'i-lucide-loader-2' : 'i-heroicons-funnel'"
          />
        </UButton>
      </UDropdownMenu>
    </div>
  </div>
</template>
