import type { DashboardStatistics } from '@asetflow/shared-types';

/**
 * Get all dashboard statistics in one call
 */
export async function getDashboardStatisticsApi() {
  const { get } = useApi();
  const response = await get<DashboardStatistics>('/statistics/dashboard');
  return response.data;
}
