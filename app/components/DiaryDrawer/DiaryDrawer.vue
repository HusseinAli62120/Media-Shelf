<script setup lang="ts">
// Props

const { media } = defineProps<{ media: MovieDetails | TvDetails }>();

// Composables
const { resetValues, rating, ratingRef } = useEngagement({ media: media });
</script>

<template>
  <UDrawer
    :ui="{
      body: 'no-scrollbar flex flex-col justify-between items-center',
    }"
    title="Add Diary Entry"
    direction="bottom"
    class="sm:hidden"
    @update:open="
      // Clear the rating when opening for a new diary entry
      (value) => {
        if (value) {
          rating = 0;
        }
      }
    "
    @close="
      // Reset the text box, and the rating
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
  </UDrawer>
</template>
