/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAuthClient } from 'better-auth/client';
import { appendResponseHeader } from 'h3';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Headers diperlukan di server untuk meneruskan cookie/auth dari browser ke API
  // Di client, browser otomatis mengirim cookie, tapi di server perlu manual
  const headers = useRequestHeaders();
  const event = useRequestEvent();

  const client = createAuthClient({
    baseURL: config.public.apiBase,
    basePath: '/v1/auth',
    fetchOptions: {
      headers,
      credentials: 'include',
      onResponse({ response }) {
        if (!response.headers.has('set-cookie') && import.meta.server) {
          const cookies = response.headers.getSetCookie();
          for (const cookie of cookies) {
            appendResponseHeader(event!, 'set-cookie', cookie);
          }
        }
      },
    },
  });

  return {
    provide: {
      client,
    },
  };
});
