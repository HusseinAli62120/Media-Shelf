<script setup lang="ts">
definePageMeta({
  layout: "screen",
});

const { fetch: refreshSession, loggedIn } = useUserSession();

if (!loggedIn.value) {
  await navigateTo("/login");
}
</script>

<template>
  <UError
    :redirect="'/'"
    :clear="{
      color: 'neutral',
      size: 'xl',
      icon: 'i-lucide-arrow-left',
      class: 'rounded-full cursor-pointer',
    }"
    :error="{
      statusMessage: 'Unauthorized',
      message: 'You are not authorized to view this page.',
      status: 401,
    }"
  />
</template>
