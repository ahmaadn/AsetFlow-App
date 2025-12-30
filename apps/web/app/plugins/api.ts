/* eslint-disable @typescript-eslint/no-unused-vars */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const { accessToken } = useAuth();

  const api = $fetch.create({
    baseURL: import.meta.server ? config.apiBaseServer : config.public.apiBase,
    credentials: 'include',
    onRequest({ options }) {
      // Attach access token if available
      if (accessToken.value) {
        options.headers.set('Authorization', `Bearer ${accessToken.value}`);
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
