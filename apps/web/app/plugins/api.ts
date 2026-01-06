import { ErrorCode } from '@asetflow/shared';
import type { AccessTokenResponse } from '@asetflow/shared-types';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: import.meta.server ? config.apiBaseServer : config.public.apiBase,
    credentials: 'include',
    retryStatusCodes: [401],
    retry: 1,
    retryDelay: 500,
    onRequest: ({ options, request }) => {
      const { accessToken } = useAuth();
      if (
        accessToken &&
        typeof request === 'string' &&
        !['refresh', 'auth'].some((item) => request.includes(item))
      ) {
        options.headers.set('Authorization', `Bearer ${accessToken.value}`);
      }
    },
    onResponseError: async ({ request, response, options }) => {
      if (
        response?._data &&
        typeof response._data.errorCode === 'string' &&
        response._data.errorCode === ErrorCode.TOKEN_EXPIRED &&
        typeof request === 'string' &&
        !request.includes('/refresh')
      ) {
        const { refreshToken, setRefreshToken, setAccessToken } = useAuth();
        try {
          if (!refreshToken.value) {
            setAccessToken(null);
            setRefreshToken(null);
            await navigateTo('/login');

            return;
          }

          // refresh token
          const response = await api<AccessTokenResponse>('/v1/auth/refresh', {
            method: 'POST',
            body: {
              refreshToken: refreshToken.value,
            },
          });
          setAccessToken(response.accessToken);

          // update header
          options.headers.set(
            'Authorization',
            `Bearer ${response.accessToken}`
          );
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error name:', error.name);
            console.error('Stack trace:', error.stack);
          } else {
            console.error('Unknown error:', error);
          }
          await navigateTo('/logout');
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
