<script setup lang="ts">
import { Role } from "#shared/enums/Role";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

const routes: Ref<string[]> = ref(["Admin"]);

// The Auth data
const { user } = useUserSession();
</script>

<template>
  <Navbar />
  <div class="flex-1 w-full flex flex-col">
    <div class="min-h-[250px] bg-green-300">Hello</div>
    <div
      class="w-full flex-1 bg-red-50 flex flex-col items-center justify-center gap-3"
    >
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
      </div>
    </div>
  </div>
</template>
