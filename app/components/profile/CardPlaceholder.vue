<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    slotNumber?: number;
    label?: string;
  }>(),
  {
    slotNumber: undefined,
    label: "Add Favorite",
  },
);

const emit = defineEmits(["openTopFiveDrawer"]);
</script>

<template>
  <div
    @click="
      () => {
        emit('openTopFiveDrawer');
      }
    "
    class="group flex flex-col gap-2 relative bg-secondary-background/40 border-2 border-dashed border-border/60 hover:border-primary/60 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none max-w-55 w-full mx-auto h-full"
  >
    <!-- Top Poster Placeholder (matches aspect ratio 2/3 of Card.vue) -->
    <div
      class="aspect-2/3 w-full flex flex-col items-center justify-center relative bg-muted/20 group-hover:bg-muted/40 transition-colors"
    >
      <div
        class="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:scale-110 group-hover:border-primary/50 group-hover:text-primary transition-all duration-300 shadow-sm"
      >
        <UIcon
          name="i-lucide-plus"
          class="w-6 h-8 text-muted-foreground group-hover:text-primary transition-colors"
        />
      </div>
    </div>

    <!-- Bottom Info Area (matches layout height and padding of Card.vue) -->
    <div class="flex flex-row justify-between items-center">
      <div
        class="p-1 pb-2 xs:p-3 flex flex-col space-y-1 justify-between w-full"
      >
        <span
          class="font-bold line-clamp-1 text-xs xs:text-sm text-muted-foreground/70 group-hover:text-primary transition-colors"
        >
          {{ label }}
        </span>
      </div>
    </div>
  </div>
</template>
