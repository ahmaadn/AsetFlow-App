/* eslint-disable @typescript-eslint/no-unused-vars */
export default defineNuxtPlugin((nuxtApp) => {
  // Panggil 'useAuthStore' dan berikan instance Pinia ($pinia) dari nuxtApp.
  const authStore = useAuth();

  const api = $fetch.create({
    baseURL: 'https://api.nuxt.com',
    onRequest({ request, options, error }) {
      if (authStore.tokenCookie.value) {
        // note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
        options.headers.set(
          'Authorization',
          `Bearer ${authStore.tokenCookie.value}`
        );
      }
    },
    async onResponseError({ response }) {
      console.log(
        `API error occurred: ${response.status} ${response.statusText}`
      );
    },
  });

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  };
});
