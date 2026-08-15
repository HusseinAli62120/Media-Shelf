<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";

const {
  diaryEntries,
  fetchDiaryEntries,
  isFetchingMore,
  skip,
  limit,
  pageCount,
  deleteDiaryEntry,
} = useDiary({ autoFetch: true });
// To fetch the diary entries when the slideover button is visiable

// Infinite Scroll
const scrollArea = useTemplateRef("scrollArea");

// We need a callback to fetch the value, since the scrollAreaRef will be undefined on the first render (the slideover being closed initally)
useInfiniteScroll(
  () => scrollArea.value?.$el,
  async () => {
    if (isFetchingMore.value || skip.value >= pageCount.value * limit.value)
      return;
    await fetchDiaryEntries();
  },
  { distance: 200 },
);
</script>

<template>
  <USlideover
    :ui="{
      body: ' flex flex-col items-center',
      title: 'text-xl',
    }"
    title="Diary"
    direction="right"
    class="flex"
  >
    <!-- Sky 300-500-700 -->
    <CollectionTab
      title="Diary"
      iconName="i-lucide-notebook"
      iconColor="text-sky-500"
      :substring="'200 Entries (10 This year)'"
      :border-color-1="'oklch(82.8% 0.111 230.318)'"
      :border-color-2="'oklch(68.5% 0.169 237.323)'"
      :border-color-3="'oklch(50% 0.134 242.749)'"
    />

    <template #body>
      <UScrollArea
        :items="diaryEntries"
        v-slot="{ item, index }"
        ref="scrollArea"
        :ui="{
          root: 'no-scrollbar w-full h-full',
          viewport: 'w-full',
        }"
      >
        <DiaryCard
          :deleteEntry="deleteDiaryEntry"
          :last="index === diaryEntries?.length - 1"
          :item="item"
        />
      </UScrollArea>

      <!-- Loading more indicator -->
      <UProgress
        v-if="isFetchingMore"
        indeterminate
        size="xs"
        class="absolute top-0 inset-x-0 z-1"
        :ui="{ base: 'bg-default' }"
      />
    </template>
  </USlideover>
</template>
