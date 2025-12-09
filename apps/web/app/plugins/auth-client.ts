/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAuthClient } from 'better-auth/vue';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Headers diperlukan di server untuk meneruskan cookie/auth dari browser ke API
  // Di client, browser otomatis mengirim cookie, tapi di server perlu manual
  const headers = useRequestHeaders();

  const client = createAuthClient({
    baseURL: config.public.apiBase,
    basePath: '/v1/auth',
    fetchOptions: {
      headers,
      credentials: 'include',
    },
  });

  return {
    provide: {
      client,
    },
  };
});
