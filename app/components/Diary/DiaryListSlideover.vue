<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";

// Define a v-modal:open for the component
const isOpen = defineModel<boolean>("open", { default: false });

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
    v-model:open="isOpen"
  >
    <slot />

    <template #body>
      <UScrollArea
        v-if="diaryEntries?.length > 0"
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
      <div v-else class="flex items-center justify-center w-full h-full">
        <p class="text-muted-foreground">No Entries Yet</p>
      </div>

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
