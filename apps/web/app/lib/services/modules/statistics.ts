import type { DashboardStatistics } from '@asetflow/shared-types';
import { API_CONFIG } from '../config';

type OptionFetch = Omit<Parameters<typeof $fetch>[1], 'method'>;

export class StatisticsService {
  api: typeof $fetch;

  constructor() {
    this.api = useNuxtApp().$api;
  }

  /**
   * Get dashboard statistics
   * @param option Additional fetch options
   * @returns A promise resolving to the dashboard statistics
   */
  getDashboardStatistics(option: OptionFetch = {}) {
    return this.api<DashboardStatistics>(
      `${API_CONFIG.VERSION}/statistics/dashboard`,
      {
        method: 'GET',
        ...option,
      }
    );
  }
}
