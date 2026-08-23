<script setup lang="ts">
const { item, topFiveItem } = defineProps<{
  item?: CardData;
  topFiveItem?: TopFive;
}>();
</script>

<template>
  <div v-for="star in 5" :key="star">
    <div
      v-if="
        Number(item?.rating) >= star - 0.5 ||
        Number(topFiveItem?.rating) >= star - 0.5
      "
      class="relative w-3 h-3 xs:w-4 xs:h-4 shrink-0 flex items-center justify-center"
    >
      <UIcon
        name="i-heroicons-star"
        class="w-3 h-3 xs:w-4 xs:h-4 text-amber-400/25"
      />

      <!-- Full Solid Star -->
      <UIcon
        v-if="
          Number(item?.rating) >= star || Number(topFiveItem?.rating) >= star
        "
        name="i-heroicons-star-solid"
        class="absolute inset-0 w-3 h-3 xs:w-4 xs:h-4 text-amber-400"
      />

      <!-- Half Solid Star Clipped -->
      <UIcon
        v-else
        name="i-heroicons-star-solid"
        class="absolute inset-0 w-3 h-3 xs:w-4 xs:h-4 text-amber-400 [clip-path:inset(0_55%_0_0)]"
      />
    </div>
  </div>
</template>
