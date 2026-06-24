<script setup lang="ts">
import { Role } from "#shared/enums/Role";

// Page meta data
definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

// Hooks
const route = useRoute();

const { data, error } = await useFetch("/api/tmdb/search", {
  method: "GET",
  query: {
    searchQuery: route.params.title,
  },
  server: true,
});
</script>

<template>
  <ClientOnly>
    <Navbar />
    <div
      :class="[
        'flex-1 flex flex-col',
        error || data?.searchData?.length === 0
          ? 'items-center justify-center'
          : 'items-start',
      ]"
    >
      <!-- Error message -->
      <FetchMessage v-if="error" :message="error.data?.message" type="error" />

      <FetchMessage
        v-else-if="data?.searchData?.length === 0"
        type="not-found"
      />

      <!-- Media grid -->
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 py-4 px-4"
        v-else
      >
        <Card v-for="item in data?.searchData" :item="item" :key="item.id" />
      </div>
    </div>

    <template #fallback>
      <h1>Loading...</h1>
    </template>
  </ClientOnly>
</template>
