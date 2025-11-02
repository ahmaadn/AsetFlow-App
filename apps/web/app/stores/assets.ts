import type { AsetResponse } from '@asetflow/shared-types';
import { lazyFetchAssetsApi, type AssetQueryParams } from '~/lib/api/asset';

interface AssetState {
  assets: Map<string, AsetResponse[]>; // Key: folderId
  pagination: Map<string, PaginationInfo>; // Key: folderId
  isLoading: Map<string, boolean>; // Key: folderId
  errors: Map<string, string | null>; // Key: folderId
}

interface PaginationInfo {
  total: number;
  page: number;
  per_page: number;
  hasMore: boolean;
}

export const useAssetStore = defineStore('asset', {
  state: (): AssetState => ({
    assets: new Map(),
    pagination: new Map(),
    isLoading: new Map(),
    errors: new Map(),
  }),

  getters: {
    getAssetsByFolder: (state) => (folderId: string) => {
      return state.assets.get(folderId) || [];
    },

    getPagination: (state) => (folderId: string) => {
      return (
        state.pagination.get(folderId) || {
          total: 0,
          page: 1,
          per_page: 20,
          hasMore: false,
        }
      );
    },

    isLoadingFolder: (state) => (folderId: string) => {
      return state.isLoading.get(folderId) || false;
    },

    getError: (state) => (folderId: string) => {
      return state.errors.get(folderId) || null;
    },
  },

  actions: {
    /**
     * Load assets untuk folder tertentu dengan lazy API
     * @param folderId ID folder
     * @param params Query parameters
     * @param append Apakah append ke existing data (untuk infinite scroll)
     */
    async loadAssets(
      folderId: string,
      params: AssetQueryParams = {},
      append = false
    ) {
      // Prevent duplicate loading
      if (this.isLoading.get(folderId)) return;

      this.isLoading.set(folderId, true);
      this.errors.set(folderId, null);

      try {
        // Import API function

        // Create lazy fetch instance
        const { data, error, fetch } = lazyFetchAssetsApi(folderId, params);

        // Execute fetch
        await fetch();

        if (error.value) {
          const errorMessage =
            error.value instanceof Error
              ? error.value.message
              : 'Failed to load assets';
          this.errors.set(folderId, errorMessage);
          console.error('Error fetching assets:', error.value);
          return;
        }

        if (data.value) {
          const currentAssets = this.assets.get(folderId) || [];

          // Append or replace assets
          this.assets.set(
            folderId,
            append ? [...currentAssets, ...data.value.items] : data.value.items
          );

          // Update pagination info
          this.pagination.set(folderId, {
            total: data.value.total,
            page: data.value.page,
            per_page: data.value.per_page,
            hasMore: data.value.items.length === data.value.per_page,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.errors.set(folderId, errorMessage);
        console.error('Failed to load assets:', error);
      } finally {
        this.isLoading.set(folderId, false);
      }
    },

    /**
     * Load more assets (infinite scroll)
     */
    async loadMoreAssets(folderId: string, params: AssetQueryParams = {}) {
      const pagination = this.pagination.get(folderId);
      if (!pagination || !pagination.hasMore) return;

      const nextPage = pagination.page + 1;
      await this.loadAssets(
        folderId,
        { ...params, page: nextPage },
        true // append
      );
    },

    /**
     * Refresh assets (clear dan load ulang)
     */
    async refreshAssets(folderId: string, params: AssetQueryParams = {}) {
      this.clearAssets(folderId);
      await this.loadAssets(folderId, params);
    },

    /**
     * Clear assets untuk folder tertentu
     */
    clearAssets(folderId: string) {
      this.assets.delete(folderId);
      this.pagination.delete(folderId);
      this.isLoading.delete(folderId);
      this.errors.delete(folderId);
    },

    /**
     * Clear all assets
     */
    clearAllAssets() {
      this.assets.clear();
      this.pagination.clear();
      this.isLoading.clear();
      this.errors.clear();
    },

    /**
     * Add new asset to store (after upload)
     */
    addAsset(folderId: string, asset: AsetResponse) {
      const currentAssets = this.assets.get(folderId) || [];
      this.assets.set(folderId, [asset, ...currentAssets]);

      const pagination = this.getPagination(folderId);
      this.pagination.set(folderId, {
        ...pagination,
        total: pagination.total + 1,
      });
    },

    /**
     * Remove asset from store
     */
    removeAsset(folderId: string, assetId: string) {
      const currentAssets = this.assets.get(folderId) || [];
      const filteredAssets = currentAssets.filter(
        (asset) => asset.id !== assetId
      );
      this.assets.set(folderId, filteredAssets);

      const pagination = this.getPagination(folderId);
      this.pagination.set(folderId, {
        ...pagination,
        total: Math.max(0, pagination.total - 1),
      });
    },
  },
});
