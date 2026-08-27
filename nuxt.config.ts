import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  colorMode: {
    disableTransition: false,
  },

  app: {
    head: {
      title: "Media Shelf",
      link: [{ rel: "icon", type: "image/png", href: "/movie.png" }],
    },
  },

  runtimeConfig: {
    // Environment variables that are accessible on the client-side
    public: {
      appEnv: "",
      showMovieBaseUrl: "",
      showMovieBackdropUrl: "",
    },

    session: {
      maxAge: 60 * 60 * 24 * 7, // Cookie persists for one week.
    },
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  css: ["./app/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "@inspira-ui/plugins", // CJS
        "@internationalized/date",
        "@tsparticles/plugin-background-mask",
        "@tsparticles/slim",
        "@tsparticles/vue3",
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "@vueuse/core",
        "motion-v",
      ],
    },
  },

  modules: [
    "nuxt-auth-utils",
    "@nuxtjs/color-mode",
    "@nuxt/ui",
    "@tsparticles/nuxt4",
    "nuxt-rating",
    "nuxt-charts",
    "@vercel/analytics",
  ],

  icon: {
    collections: ["lucide", "heroicons", ""],
  },

  nitro: {
    storage: {
      uploads: {
        driver: "fs",
        base: "./public/uploads",
      },
    },
  },
});
