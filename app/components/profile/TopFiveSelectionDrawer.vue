<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";

// Composables
const { favoriteIds } = useIdRef({ autoFetch: false });
const {
  openTopFiveDrawer,
  loading,
  isReplace,
  topFive,
  replaceTopFive,
  replacedId,
  addTopFive,
  slotNumber,
} = useTopFive();

// Watched variables
const { skip, limit, pageCount, collection, fetchCollection, isFetching } =
  useCollection({});

const {
  data: fetchedUserWatched,
  pending: userWatchedPending,
  error: userWatchedError,
} = await useFetch("/api/watched/watched", {
  method: "GET",
  query: {
    skip: skip.value,
    limit: limit.value,
  },
});

// Set the watched value (used for the top five drawer)
if (
  fetchedUserWatched?.value?.statusCode === 200 ||
  fetchedUserWatched?.value?.statusCode === 304
) {
  collection.value = fetchedUserWatched.value.userWatched || [];
  pageCount.value = fetchedUserWatched.value.pageCount || 0;
  skip.value += limit.value;
}

// Infinite scroll
const scrollArea = useTemplateRef("scrollArea");

// Fetch more on scroll
useInfiniteScroll(
  () => scrollArea?.value?.$el,
  async () => {
    if (isFetching.value || skip.value >= pageCount.value * limit.value) return;
    await fetchCollection({ tab: "watched" });
  },
  { distance: 200 },
);

const handleSelectTopFive = async ({ item }: { item: CardData }) => {
  if (loading.value) return;
  if (isReplace.value) {
    await replaceTopFive({
      id: replacedId.value!,
      mediaId: item.mediaId!,
    });
  } else {
    await addTopFive({
      mediaId: item.mediaId!,
      slotNumber: slotNumber.value!,
    });
  }
};
</script>

<template>
  <UDrawer
    v-model:open="openTopFiveDrawer"
    direction="bottom"
    @close="
      () => {
        openTopFiveDrawer = false;
      }
    "
    :ui="{
      container: 'no-scrollbar',
      handle: 'mb-3',
    }"
  >
    <template #title>
      <h6 class="text-xl" v-if="collection?.length > 0">Select Favorite</h6>
    </template>
    <template #body>
      <!-- Media grid -->
      <UScrollArea
        v-if="collection?.length && collection?.length > 0"
        :items="collection"
        v-slot="{ item }"
        ref="scrollArea"
        :ui="{
          root: 'no-scrollbar',
          viewport:
            'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 py-4 px-4 ',
        }"
      >
        <Card
          :item="item"
          is-collection
          :item-liked="favoriteIds.includes(item?.mediaId!)"
          select-top-five
          @select-top-five="handleSelectTopFive({ item: item })"
        />
      </UScrollArea>
      <div
        v-else
        class="w-full flex-1 flex flex-col items-center justify-center"
      >
        <p class="text-muted-foreground">You Have Not Watched Anything Yet!</p>
      </div>
    </template>
    <!-- Loading More -->
    <UProgress
      v-if="isFetching"
      indeterminate
      size="xs"
      class="absolute top-0 inset-x-0 z-1"
      :ui="{ base: 'bg-default' }"
    />
  </UDrawer>
</template>
