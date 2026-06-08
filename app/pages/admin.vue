<script setup lang="ts">
import { Role } from "#shared/enums/Role";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.ADMIN],
});
</script>

<template>
  <div class="flex-1 w-full flex items-center justify-center">
    <h4 class="text-gray-800">This is the admin page</h4>
  </div>
</template>
