<script setup lang="ts">
import { Role } from "#shared/enums/Role";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});
</script>

<template>
  <Navbar />
  <div class="flex-1 flex flex-col items-center justify-center">
    <h1>Shows</h1>
  </div>
</template>
