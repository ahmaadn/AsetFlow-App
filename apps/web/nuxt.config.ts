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
    '@nuxt/image',
  ],
  fonts: {
    defaults: {
      weights: ['100 900'],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/v1',
      publicApiBase:
        process.env.NUXT_PUBLIC_API_PUBLIC_BASE || 'http://localhost:8003/v1',
    },
  },
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/dbaexr1vs/image/upload',
    },
  },
});
