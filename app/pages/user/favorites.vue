<script setup lang="ts">
import { Role } from "#shared/enums/Role";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role?.USER, Role?.ADMIN],
});

const toast = useToast();
const { data, pending, error } = await useFetch("/api/favorites/favorites", {
  method: "GET",
  onResponseError({ response }) {
    toast.add({
      title: "Error",
      description: response?._data?.statusMessage,
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
  <div v-else class="flex flex-1 flex-col items-start justify-start w-full">
    <div class="border-b border-border/40 pb-4 px-4 lg:px-8 py-4 w-full">
      <h1 class="text-3xl font-black tracking-tight">My Favorites</h1>
    </div>
    <div
      v-if="data?.userFavorites?.length && data?.userFavorites?.length > 0"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 py-4 lg:px-8 px-4"
    >
      <Card
        v-for="(item, index) in data?.userFavorites"
        :item="item"
        :key="index"
      />
    </div>
    <div v-else class="flex flex-1 flex-col items-center justify-center w-full">
      <FetchMessage :message="'Favorites list is empty'" :type="'not-found'" />
    </div>
  </div>
</template>
