// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/supabase",
  ],
  css: ["~/assets/css/main.css", "primeicons/primeicons.css"],
  tailwindcss: {
    exposeConfig: true,
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  primevue: {
    autoImport: true,
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
  supabase: {
    redirect: false,
  },
});
