<script setup lang="ts">
import styles from "@/assets/css/login.module.css";
import illustration from "@/assets/images/home-cinema.svg";

definePageMeta({
  layout: "screen",
});
const { fetch: refreshSession, loggedIn } = useUserSession();

// Prevent users to navigate to the signup page if they're already logged in
if (loggedIn.value) {
  await navigateTo("/");
}

// Composables
const toast = useToast();

// Variables
const credentials = reactive({
  userName: "",
  password: "",
});

const showPassword = ref<boolean>(false);
const loading = ref<boolean>(false);

// Signup function
const signup = async () => {
  // Check the userName length
  if (credentials?.userName.length < 4) {
    toast.add({
      title: "Username too short",
      description: "Username must be at least 4 characters long",
      color: "warning",
    });
    return;
  }
  // Check the password length
  if (credentials?.password.length < 8) {
    toast.add({
      title: "Password too short",
      description: "Password must be at least 8 characters long",
      color: "warning",
    });
    return;
  }
  try {
    loading.value = true;
    await $fetch("/api/signup", {
      method: "POST",
      body: credentials,
    });

    // Refresh the session on client-side and redirect to the home page
    await refreshSession();
    toast.clear();
    await navigateTo("/");
  } catch (error: any) {
    toast.add({
      title: error.response._data.message,
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="w-full min-h-screen lg:grid lg:grid-cols-2 flex justify-center items-center lg:flex-none lg:items-stretch dark:bg-secondary-background"
  >
    <!-- Left Side -->
    <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div
        :class="[
          'flex flex-col items-center justify-center lg:w-full lg:max-w-[400px] sm:w-[450px] w-full space-y-4 p-8 sm:p-10 rounded-2xl border border-gray-700 shadow-sm lg:border-0 lg:shadow-none lg:p-0',
        ]"
      >
        <!-- Title and description -->
        <div
          class="w-full max-w-[300px] flex flex-col space-y-2 text-center lg:text-left"
        >
          <!-- Mobile Logo -->
          <div class="flex justify-center lg:hidden mb-4">
            <div
              class="h-12 w-12 bg-gray-950 dark:border dark:border-gray-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200 dark:shadow-gray-900"
            >
              <LucideFilm :size="24" />
            </div>
          </div>

          <!-- Header -->
          <h1 class="text-3xl font-bold tracking-tight">Create an account</h1>

          <!-- Subtitle -->
          <p class="text-muted text-sm">
            Enter your credentials to create an account
          </p>
        </div>

        <!-- Form -->
        <UForm
          class="w-full max-w-[300px] flex flex-col gap-3"
          @submit.prevent="signup"
        >
          <!-- Username -->
          <UFormField label="Username">
            <UInput
              class="w-full max-w-[300px]"
              color="neutral"
              v-model="credentials.userName"
              placeholder="Enter your username"
              @keypress.prevent.enter="signup"
            />
          </UFormField>

          <!-- Password -->
          <UFormField orientation="vertical" label="Password">
            <UInput
              class="w-full max-w-[300px]"
              color="neutral"
              v-model="credentials.password"
              placeholder="Password"
              :type="showPassword ? 'text' : 'password'"
              :ui="{ trailing: 'pe-1' }"
              @keypress.prevent.enter="signup"
            >
              <template #trailing>
                <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  :aria-pressed="showPassword"
                  aria-controls="password"
                  @click="showPassword = !showPassword"
                />
              </template>
            </UInput>
          </UFormField>

          <!-- Submit Button -->
          <UButton
            :disabled="loading"
            color="neutral"
            variant="solid"
            type="submit"
            class="w-full max-w-[300px] flex justify-center"
          >
            <LucideLoader2 v-if="loading" class="animate-spin" />
            <span v-else>Sign Up</span>
          </UButton>
        </UForm>

        <USeparator label="Or" class="w-full max-w-[300px]" />
        <div class="flex flex-row items-center max-w-[300px]">
          <p class="text-muted mr-1">Already have an account?</p>
          <NuxtLink class="hover:underline text-foreground" to="/login">
            Login here
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Right Side -->
    <div
      :class="[
        'hidden lg:flex relative flex-col items-center justify-center p-12 bg-[#0a0a0a] transition-colors duration-500 ease-in text-white overflow-hidden',
        styles.visualPanel,
      ]"
    >
      <div :class="[styles.bubble, styles.bubbleRed]" />
      <div :class="[styles.bubble, styles.bubbleBlue]" />

      <div
        class="absolute top-10 left-10 flex items-center text-lg font-medium z-10"
      >
        <LucideFilm class="mr-2 h-6 w-6" />
        MediaShelf
      </div>

      <div
        class="relative z-10 max-w-md flex flex-col items-center text-center"
      >
        <img
          :src="illustration"
          alt="Home Cinema Illustration"
          class="w-full max-w-sm -mt-10 mb-3 opacity-90 mix-blend-lighten"
        />

        <h2 class="text-3xl font-bold italic tracking-tight mb-3">
          Your Personal Media Library
        </h2>

        <div
          class="mt-4 flex flex-wrap justify-between items-center gap-4 text-left"
        >
          <p class="text-sm italic text-slate-300">
            Track watched movies & shows
          </p>

          <p class="text-sm italic text-slate-300">
            Build and manage your watchlist
          </p>

          <div class="w-full flex justify-center">
            <p class="text-sm italic text-slate-300">
              Organize favorites in one place
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
