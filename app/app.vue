<script setup lang="ts">
import type { ToasterProps } from "@nuxt/ui";

const toaster = { position: "top-center" };
</script>

<template>
  <UApp :toaster="toaster as ToasterProps">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<!-- The basic app root -->
