<script setup lang="ts">
import { Role } from "#shared/enums/Role";
import { useInfiniteScroll } from "@vueuse/core";

// Page meta data
definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

// Pagination state
let page = ref(1);
let totalPages = ref(1);
let isFetchingMore = ref(false);
let searchData = ref<CardData[]>([]);

// Composables
const route = useRoute();
const toast = useToast();

// Fetch initial data
const { data, error } = await useFetch("/api/tmdb/search", {
  method: "GET",
  query: {
    searchQuery: route.params.title,
    page: 1,
  },
  server: true,
  onResponse({ response }) {
    if (response?._data?.searchData) {
      searchData.value = response._data.searchData;
      totalPages.value = response._data.totalPages ?? 1;
    }
  },

  onResponseError({ response }) {
    toast.add({
      title: "Error",
      description: response?._data?.message,
      color: "error",
    });
  },
});

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
        const res = await $fetch("/api/tmdb/search", {
          method: "GET",
          query: {
            searchQuery: route.params.title,
            page: page.value,
          },
        });
        if (res?.searchData?.length) {
          searchData.value.push(...res.searchData);
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
    :class="[
      'h-[90vh] flex flex-col',
      error || data?.searchData?.length === 0
        ? 'items-center justify-center'
        : 'items-start',
    ]"
  >
    <!-- Error message -->
    <FetchMessage v-if="error" :message="error.data?.message" type="error" />

    <FetchMessage v-else-if="data?.searchData?.length === 0" type="not-found" />

    <!-- Media grid -->
    <UScrollArea
      :items="searchData"
      v-slot="{ item }"
      ref="scrollArea"
      :ui="{
        root: 'no-scrollbar',
        viewport:
          'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 py-4 lg:px-8 px-4 ',
      }"
      v-else
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
      v-else-if="page >= totalPages && searchData.length > 0"
      class="flex items-center justify-center w-full py-6 text-sm text-muted-foreground"
    >
      You've reached the end
    </div>
  </div>
</template>
