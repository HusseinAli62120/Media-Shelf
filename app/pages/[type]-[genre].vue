<script setup lang="ts">
import { Role } from "#shared/enums/Role";

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
</script>

<template>
  <Navbar />
  <div
    v-if="pending"
    class="flex flex-1 flex-col items-center justify-center w-full"
  >
    <p>Loading...</p>
  </div>
  <div
    v-else-if="error"
    class="flex flex-1 flex-col items-center justify-center w-full"
  >
    <FetchMessage :message="'Failed to fetch data'" :type="'error'" />
  </div>
  <div v-else class="flex flex-1 flex-col items-center justify-center w-full">
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 py-4 px-4"
    >
      <Card v-for="item in data?.genreMedia" :item="item" :key="item?.id" />
    </div>
  </div>
</template>
