import type { DashboardStatistics } from '@asetflow/shared-types';
import type { UseFetchOptions } from 'nuxt/app';
import { API_CONFIG } from '../config';

type Fetcher = typeof useFetch | typeof $fetch;

type FetchOptions<T, R> = T extends typeof useFetch
  ? UseFetchOptions<R>
  : T extends typeof $fetch
    ? Omit<Parameters<typeof $fetch>[1], 'method'>
    : never;

type FetchReturnType<T, R> = T extends typeof useFetch
  ? ReturnType<typeof useFetch<R>>
  : T extends typeof $fetch
    ? Promise<R>
    : never;

export class StatisticsService<T extends Fetcher> {
  private fetcher: T;

  constructor(fetcher: T) {
    this.fetcher = fetcher;
  }

  /**
   * Get dashboard statistics
   * @param options Additional fetch options
   * @returns Dashboard statistics based on fetch type
   */
  getDashboardStatistics(
    options?: FetchOptions<T, DashboardStatistics>
  ): FetchReturnType<T, DashboardStatistics> {
    const url = `${API_CONFIG.VERSION}/statistics/dashboard`;

    return this.fetcher<DashboardStatistics>(url, {
      method: 'GET',
      ...options,
    });
  }
}
