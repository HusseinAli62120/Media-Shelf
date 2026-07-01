<script setup lang="ts">
import { Role } from "#shared/enums/Role";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

const route = useRoute();

const {
  data: movie,
  pending: movieLoading,
  error: movieError,
} = await useFetch("/api/tmdb/movieDetails", {
  query: {
    mediaId: route.params.id,
    mediaType: route.params.type,
  },
});
</script>

<template>
  <Navbar />
  <div class="flex-1 flex flex-col items-center justify-center">
    <h1>{{ movie?.details?.title }}</h1>
    <p>Runtime: {{ movie?.details?.runtime }}</p>
  </div>
</template>
