/**
 * Composable untuk infinite scroll dengan combo box
 * Mendukung server-side pagination dan client-side filtering
 */

export interface UseInfiniteScrollOptions<T> {
  /**
   * Function untuk fetch data dari server
   * @param page - Page number (1-indexed)
   * @param pageSize - Items per page
   * @param query - Search query
   */
  fetchData: (page: number, pageSize: number, query: string) => Promise<T[]>;

  /**
   * Initial page size
   * @default 20
   */
  pageSize?: number;

  /**
   * Enable debounced search
   * @default true
   */
  debounceSearch?: boolean;

  /**
   * Debounce delay in ms
   * @default 300
   */
  debounceDelay?: number;
}

export function useInfiniteScroll<T>(options: UseInfiniteScrollOptions<T>) {
  const {
    fetchData,
    pageSize = 20,
    debounceSearch = true,
    debounceDelay = 300,
  } = options;

  const items = ref<T[]>([]);
  const loading = ref(false);
  const hasMore = ref(true);
  const currentPage = ref(1);
  const searchQuery = ref('');

  async function loadMore() {
    if (loading.value || !hasMore.value) return;

    loading.value = true;
    try {
      const newItems = await fetchData(
        currentPage.value,
        pageSize,
        searchQuery.value
      );

      if (newItems.length < pageSize) {
        hasMore.value = false;
      }

      if (currentPage.value === 1) {
        items.value = newItems as any;
      } else {
        items.value = [...(items.value as T[]), ...newItems] as any;
      }

      currentPage.value++;
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      loading.value = false;
    }
  }

  async function search(query: string) {
    searchQuery.value = query;
    currentPage.value = 1;
    hasMore.value = true;
    items.value = [];
    await loadMore();
  }

  const debouncedSearch = debounceSearch
    ? useDebounceFn(search, debounceDelay)
    : search;

  function reset() {
    items.value = [];
    currentPage.value = 1;
    hasMore.value = true;
    searchQuery.value = '';
  }

  return {
    items,
    loading,
    hasMore,
    loadMore,
    search: debouncedSearch,
    reset,
  };
}
