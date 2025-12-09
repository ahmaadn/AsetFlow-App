/* eslint-disable @typescript-eslint/no-unused-vars */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Get headers once at plugin initialization time
  const ssrHeaders = import.meta.server
    ? useRequestHeaders([
        'cookie',
        'authorization',
        'user-agent',
        'x-forwarded-for',
        'x-forwarded-proto',
        'x-real-ip',
      ])
    : {};

  const api = $fetch.create({
    baseURL: import.meta.server
      ? config.apiBaseServer || 'http://localhost:8000'
      : config.public.apiBase || 'http://localhost:8000',
    credentials: 'include',

    onRequest({ options }) {
      if (import.meta.server) {
        // Use pre-captured headers instead of calling useRequestHeaders
        options.headers = {
          ...options.headers,
          ...ssrHeaders,
        };
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
