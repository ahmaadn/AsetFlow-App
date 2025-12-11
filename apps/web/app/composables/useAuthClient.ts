import { createAuthClient } from 'better-auth/vue';

export const useAuthClient = () => {
  const cookieString = useRequestHeader('cookie');
  const config = useRuntimeConfig();

  const authClient = createAuthClient({
    baseURL: config.public.apiBase,
    basePath: '/v1/auth',
    fetchOptions: {
      credentials: 'include',
      headers: cookieString ? { cookie: cookieString } : undefined,
    },
  });

  return authClient;
};
