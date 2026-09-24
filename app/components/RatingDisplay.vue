<script setup lang="ts">
const { rating, diaryCard = false } = defineProps<{
  rating: string;
  diaryCard?: boolean;
}>();
</script>

<template>
  <div v-for="star in 5" :key="star">
    <div
      v-if="Number(rating) >= star - 0.5"
      class="relative w-3 h-3 xs:w-4 xs:h-4 shrink-0 flex items-center justify-center"
      :class="diaryCard && 'w-4 h-4 xs:w-5 xs:h-5'"
    >
      <UIcon
        name="i-heroicons-star"
        class="w-3 h-3 xs:w-4 xs:h-4 text-amber-400/25"
        :class="diaryCard && 'w-4 h-4 xs:w-5 xs:h-5'"
      />

      <!-- Full Solid Star -->
      <UIcon
        v-if="Number(rating) >= star"
        name="i-heroicons-star-solid"
        class="absolute inset-0 w-3 h-3 xs:w-4 xs:h-4 text-amber-400"
        :class="diaryCard && 'w-4 h-4 xs:w-5 xs:h-5'"
      />

      <!-- Half Solid Star Clipped -->
      <UIcon
        v-else
        name="i-heroicons-star-solid"
        class="absolute inset-0 w-3 h-3 xs:w-4 xs:h-4 text-amber-400 [clip-path:inset(0_55%_0_0)]"
        :class="diaryCard && 'w-4 h-4 xs:w-5 xs:h-5'"
      />
    </div>
  </div>
</template>
