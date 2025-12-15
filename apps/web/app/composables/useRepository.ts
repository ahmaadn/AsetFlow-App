import { StatisticsService } from '~/lib/services/modules/statistics';

// Overload for useFetch
export function useRepository(fetch: typeof useFetch): {
  statistics: StatisticsService<typeof useFetch>;
};

// Overload for $fetch
export function useRepository(fetch: typeof $fetch): {
  statistics: StatisticsService<typeof $fetch>;
};

// Implementation
export function useRepository(fetch: typeof useFetch | typeof $fetch) {
  return {
    statistics: new StatisticsService(fetch),
  };
}
