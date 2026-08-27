<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";

type DateRange =
  | {
      label: string;
      days: number;
      months?: undefined;
      years?: undefined;
    }
  | {
      label: string;
      months: number;
      days?: undefined;
      years?: undefined;
    }
  | {
      label: string;
      years: number;
      days?: undefined;
      months?: undefined;
    };

const { loading, ranges } = defineProps<{
  loading: boolean;
  ranges: DateRange[];
}>();
const isOpen = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{
  (emit: "apply", start: CalendarDate, end: CalendarDate): void;
  (emit: "cancel"): void;
}>();

// Date Range
const tz = getLocalTimeZone();
const breakpoints = useBreakpoints(breakpointsTailwind);
const isDesktop = breakpoints.greaterOrEqual("sm");

const initialEnd = today(tz);
const modelValue = shallowRef({
  start: initialEnd.subtract({ days: 14 }),
  end: initialEnd,
});

function computeStart(range: (typeof ranges)[number]) {
  const end = today(tz);
  return {
    start: end.subtract({
      days: range.days,
      months: range.months,
      years: range.years,
    }),
    end,
  };
}

function isRangeSelected(range: (typeof ranges)[number]) {
  if (!modelValue.value?.start || !modelValue.value?.end) return false;
  const { start, end } = computeStart(range);

  return (
    modelValue.value.start.compare(start) === 0 &&
    modelValue.value.end.compare(end) === 0
  );
}

function selectRange(range: (typeof ranges)[number]) {
  modelValue.value = computeStart(range);
}
</script>

<template>
  <UModal
    :ui="{
      header: 'hidden',
      content: 'w-auto sm:max-w-fit',
    }"
    v-model:open="isOpen"
  >
    <template #body>
      <div class="flex items-stretch divide-x divide-default">
        <div class="hidden sm:flex flex-col justify-center py-2">
          <UButton
            v-for="(range, index) in ranges"
            :key="index"
            :label="range.label"
            color="neutral"
            variant="ghost"
            class="rounded-none px-4"
            :class="[
              isRangeSelected(range) ? 'bg-elevated' : 'hover:bg-elevated/50',
            ]"
            truncate
            @click="selectRange(range)"
          />
        </div>

        <UCalendar
          :ui="{
            gridRow: ' gap-10',
            body: ' gap-4',
            grid: isDesktop ? 'ml-4' : 'ml-0',
          }"
          v-model="modelValue"
          class="p-5"
          :number-of-months="isDesktop ? 2 : 1"
          range
        />
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-end gap-2 w-full">
        <UButton
          class="cursor-pointer"
          color="neutral"
          variant="soft"
          @click="
            () => {
              isOpen = false;
            }
          "
        >
          <UIcon name="i-lucide-x" class="w-4 h-4" />
          Cancel
        </UButton>
        <UButton
          class="cursor-pointer"
          variant="soft"
          color="info"
          @click="
            async () => {
              if (modelValue?.start && modelValue?.end) {
                emit('apply', modelValue.start, modelValue.end);
              }
            }
          "
          :disabled="loading"
        >
          <UIcon
            :name="loading ? 'i-lucide-loader-2' : 'i-lucide-check'"
            :class="loading ? 'animate-spin' : ''"
            class="w-4 h-4"
          />
          {{ loading ? "Applying..." : "Apply" }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
