export default defineNuxtPlugin((nuxtApp) => {
  // Panggil 'useAuthStore' dan berikan instance Pinia ($pinia) dari nuxtApp.
  const authStore = useAuth();

  const api = $fetch.create({
    baseURL: nuxtApp.$config.public.apiBase,
    onRequest({ options }) {
      if (authStore.tokenCookie.value) {
        // note that this relies on ofetch >= 1.4.0 - you may need to refresh your lockfile
        options.headers.set(
          'Authorization',
          `Bearer ${authStore.tokenCookie.value}`
        );
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
