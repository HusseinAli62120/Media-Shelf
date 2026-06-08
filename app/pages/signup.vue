<script setup lang="ts">
definePageMeta({
  layout: "screen",
});
const { fetch: refreshSession, loggedIn } = useUserSession();

// Prevent users to navigate to the signup page if they're already logged in
if (loggedIn.value) {
  await navigateTo("/");
}

const credentials = reactive({
  userName: "",
  password: "",
});

const loading = ref<boolean>(false);

// Signup function
const signup = async () => {
  // Check the userName length
  if (credentials?.userName.length < 4) {
    alert("Username must be at least 4 characters long");
    return;
  }
  // Check the password length
  if (credentials?.password.length < 8) {
    alert("Password must be at least 8 characters long");
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
    await navigateTo("/");
  } catch (error: any) {
    alert(error.response._data.message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 p-5 border border-zinc-500 rounded-md shadow-md"
  >
    <form
      class="flex flex-col items-center justify-center gap-4"
      @submit.prevent="signup"
    >
      <input
        v-model="credentials.userName"
        type="text"
        placeholder="Username"
      />
      <input
        v-model="credentials.password"
        type="password"
        placeholder="Password"
      />
      <button
        class="px-5 py-1 rounded bg-zinc-200 text-zinc-black hover:bg-zinc-200/70 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-900/70 transition-colors ease-in-out duration-200 cursor-pointer"
        type="submit"
      >
        {{ loading ? "Loading..." : "Signup" }}
      </button>
    </form>
    <p>
      Already have an account?
      <span> <CustomLink text="Login" url="/login" /> Here </span>
    </p>
  </div>
</template>
