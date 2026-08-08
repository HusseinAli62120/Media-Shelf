<script setup lang="ts">
// Props

const { movie } = defineProps<{ movie: MovieDetails | TvDetails }>();

// Composables
const { resetValues, rating, ratingRef } = useEngagement({ movie: movie });
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
    @after:leave="
      () => {
        resetValues();
        rating = ratingRef;
      }
    "
  >
    <RainbowButton :speed="2">Review & Log</RainbowButton>

    <template class="overflow-hidden" #body>
      <DrawerBody :movie="movie" />
    </template>
    <!-- Footer -->
    <template #footer>
      <div class="w-full flex flex-col items-start space-y-5">
        <RainbowButton
          @click="
            () => {
              console.log('Submit');
            }
          "
          class="w-full"
          >Add Entry</RainbowButton
        >
      </div>
    </template>
  </USlideover>
</template>
