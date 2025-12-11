/* eslint-disable @typescript-eslint/no-unused-vars */
export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();

  await useAuthStore().getSession();
  const cookieString = useRequestHeader('cookie');

  const api = $fetch.create({
    baseURL: import.meta.server ? config.apiBaseServer : config.public.apiBase,
    credentials: 'include',

    onRequest({ options }) {
      const headers = options.headers as Headers;

      if (cookieString) {
        headers.set('cookie', cookieString);
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
