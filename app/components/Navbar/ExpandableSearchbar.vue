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
const searchInput = ref<{ inputRef: HTMLInputElement } | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const searchQuery = ref("");

function toggleSearch() {
  isExpanded.value = !isExpanded.value;
  emit("show-title", !isExpanded.value);
  if (isExpanded.value) {
    nextTick(() => {
      searchInput.value?.inputRef?.focus();
    });
  }
}

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      toggleSearch();
    },
  },
  escape: {
    usingInput: true,
    handler: () => {
      searchQuery.value = "";
      isExpanded.value = false;
      setTimeout(() => emit("show-title", true), 200);
    },
  },
});

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
        isExpanded ? 'xs:w-64 w-48 bg-default ring-2 ring-primary' : 'w-10',
        expandDirection === 'left' ? 'flex-row-reverse' : 'flex-row',
      ]"
    >
      <!-- Icon stays fixed in size and position -->

      <UButton
        @click="
          () => {
            toggleSearch();
          }
        "
        variant="ghost"
        class="hover:bg-transparent cursor-pointer p-0"
        :class="isExpanded && 'hidden'"
      >
        <UIcon class="w-6 h-6" name="i-lucide-search" />
      </UButton>

      <!-- Input smoothly reveals using opacity + transition -->
      <UInput
        autofocus
        :ui="{
          base: 'focus:bg-transparent ps-2.5',
          leading: 'ps-0',
        }"
        variant="ghost"
        @keydown.enter="handleSearch"
        v-if="isExpanded"
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        :placeholder="'Search...'"
        class="w-full bg-transparent text-sm outline-none transition-opacity duration-200 placeholder:text-gray-400 focus:ring-0 opacity-100"
      >
        <template #trailing>
          <UKbd
            :class="width < 400 && 'hidden'"
            variant="soft"
            value="Ctrl + K"
          />
        </template>
      </UInput>
    </div>
  </div>
</template>
