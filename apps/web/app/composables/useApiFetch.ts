import { ErrorCode } from '@asetflow/shared';
import type { UseFetchOptions } from 'nuxt/app';

export function useFetchAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api,
  });
}
export function useAuthFetch<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>
) {
  const auth = useAuth();

  let isRefreshing = false;
  let refreshPromise: Promise<void> | null = null;

  const refreshAccessToken = async () => {
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        await auth.refresh();
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();
    return refreshPromise;
  };

  // Add authentication headers and error handling to options
  const secureOptions: UseFetchOptions<T> = {
    ...options,
    onResponseError: async ({ response, options: fetchOptions, ...rest }) => {
      if (
        response.status === 401 &&
        // @ts-expect-error sudah di pastikan errorCode ada
        response._data?.errorCode === ErrorCode.TOKEN_EXPIRED
      ) {
        try {
          await refreshAccessToken();
          return await useFetchAPI(url, options);
        } catch (error) {
          auth.clearTokens();
          throw error;
        }
      }

      // Call original error handler if provided
      if (options?.onResponseError) {
        // @ts-expect-error TODO: fix latter
        return options.onResponseError({
          response,
          options: fetchOptions,
          ...rest,
        });
      }
    },
  };

  return useFetchAPI(url, secureOptions);
}
