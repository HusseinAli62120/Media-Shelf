<script setup lang="ts">
import { Role } from "#shared/enums/Role";
import { useInfiniteScroll } from "@vueuse/core";
import { onMounted } from "vue";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

// Composables
const route = useRoute();
const toast = useToast();

// Get the genre id from name
const genreId = getGenreId({
  type: route?.params?.type?.toString() as string,
  genre: route?.params?.genre?.toString() as string,
});

// Pagination state
let page = ref(1);
let totalPages = ref(1);
let isFetchingMore = ref(false);
let genreData = ref<CardData[]>([]);

// Initial fetch
const { data, pending, error } = await useFetch("/api/tmdb/discoverByGenre", {
  query: {
    type: route.params.type === "Movies" ? "movie" : "tv",
    genreId: genreId,
    page: 1,
  },
  onResponseError({ response }) {
    toast.add({
      title: "Error",
      description: response?._data?.message,
      color: "error",
    });
  },
});

if (data.value?.genreMedia) {
  genreData.value = data.value.genreMedia;
  totalPages.value = data.value.totalPages ?? 1;
}

// Infinite scroll
const scrollArea = useTemplateRef("scrollArea");

onMounted(() => {
  useInfiniteScroll(
    scrollArea?.value?.$el,
    async () => {
      if (isFetchingMore.value || page.value >= totalPages.value) return;

      isFetchingMore.value = true;
      page.value++;

      try {
        const res = await $fetch<{
          genreMedia: CardData[];
          totalPages: number;
        }>("/api/tmdb/discoverByGenre", {
          query: {
            type: route.params.type === "Movies" ? "movie" : "tv",
            genreId: genreId,
            page: page.value,
          },
        });
        if (res?.genreMedia?.length) {
          genreData.value.push(...res.genreMedia);
          totalPages.value = res.totalPages ?? totalPages.value;
        }
      } catch (err: any) {
        toast.add({
          title: "Error",
          description: err?.data?.message ?? "Failed to load more",
          color: "error",
        });
        page.value--;
      } finally {
        isFetchingMore.value = false;
      }
    },
    { distance: 200 },
  );
});
</script>

<template>
  <Navbar />
  <div
    v-if="pending"
    class="flex flex-1 flex-col items-center justify-center w-full"
  >
    <p>Loading...</p>
  </div>
  <!-- Error message -->
  <div
    v-else-if="error"
    class="flex flex-1 flex-col items-center justify-center w-full"
  >
    <FetchMessage :message="'Failed to fetch data'" :type="'error'" />
  </div>
  <!-- Content -->
  <div v-else class="flex h-[90vh] flex-col items-start justify-start w-full">
    <div class="border-b border-border/40 pb-4 px-4 lg:px-8 py-4 w-full">
      <h1 class="text-3xl font-black tracking-tight">
        {{ route.params.genre }}
      </h1>
    </div>
    <UScrollArea
      :items="genreData"
      v-slot="{ item }"
      ref="scrollArea"
      :ui="{
        root: 'no-scrollbar',
        viewport:
          'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 py-4 lg:px-8 px-4 ',
      }"
    >
      <Card :item="item" />
    </UScrollArea>

    <!-- Loading more indicator -->
    <UProgress
      v-if="isFetchingMore"
      indeterminate
      size="xs"
      class="absolute top-0 inset-x-0 z-1"
      :ui="{ base: 'bg-default' }"
    />

    <!-- End of results -->
    <div
      v-else-if="page >= totalPages && genreData.length > 0"
      class="flex items-center justify-center w-full py-6 text-sm text-muted-foreground"
    >
      You've reached the end
    </div>
  </div>
</template>
