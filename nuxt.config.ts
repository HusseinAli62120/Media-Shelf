import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  colorMode: {
    disableTransition: false,
  },

  runtimeConfig: {
    // Environment variables that are accessible on the client-side
    public: {
      appEnv: "",
      showMovieBaseUrl: "",
      showMovieBackdropUrl: "",
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
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "@tsparticles/plugin-background-mask",
        "@tsparticles/slim",
        "@tsparticles/vue3",
      ],
    },
  },

  modules: [
    "nuxt-auth-utils",
    "@nuxtjs/color-mode",
    "@nuxt/ui",
    "nuxt-lucide-icons",
    "@tsparticles/nuxt4",
  ],
});
