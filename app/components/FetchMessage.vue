<script setup lang="ts">
// set a defualt value to the message
const props = defineProps<{
  message?: string;
  type: "not-found" | "error";
}>();

// Set a default message if none are provided
const message = computed(() => {
  if (props.type === "error") {
    return props.message || "Something went wrong. Please try again later.";
  }

  return props.message || "No results found.";
});
</script>

<template>
  <div
    :class="[
      'text-center py-12',
      type === 'error' ? 'text-error' : 'text-foreground',
    ]"
  >
    <LucideAlertCircle v-if="type === 'error'" class="w-10 h-10 mx-auto mb-2" />
    <LucideSearchSlash v-else class="w-10 h-10 mx-auto mb-2" />
    <p class="font-medium">{{ message }}</p>
  </div>
</template>
