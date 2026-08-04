<script setup lang="ts">
// Props

const { movie } = defineProps<{ movie: MovieDetails }>();

// Composables
const { resetValues } = details({ movie: movie });
</script>

<template>
  <UDrawer
    :ui="{
      body: 'no-scrollbar flex flex-col justify-between items-center',
    }"
    title="Add Diary Entry"
    direction="bottom"
    class="sm:hidden"
    @close="resetValues"
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
  </UDrawer>
</template>
