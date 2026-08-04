<script lang="ts" setup>
defineProps<{
  movieError: any;
  goBack: () => void;
}>();
</script>

<template>
  <div
    class="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto"
  >
    <div class="bg-red-500/10 text-red-500 p-4 rounded-full mb-4">
      <UIcon name="i-lucide-alert-circle" class="h-10 w-10 animate-bounce" />
    </div>
    <h2 class="text-2xl font-bold mb-2">Failed to Load Movie</h2>
    <p class="text-muted-foreground text-sm mb-6">
      {{
        movieError?.message ||
        "We encountered an error while fetching details for this movie. Please try again later."
      }}
    </p>
    <UButton
      color="neutral"
      variant="solid"
      @click="goBack"
      class="rounded-xl font-semibold hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
    >
      <UIcon name="i-lucide-arrow-left" class="h-4 w-4 mr-2" />
      Go Back
    </UButton>
  </div>
</template>
