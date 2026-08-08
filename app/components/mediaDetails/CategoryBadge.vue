<script lang="ts" setup>
defineProps<{
  genre: string;
}>();
</script>

<template>
  <span
    class="px-3.5 py-1 bg-linear-to-r from-purple-500/10 via-fuchsia-500/10 to-pink-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 dark:border-pink-500/25 hover:opacity-85 transition-all duration-300 ease-in-out rounded-full text-xs font-bold uppercase tracking-wider shadow-xs cursor-default"
  >
    {{ genre }}
  </span>
</template>
