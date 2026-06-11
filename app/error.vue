<script setup lang="ts">
const { fetch: refreshSession, loggedIn } = useUserSession();

if (!loggedIn.value) {
  await navigateTo("/login");
}
</script>

<template>
  <NuxtLayout name="screen">
    <UError
      :redirect="'/'"
      :clear="{
        color: 'neutral',
        size: 'xl',
        icon: 'i-lucide-arrow-left',
        class: 'rounded-full cursor-pointer',
      }"
      :error="{
        statusMessage: 'Page not found',
        message: 'The page you are looking for does not exist.',
        status: 404,
      }"
    />
  </NuxtLayout>
</template>
