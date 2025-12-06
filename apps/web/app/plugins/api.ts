/* eslint-disable @typescript-eslint/no-unused-vars */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: import.meta.server
      ? config.apiBaseServer || 'http://localhost:8000'
      : config.public.apiBase || 'http://localhost:8000',
    credentials: 'include',

    onRequest({ options }) {
      if (import.meta.server) {
        const headers = useRequestHeaders(['cookie']);
        options.headers = {
          ...options.headers,
          ...headers,
        };
      }
    },
    onResponseError({ request, response }) {
      if (response.status === 401) {
        // Redirect ke login jika unauthorized
        if (import.meta.client) {
          navigateTo('/login');
        }
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
