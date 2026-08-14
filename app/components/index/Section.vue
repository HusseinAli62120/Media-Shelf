<script setup lang="ts">
defineProps<{
  loading: boolean;
  error: any;
  data: CardData[];
  sectionTitle: string;
  sectionDescription: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Section headline -->
    <div class="flex justify-between items-end border-b border-border/40 pb-4">
      <div>
        <h3 class="text-xl font-black tracking-tight">{{ sectionTitle }}</h3>
        <p class="text-muted-foreground text-sm mt-0.5">
          {{ sectionDescription }}
        </p>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div
      v-if="loading"
      class="flex flex-row overflow-x-auto gap-6 pt-2 pb-4 no-scrollbar"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="flex flex-col gap-3 animate-pulse w-37.5 sm:w-45 md:w-50 lg:w-56.75 flex-none"
      >
        <div class="aspect-2/3 w-full bg-muted rounded-xl" />
        <div class="h-4 w-3/4 bg-muted rounded" />
        <div class="h-3 w-1/2 bg-muted rounded" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12 text-red-500">
      <p class="font-medium">Failed to load media. Please try again later.</p>
    </div>

    <!-- No Data State -->
    <div
      v-else-if="data.length === 0"
      class="text-center py-12 text-muted-foreground"
    >
      <p class="font-medium">No media found.</p>
    </div>

    <!-- Media Grid -->
    <div
      v-else
      class="flex flex-row overflow-x-auto gap-6 pt-2 pb-4 no-scrollbar"
    >
      <!-- Card -->
      <Card
        v-for="(item, index) in data"
        :key="index"
        :item="item"
        class="w-37.5 sm:w-45 md:w-50 lg:w-56.75 flex-none"
      />
    </div>
  </div>
</template>
