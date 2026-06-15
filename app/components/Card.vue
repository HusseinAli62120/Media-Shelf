<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const props = defineProps<{
  item: ApiData;
}>();

const cardItems = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Watchlist",
      icon: "i-lucide-star",
      onSelect: () => {
        console.log("Watchlist");
      },
    },
    {
      label: "Seen",
      icon: "i-lucide-check",
      onSelect: () => {
        console.log("Seen");
      },
    },
  ],
]);
</script>

<template>
  <div
    class="group flex flex-col gap-2 relative bg-secondary-background border border-border/40 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
  >
    <!-- Poster Image -->
    <div class="aspect-2/3 w-full overflow-hidden relative bg-muted">
      <img
        v-if="item.imgURL"
        :src="item.imgURL"
        :alt="item.name"
        class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <!-- Rating -->
      <div
        class="absolute top-2 right-2 bg-background/80 backdrop-blur-md px-2 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1 shadow-sm border border-border/20"
      >
        <LucideStar class="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
        <span>{{ item.averageRating?.toFixed(1) }}</span>
      </div>
      <!-- Media type -->
      <div
        class="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider shadow-sm border border-border/20"
        :class="
          item.media_type === 'movie'
            ? 'bg-indigo-600/80 text-white'
            : 'bg-pink-600/80 text-white'
        "
      >
        {{ item.media_type }}
      </div>
    </div>

    <!-- Card Info -->
    <div class="flex flex-row justify-between items-center pr-1">
      <div class="p-3 flex flex-col justify-between">
        <div>
          <h4
            class="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors"
          >
            {{ item.name }}
          </h4>
          <p class="text-[11px] text-muted-foreground mt-0.5">
            {{
              item.first_air_date
                ? new Date(item.first_air_date).getFullYear()
                : "N/A"
            }}
          </p>
        </div>
      </div>
      <UDropdownMenu :modal="false" :items="cardItems">
        <UButton
          class="rounded-full px-1"
          size="xs"
          variant="ghost"
          color="neutral"
        >
          <LucideMoreHorizontal />
        </UButton>
      </UDropdownMenu>
    </div>
  </div>
</template>
