<script setup lang="ts">
import { Role } from "#shared/enums/Role";
import type { Transition } from "motion-v";

definePageMeta({
  layout: "screen",
  middleware: ["require-auth"],
  allowedRoles: [Role.USER, Role.ADMIN],
});

// Composables
const route = useRoute();

// Fetching
const { data, pending, error } = await useFetch("/api/tmdb/discoverByActor", {
  query: {
    actorId: route.params.id,
  },
  onResponseError({ response }) {
    console.log(response?._data?.statusMessage);
  },
});

const transition = computed<Transition>(() => ({
  type: "spring",
  stiffness: 160,
  damping: 25,
}));
</script>

<template>
  <Navbar />
  <div class="flex-1 w-full flex flex-col items-center justify-center">
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">
      <FetchMessage :message="error.statusMessage" type="error" />
    </div>
    <div v-else class="w-full px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-10">
      <!-- Actor Profile Header Section -->
      <div
        class="flex flex-col md:flex-row gap-8 md:gap-10 items-start bg-secondary-background border border-border/40 p-6 sm:p-8 rounded-3xl shadow-sm"
      >
        <!-- Actor Image -->
        <div class="w-36 sm:w-44 md:w-52 shrink-0 mx-auto md:mx-0">
          <div
            class="aspect-square w-full rounded-2xl overflow-hidden shadow-md border border-border/40 bg-muted transform transition-all duration-300 hover:scale-[1.02]"
          >
            <img
              v-if="data?.actorData?.image"
              :src="data.actorData.image"
              :alt="data.actorData.name"
              class="w-full h-full object-cover"
              loading="eager"
            />
            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center text-center p-4"
            >
              <UIcon
                name="i-lucide-user"
                class="h-12 w-12 text-muted-foreground"
              />
            </div>
          </div>
        </div>

        <!-- Actor Details -->
        <div class="grow flex flex-col gap-4">
          <div>
            <h1
              class="text-3xl sm:text-4xl font-black tracking-tight text-foreground"
            >
              {{ data?.actorData?.name }}
            </h1>

            <!-- Metadata Row -->
            <div
              class="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-muted-foreground"
            >
              <div
                v-if="data?.actorData?.birthday"
                class="flex items-center gap-1.5"
              >
                <UIcon name="i-lucide-calendar" class="h-4 w-4" />
                <span>Born: {{ data.actorData.birthday }}</span>
              </div>
              <div
                v-if="data?.actorData?.placeOfBirth"
                class="flex items-center gap-1.5"
              >
                <UIcon name="i-lucide-map-pin" class="h-4 w-4" />
                <span>From: {{ data.actorData.placeOfBirth }}</span>
              </div>
            </div>
          </div>

          <!-- Biography -->
          <div v-if="data?.actorData?.biography" class="flex flex-col gap-2">
            <h2
              class="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Biography
            </h2>
            <div class="h-24 overflow-y-auto pr-2 no-scrollbar">
              <p
                class="text-foreground/80 text-sm leading-relaxed whitespace-pre-line"
              >
                {{ data.actorData.biography }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Works / Filmography Section -->
      <div class="flex flex-col gap-4">
        <div class="border-b border-border/40 pb-4">
          <ScrewText
            :label="'Works'"
            :rotate-direction="'top'"
            :stagger-duration="0.03"
            :stagger-from="'first'"
            :transition="transition"
            class="text-xl xs:text-2xl font-bold tracking-tight inline"
            front-face-class="bg-background text-foreground"
            second-face-class="bg-background text-foreground"
          />
          <p class="text-muted-foreground text-sm mt-1">
            Explore movies and TV shows featuring {{ data?.actorData?.name }}
          </p>
        </div>

        <!-- Grid of Media -->
        <div class="card-grid">
          <Card
            v-for="(media, index) in data?.discovered"
            :key="index"
            :item="media"
          />
        </div>
      </div>
    </div>
    <!-- Background Particles -->
    <div class="relative">
      <ClientOnly>
        <vue-particles
          id="tsparticles"
          class="absolute inset-0 z-0"
          :options="particlesOptions"
        />
      </ClientOnly>
    </div>
  </div>
</template>
