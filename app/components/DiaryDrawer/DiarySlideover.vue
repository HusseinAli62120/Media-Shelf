<script setup lang="ts">
// Props

const { media } = defineProps<{ media: MovieDetails | TvDetails }>();

// Composables
const { resetValues, rating, ratingRef } = useEngagement({ media: media });
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
  </USlideover>
</template>
