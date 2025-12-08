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
        // Forward essential headers for SSR
        const headers = useRequestHeaders([
          'cookie',
          'authorization',
          'user-agent',
          'x-forwarded-for',
          'x-forwarded-proto',
          'x-real-ip',
        ]);

        options.headers = {
          ...options.headers,
          ...headers,
        };

        // Ensure proper content type
        if (!options.headers['content-type']) {
          options.headers['content-type'] = 'application/json';
        }
      }
    },

    onResponseError({ request, response }) {
      if (response.status === 401) {
        // Only redirect on client-side and avoid loops
        if (
          import.meta.client &&
          !window.location.pathname.startsWith('/login')
        ) {
          navigateTo('/login', { replace: true });
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
