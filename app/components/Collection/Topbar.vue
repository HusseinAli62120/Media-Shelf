<script setup lang="ts">
import type { DropdownMenuItem, TabsItem } from "@nuxt/ui";

const emit = defineEmits<{ (emit: "openDiary"): void }>();

// Filter options
const filterOptions = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Date Added",
      onSelect: () => {
        console.log("Date Added");
      },
      icon: "i-lucide-calendar-check",
    },
    {
      label: "Release Date",
      onSelect: () => {
        console.log("Release Date");
      },
      icon: "i-lucide-calendar-1",
    },
    {
      label: "Date Range",
      onSelect: () => {
        console.log("open modal");
      },
      icon: "i-lucide-calendar-search",
    },
    {
      label: "Rating",
      onSelect: () => {
        console.log("Rating");
      },
      icon: "i-lucide-star",
    },
  ],
]);

// Composables
const route = useRoute();

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
      console.log("diary");
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

    <!-- Filters -->
    <UDropdownMenu arrow :items="filterOptions">
      <UButton
        @click="
          () => {
            console.log('Filter');
          }
        "
        variant="link"
      >
        <UIcon class="w-6 h-6" name="i-heroicons-funnel" />
      </UButton>
    </UDropdownMenu>
  </div>
</template>
