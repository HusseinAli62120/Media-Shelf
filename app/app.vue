<script setup lang="ts"></script>

<template>
  <UApp
    :toaster="{
      duration: 2000,
      max: 3,
      position: 'top-center',
    }"
  >
    <NuxtLoadingIndicator
      color="linear-gradient(to right, #34d399, #22d3ee, #60a5fa)"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<!-- The basic app root -->
