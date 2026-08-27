<script setup lang="ts">
const props = defineProps<{
  label: string;
  value: number; // 0–100
  size?: number; // px, default 120
  strokeWidth?: number; // default 8
  color?: string; // default teal
}>();

const size = computed(() => props.size ?? 120);
const strokeWidth = computed(() => props.strokeWidth ?? 10);
const color = computed(() => props.color ?? "#10d9a8");

const radius = computed(() => (size.value - strokeWidth.value) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);

// Base value computation (now max value is 5. ie a value of 5 is a full ring)
const dashOffset = computed(
  () => circumference.value - (props.value / 5) * circumference.value,
);

const center = computed(() => size.value / 2);
const fontSize = computed(() => Math.round(size.value * 0.175));
</script>

<template>
  <div class="flex flex-col items-center gap-2.5">
    <!-- Ring wrapper -->
    <div class="relative flex items-center justify-center">
      <svg
        :width="size"
        :height="size"
        :viewBox="`0 0 ${size} ${size}`"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Track -->
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="strokeWidth"
          class="fill-none stroke-neutral-200 dark:stroke-neutral-700/70"
        />
        <!-- Progress arc -->
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="strokeWidth"
          :stroke="color"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          stroke-linecap="round"
          :transform="`rotate(-90, ${center}, ${center})`"
        />
      </svg>

      <!-- Center value -->
      <div class="absolute inset-0 flex items-center justify-center">
        <span
          class="font-bold leading-none tracking-tight text-foreground"
          :style="{ fontSize: `${fontSize}px` }"
        >
          {{ value }}
        </span>
      </div>
    </div>

    <!-- Bottom label -->
    <p class="m-0 text-center text-sm font-normal text-muted-foreground">
      {{ label }}
    </p>
  </div>
</template>
