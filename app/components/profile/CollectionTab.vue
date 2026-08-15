<script setup lang="ts">
interface Props {
  title: string;
  substring?: string;
  iconName: string;
  iconColor: string;
  to?: string;
  openDiary?: boolean;

  borderColor1?: string;
  borderColor2?: string;
  borderColor3?: string;

  borderWidth?: number;
  duration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  borderWidth: 1,
  duration: 10,
});

const {
  title,
  substring,
  iconName,
  iconColor,
  to,
  borderColor1,
  borderColor2,
  borderColor3,
  borderWidth,
  duration,
} = props;
</script>

<template>
  <NuxtLink
    :as="to ? 'a' : 'button'"
    :to="to && to"
    @click="
      () => {
        if (to) {
          return;
        }
      }
    "
    class="relative sm:min-h-16 min-h-12 bg-muted/20 hover:bg-muted/40 w-full sm:w-1/4 flex flex-row items-center gap-2 px-4 py-2 rounded-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
  >
    <GlowBorder
      :color="[borderColor1!, borderColor2!, borderColor3!]"
      :border-width="borderWidth"
      :duration="duration"
    />
    <UIcon class="h-8 w-8" :class="iconColor" :name="iconName" />
    <div class="flex flex-col items-start">
      <p class="text-lg md:text-xl lg:text-2xl font-semibold">{{ title }}</p>

      <p v-if="substring" class="text-xs text-muted-foreground hidden sm:block">
        {{ substring }}
      </p>
    </div>
    <div class="sm:hidden w-full flex justify-end">
      <p class="text-xs text-muted-foreground text-center">
        {{ substring }}
      </p>
    </div>
  </NuxtLink>
</template>
