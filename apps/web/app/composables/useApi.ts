// composables/useApi.ts
import type { UseFetchOptions } from 'nuxt/app';

export interface ApiResponse<T> {
  data: T | null;
  error: unknown;
  loading: boolean;
  status: 'idle' | 'pending' | 'success' | 'error';
}

export interface UseApiOptions<T> extends Omit<UseFetchOptions<T>, 'baseURL'> {
  showToast?: boolean;
  toastMessage?: string;
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: unknown) => void | Promise<void>;
}

export function useApi() {
  const config = useRuntimeConfig();
  const baseURL = (config.public.apiBase || '/api') as string;

  // Helper untuk handle response
  const handleResponse = async <T>(
    response: ReturnType<typeof useFetch<T>>,
    options?: UseApiOptions<T>
  ): Promise<ApiResponse<T>> => {
    try {
      if (options?.onSuccess && response.data.value) {
        await options.onSuccess(response.data.value as unknown as T);
      }

      if (options?.showToast && options?.toastMessage) {
        // Anda bisa integrate dengan toast library di sini
        console.log('Success:', options.toastMessage);
      }

      return {
        data: response.data.value as unknown as T,
        error: response.error.value,
        loading: false,
        status: response.status.value,
      };
    } catch (error) {
      if (options?.onError) {
        await options.onError(error);
      }

      return {
        data: null,
        error,
        loading: false,
        status: 'error',
      };
    }
  };

  // GET request
  const get = async <T>(
    url: string,
    options?: UseApiOptions<T>
  ): Promise<ApiResponse<T>> => {
    const { showToast, toastMessage, onSuccess, onError, ...fetchOptions } =
      options || {};

    const promise = await useFetch(url, {
      baseURL,
      method: 'GET',
      ...fetchOptions,
    });

    return handleResponse<T>(
      promise as ReturnType<typeof useFetch<T>>,
      options
    );
  };

  // POST request
  const post = async <T, B extends object>(
    url: string,
    body?: B,
    options?: UseApiOptions<T>
  ): Promise<ApiResponse<T>> => {
    const { showToast, toastMessage, onSuccess, onError, ...fetchOptions } =
      options || {};

    const promise = await useFetch(url, {
      baseURL,
      method: 'POST',
      body,
      ...fetchOptions,
    });

    return await handleResponse<T>(
      promise as ReturnType<typeof useFetch<T>>,
      options
    );
  };

  // PUT request
  const put = async <T, B extends object>(
    url: string,
    body?: B,
    options?: UseApiOptions<T>
  ): Promise<ApiResponse<T>> => {
    const { showToast, toastMessage, onSuccess, onError, ...fetchOptions } =
      options || {};

    const promise = await useFetch(url, {
      baseURL,
      method: 'PUT',
      body,
      ...fetchOptions,
    });

    return handleResponse<T>(
      promise as ReturnType<typeof useFetch<T>>,
      options
    );
  };

  // PATCH request
  const patch = async <T, B extends object>(
    url: string,
    body?: B,
    options?: UseApiOptions<T>
  ): Promise<ApiResponse<T>> => {
    const { showToast, toastMessage, onSuccess, onError, ...fetchOptions } =
      options || {};

    const promise = await useFetch(url, {
      baseURL,
      method: 'PATCH',
      body,
      ...fetchOptions,
    });

    return handleResponse<T>(
      promise as ReturnType<typeof useFetch<T>>,
      options
    );
  };

  // DELETE request
  const del = async <T>(
    url: string,
    options?: UseApiOptions<T>
  ): Promise<ApiResponse<T>> => {
    const { showToast, toastMessage, onSuccess, onError, ...fetchOptions } =
      options || {};

    const promise = await useFetch(url, {
      baseURL,
      method: 'DELETE',
      ...fetchOptions,
    });

    return handleResponse<T>(
      promise as ReturnType<typeof useFetch<T>>,
      options
    );
  };

  return {
    get,
    post,
    put,
    patch,
    delete: del,
  };
}

export function useApiState<T extends object>(
  url: string,
  options?: UseApiOptions<T>
) {
  const data = ref<T | null>(null);
  const error = ref<unknown>(null);
  const loading = ref(false);
  const status = ref<'idle' | 'pending' | 'success' | 'error' | null>(null);

  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase || '/api';

  // Execute fetch
  const execute = async (customOptions?: UseApiOptions<T>) => {
    loading.value = true;
    error.value = null;

    try {
      const {
        data: fetchData,
        error: fetchError,
        status: fetchStatus,
      } = await useFetch(url, {
        baseURL,
        ...options,
        ...customOptions,
      });

      data.value = fetchData.value;
      error.value = fetchError.value;
      status.value = fetchStatus.value;

      const mergedOptions = { ...options, ...customOptions };

      if (mergedOptions?.onSuccess && fetchData.value) {
        mergedOptions.onSuccess(fetchData.value as unknown as T);
      }

      if (fetchError.value && mergedOptions?.onError) {
        mergedOptions.onError(fetchError.value);
      }
    } catch (err) {
      const mergedOptions = { ...options, ...customOptions };
      error.value = err;
      if (mergedOptions?.onError) {
        mergedOptions.onError(err);
      }
    } finally {
      loading.value = false;
    }
  };

  // Refresh data
  const refresh = () => execute();

  // Reset state
  const reset = () => {
    data.value = null;
    error.value = null;
    loading.value = false;
    status.value = null;
  };

  return {
    data,
    error,
    loading,
    status,
    execute,
    refresh,
    reset,
  };
}
