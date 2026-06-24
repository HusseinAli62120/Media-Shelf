<script setup lang="ts">
import type { ToasterProps } from "@nuxt/ui";
import { duration } from "drizzle-orm/gel-core";

const toaster = { position: "top-center", max: 3, duration: 2000 };
</script>

<template>
  <UApp :toaster="toaster as ToasterProps">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<!-- The basic app root -->
