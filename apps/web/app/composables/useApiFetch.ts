import { ErrorCode } from '@asetflow/shared';
import type { UseFetchOptions } from 'nuxt/app';
// import type { FetchError } from 'ofetch';

export function useFetchAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api,
  });
}
export function useSecureFetchAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>
): ReturnType<typeof useFetch<T>> {
  const auth = useAuth();

  // Add authentication headers and error handling to options
  const secureOptions: UseFetchOptions<T> = {
    ...options,
    onResponseError: async ({ response, options: fetchOptions }) => {
      // Handle 401 token expired error
      if (
        response.status === 401 &&
        response._data?.errorCode === ErrorCode.TOKEN_EXPIRED
      ) {
        try {
          await auth.refresh();
          const $api = useNuxtApp().$api;
          // Retry the request with refreshed token
          return await $api(fetchOptions.url, {
            ...fetchOptions,
            headers: {
              ...fetchOptions.headers,
            },
          });
        } catch (error) {
          auth.clearTokens();
          throw error;
        }
      }

      // Call original error handler if provided
      if (options?.onResponseError) {
        return options.onResponseError({ response, options: fetchOptions });
      }
    },
  };

  return useFetchAPI(url, secureOptions);
}
