// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@primevue/nuxt-module", "@pinia/nuxt"],
  css: ["~/assets/css/main.css", "primeicons/primeicons.css"],
  tailwindcss: {
    exposeConfig: true,
  },
  primevue: {
    autoImport: true,
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
});