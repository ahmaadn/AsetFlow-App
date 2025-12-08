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

  nitro: {
    experimental: {
      wasm: true,
    },
  },

  ssr: true,
  fonts: {
    defaults: {
      weights: ['100 900'],
    },
  },
  runtimeConfig: {
    // Private server-side config
    apiBaseServer: process.env.NUXT_API_BASE_SERVER || 'http://localhost:8000',

    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/',
      publicApiBase:
        process.env.NUXT_PUBLIC_API_PUBLIC_BASE || 'http://localhost:8003/',
      authUrl:
        process.env.NUXT_PUBLIC_AUTH_URL ||
        process.env.NUXT_PUBLIC_API_BASE ||
        'http://localhost:8000',
      providerAuth: process.env.NUXT_PUBLIC_PROVIDER_AUTH || '',
    },
  },
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/dbaexr1vs/image/upload',
    },
  },
});
