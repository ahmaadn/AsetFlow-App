import type { DashboardStatistics } from '@asetflow/shared-types';
import type { UseFetchOptions } from 'nuxt/app';
import { API_CONFIG } from '../config';

// Define option types for different fetch functions
type FetchOptions<T> = T extends typeof useFetch
  ? UseFetchOptions<unknown>
  : T extends typeof $fetch
    ? Parameters<typeof $fetch>[1]
    : unknown;

// Define return types for different fetch functions
type FetchReturnType<T, R> = T extends typeof useFetch
  ? ReturnType<typeof useFetch<R>>
  : T extends typeof $fetch
    ? Promise<R>
    : unknown;

export class StatisticsService<T extends typeof useFetch | typeof $fetch> {
  fetch: T;

  constructor(fetcher: T) {
    this.fetch = fetcher;
  }

  /**
   * Get dashboard statistics
   * @param options Additional fetch options
   * @returns Dashboard statistics based on fetch type
   */
  getDashboardStatistics(
    options: FetchOptions<T> = {} as FetchOptions<T>
  ): FetchReturnType<T, DashboardStatistics> {
    const url = `${API_CONFIG.VERSION}/statistics/dashboard`;

    // Handle useFetch (reactive)
    if (typeof this.fetch === 'function' && this.fetch.name === 'useFetch') {
      return (this.fetch as any)(url, {
        method: 'GET',
        ...options,
      });
    }

    // Handle $fetch or other fetch functions (promise-based)
    return (this.fetch as any)(url, {
      method: 'GET',
      ...options,
    }) as FetchReturnType<T, DashboardStatistics>;
  }
}
