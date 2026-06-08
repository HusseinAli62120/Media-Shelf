<script setup lang="ts">
defineProps<{
  text: string;
  url: string;
}>();
</script>

<template>
  <NuxtLink
    target="_blank"
    :to="url"
    @click="
      () => {
        console.log(`This is ${text}`);
      }
    "
    class="hover:text-blue-400 hover:underline cursor-pointer"
  >
    {{ text }}
  </NuxtLink>
</template>
