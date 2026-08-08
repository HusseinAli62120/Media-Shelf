<script setup lang="ts">
// Props

const { media } = defineProps<{ media: MovieDetails | TvDetails }>();

// Composables
const {
  resetValues,
  rating,
  ratingRef,
  addDiaryEntry,
  loading,
  slideoverOpen,
} = useEngagement({
  media: media,
});
</script>

<template>
  <USlideover
    :ui="{ body: 'no-scrollbar flex flex-col items-center' }"
    title="Add Diary Entry"
    direction="right"
    class="hidden sm:block"
    @update:open="
      (value) => {
        if (value) {
          rating = 0;
        }
      }
    "
    v-model:open="slideoverOpen"
    @after:leave="
      () => {
        resetValues();
        rating = ratingRef;
      }
    "
  >
    <RainbowButton :speed="2">Review & Log</RainbowButton>

    <template class="overflow-hidden" #body>
      <DrawerBody :media="media" />
    </template>
    <!-- Footer -->
    <template #footer>
      <div class="w-full flex flex-col items-start space-y-5">
        <RainbowButton :disabled="loading" @click="addDiaryEntry" class="w-full"
          >{{ loading ? "Adding..." : "Add Entry" }}
        </RainbowButton>
      </div>
    </template>
  </USlideover>
</template>
