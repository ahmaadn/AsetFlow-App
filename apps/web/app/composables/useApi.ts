// composables/useApi.ts
import type { FetchOptions } from 'ofetch';

export interface ApiResponse<T> {
  data: T | null;
  error: unknown;
  loading: boolean;
  status: 'idle' | 'pending' | 'success' | 'error';
}

export interface UseApiOptions<T> extends Omit<FetchOptions, 'baseURL'> {
  showToast?: boolean;
  toastMessage?: string;
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: unknown) => void | Promise<void>;
}

export function useApi() {
  const config = useRuntimeConfig();
  const baseURL = (config.public.apiBase || '/api') as string;

  const request = async <T>(
    url: string,
    options?: UseApiOptions<T>
  ): Promise<ApiResponse<T>> => {
    const {
      showToast,
      toastMessage,
      onSuccess,
      onError,
      method,
      body,
      ...fetchOptions
    } = options || {};
    try {
      const result = await (useNuxtApp().$api as typeof $fetch<T>)(url, {
        baseURL,
        method: method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        body,
        ...fetchOptions,
      });

      if (onSuccess) {
        await onSuccess(result as unknown as T);
      }

      if (showToast && toastMessage) {
        // Anda bisa integrate dengan toast library di sini
        console.log('Success:', toastMessage);
      }

      return {
        data: result as unknown as T,
        error: null,
        loading: false,
        status: 'success',
      };
    } catch (error) {
      if (onError) {
        await onError(error);
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
    options?: Omit<UseApiOptions<T>, 'method'>
  ): Promise<ApiResponse<T>> => {
    return request<T>(url, {
      method: 'GET',
      ...options,
    });
  };

  // POST request
  const post = async <T, B extends object>(
    url: string,
    body?: B,
    options?: Omit<UseApiOptions<T>, 'method' | 'body'>
  ): Promise<ApiResponse<T>> => {
    return request<T>(url, {
      method: 'POST',
      body,
      ...options,
    });
  };

  // PUT request
  const put = async <T, B extends object>(
    url: string,
    body?: B,
    options?: Omit<UseApiOptions<T>, 'method' | 'body'>
  ): Promise<ApiResponse<T>> => {
    return request<T>(url, {
      method: 'PUT',
      body,
      ...options,
    });
  };

  // PATCH request
  const patch = async <T, B extends object>(
    url: string,
    body?: B,
    options?: Omit<UseApiOptions<T>, 'method' | 'body'>
  ): Promise<ApiResponse<T>> => {
    return request<T>(url, {
      method: 'PATCH',
      body,
      ...options,
    });
  };

  // DELETE request
  const del = async <T>(
    url: string,
    options?: Omit<UseApiOptions<T>, 'method'>
  ): Promise<ApiResponse<T>> => {
    return request<T>(url, {
      method: 'DELETE',
      ...options,
    });
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
    status.value = 'pending';

    const {
      showToast,
      toastMessage,
      onSuccess,
      onError,
      method,
      ...fetchOptions
    } = { ...options, ...customOptions };

    try {
      const result = await (useNuxtApp().$api as typeof $fetch<T>)(url, {
        baseURL,
        method: method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        ...fetchOptions,
      });

      data.value = result;
      status.value = 'success';

      if (onSuccess) {
        await onSuccess(result as unknown as T);
      }
    } catch (err) {
      error.value = err;
      status.value = 'error';

      if (onError) {
        await onError(err);
      }
    } finally {
      loading.value = false;
    }
  };
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

    reset,
  };
}
