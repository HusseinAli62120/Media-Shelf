<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";

const { mediaId, title } = defineProps<{
  mediaId: number;
  title: string;
}>();

const {
  historyEntries,
  fetchMediaHistory,
  isFetchingMore,
  skip,
  limit,
  pageCount,
  count,
  deleteEntry,
} = useMediaHistory({ mediaId: mediaId });

// Initial fetch
const { data } = await useFetch("/api/mediaHistory/getHistory", {
  method: "GET",
  query: {
    skip: skip.value,
    limit: limit.value,
    mediaId: mediaId,
  },
});

if (
  (data?.value?.statusCode === 200 || data?.value?.statusCode === 304) &&
  data?.value?.entries?.length > 0
) {
  historyEntries.value = data?.value?.entries;
  pageCount.value = data?.value?.pageCount;
  count.value = data?.value?.count;
  skip.value += limit.value;
}

// Infinite Scroll
const scrollArea = useTemplateRef("scrollArea");

// We need a callback to fetch the value, since the scrollAreaRef will be undefined on the first render (the slideover being closed initally)
useInfiniteScroll(
  () => scrollArea.value?.$el,
  async () => {
    if (isFetchingMore.value || skip.value >= pageCount.value * limit.value)
      return;
    await fetchMediaHistory({ updateFetch: false });
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
    direction="right"
    class="flex"
  >
    <slot />

    <template #title>
      <p class="text-primary text-lg">Watch History</p>
      <p v-if="count >= 1" class="text-muted-foreground text-xs">
        You have watched
        <span class="text-primary font-semibold">{{ title }} {{ " " }}</span>
        {{ count }}
        {{ count > 1 ? " times" : " time" }}
      </p>
      <p v-else class="text-muted-foreground text-xs">
        You have not watched
        <span class="text-primary font-semibold">{{ title }}</span> yet
      </p>
    </template>

    <template #body>
      <UScrollArea
        v-if="historyEntries?.length > 0"
        :items="historyEntries"
        v-slot="{ item, index }"
        ref="scrollArea"
        :ui="{
          root: 'no-scrollbar w-full h-full',
          viewport: 'w-full',
        }"
      >
        <DiaryCard
          :deleteEntry="deleteEntry"
          :last="index === historyEntries?.length - 1"
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
