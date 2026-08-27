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
      color="linear-gradient(to right, #6366f1, #a855f7, #ec4899)"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<!-- The basic app root -->
