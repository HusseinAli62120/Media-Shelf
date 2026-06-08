<script setup lang="ts">
import { Role } from "#shared/enums/Role";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

const routes: Ref<string[]> = ref(["Admin"]);

const colorMode = useColorMode();

// The Auth data
const { user, clear: clearSession } = useUserSession();
// console.log(user);

const toggleTheme = () => {
  colorMode.preference = colorMode.preference === "light" ? "dark" : "light";
};

const logout = async () => {
  await clearSession();
  await navigateTo("/login");
};
</script>

<template>
  <div class="flex-1 w-full flex flex-col items-center justify-center gap-3">
    <div class="w-full flex flex-col items-center justify-center gap-3">
      <!-- Gretting message -->
      <p>
        Hello <b>{{ user?.userName }}</b>
      </p>
      <p>
        Welcome to This template. It uses
        <span class="text-emerald-600 underline">
          <CustomLink :text="'Nuxt'" :url="'https://nuxt.com/'" />
        </span>
        with
        <span class="text-yellow-600 underline">
          <CustomLink
            :text="'Drizzle ORM'"
            :url="'https://orm.drizzle.team/'"
          />
        </span>
        and
        <span class="text-emerald-600 underline">
          <CustomLink :text="'Nuxt UI'" :url="'https://ui.nuxt.com/'" />
        </span>
      </p>

      <!-- Buttons -->
      <div class="flex flex-row items-center justify-center gap-3">
        <CustomLink
          v-for="route in routes"
          :text="route"
          :url="route"
          :key="route"
        />

        <ClientOnly>
          <UButton color="neutral" variant="solid" @click="toggleTheme">
            {{ colorMode?.value }}
          </UButton>

          <template #fallback>
            <button class="px-3 py-1 rounded">loading...</button>
          </template>
        </ClientOnly>

        <UButton
          class="text-white"
          color="error"
          variant="solid"
          @click="logout"
        >
          Logout
        </UButton>
      </div>
    </div>
  </div>
</template>
