<script lang="ts" setup>
defineProps<{
  content: string;
}>();
</script>

<template>
  <div
    class="flex items-center gap-1.5 bg-neutral-500/10 text-neutral-600 dark:text-neutral-300 px-3 py-1.5 rounded-full border border-border/40 shadow-sm"
  >
    <slot />
    <span>{{ content }}</span>
  </div>
</template>
