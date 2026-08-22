<script setup lang="ts">
import { onClickOutside, useWindowSize } from "@vueuse/core";

const { expandDirection } = defineProps<{
  expandDirection?: "left" | "right";
}>();

const emit = defineEmits(["show-title"]);

// Composables
const toast = useToast();
const { width } = useWindowSize();

const isExpanded = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const searchQuery = ref("");

function toggleSearch() {
  emit("show-title", false);
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    nextTick(() => searchInput.value?.focus());
  }
}

// Close the search bar
onClickOutside(containerRef, () => {
  if (!searchQuery.value) {
    isExpanded.value = false;
    searchQuery.value = "";
    setTimeout(() => emit("show-title", true), 200);
  }
});

// Handle Search
const handleSearch = () => {
  // Check if the search query is empty
  if (!searchQuery.value) {
    toast.add({
      title: "Warning",
      description: "Please enter a title to search.",
      color: "warning",
    });
    return;
  }

  navigateTo(`/search-${searchQuery?.value}`);
};
</script>

<template>
  <div
    ref="containerRef"
    class="relative flex justify-start items-center"
    :class="expandDirection === 'left' ? 'justify-end' : 'justify-start'"
  >
    <div
      class="flex items-center justify-center overflow-hidden rounded-md transition-all duration-300 ease-in-out"
      :class="[
        isExpanded
          ? 'xs:w-64 w-48 px-3 py-1 bg-default ring-2 ring-primary'
          : 'w-10 px-2.5 py-1.5',
        expandDirection === 'left' ? 'flex-row-reverse' : 'flex-row',
      ]"
    >
      <!-- Icon stays fixed in size and position -->

      <UButton
        @click="
          () => {
            if (isExpanded) {
              handleSearch();
            } else {
              toggleSearch();
            }
          }
        "
        variant="ghost"
        class="hover:bg-transparent cursor-pointer p-0"
      >
        <UIcon class="w-6 h-6" name="i-lucide-search" />
      </UButton>

      <!-- Input smoothly reveals using opacity + transition -->
      <input
        @keydown.enter="handleSearch"
        v-if="isExpanded"
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        :placeholder="width < 400 ? 'Search...' : 'Search movies, TV shows...'"
        tabindex="isExpanded ? 0 : -1"
        class="w-full bg-transparent text-sm outline-none transition-opacity duration-200 placeholder:text-gray-400"
        :class="[isExpanded ? 'opacity-100' : 'pointer-events-none opacity-0']"
      />
    </div>
  </div>
</template>
