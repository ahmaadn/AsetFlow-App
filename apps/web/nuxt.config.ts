// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ['~/assets/css/app.css'],
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],
  fonts: {
    defaults: {
      weights: ['100 900'],
    },
  },
});
