<script setup lang="ts">
// Props

const { movie } = defineProps<{ movie: MovieDetails }>();

// Composables
const { resetValues } = useEngagement({ movie: movie });
</script>

<template>
  <USlideover
    :ui="{ body: 'no-scrollbar flex flex-col items-center' }"
    title="Add Diary Entry"
    direction="right"
    class="hidden sm:block"
    @after:leave="resetValues"
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
