import type { AssetResponse } from '@asetflow/shared-types';
import type { UpdateAssetType } from '@asetflow/validators';
import {
  lazyFetchAssetsApi,
  lazyFetchAssetsByTypeApi,
  type AssetQueryParams,
  deleteAssetApi,
  updateAssetApi,
} from '~/lib/api/asset';

interface AssetState {
  assets: Map<string, AssetResponse[]>; // Key: folderId or 'type-{assetType}'
  pagination: Map<string, PaginationInfo>;
  isLoading: Map<string, boolean>;
  errors: Map<string, string | null>;
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
    clear() {
      this.assets.clear();
      this.pagination.clear();
      this.isLoading.clear();
      this.errors.clear();
    },

    /**
     * Add new asset to store (after upload)
     */
    addAsset(folderId: string, asset: AssetResponse) {
      const currentAssets = this.assets.get(folderId) || [];
      this.assets.set(folderId, [asset, ...currentAssets]);

      const pagination = this.getPagination(folderId);
      this.pagination.set(folderId, {
        ...pagination,
        total: pagination.total + 1,
      });
    },

    /**
     * Update asset in store
     */
    async updateAsset(
      folderId: string,
      assetId: string,
      data: UpdateAssetType
    ) {
      try {
        const res = await updateAssetApi(assetId, data);
        const updatedAsset = res.data as AssetResponse;

        const tempCurrentAssets = this.assets.get(folderId) || [];
        const updatedAssets = tempCurrentAssets.map((asset) =>
          asset.id === assetId ? updatedAsset : asset
        );

        this.assets.set(folderId, updatedAssets);
        return updatedAsset;
      } catch (error) {
        console.error('Failed to update asset:', error);
        throw error;
      }
    },

    /**
     * Delete asset from store and API
     */
    async deleteAsset(folderId: string, assetId: string) {
      try {
        await deleteAssetApi(assetId);
        this.removeAsset(folderId, assetId);
      } catch (error) {
        console.error('Failed to delete asset:', error);
        throw error;
      }
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

    /**
     * Load assets by type with lazy API
     * @param assetType Asset type (image, video, audio, document, or 'all')
     * @param params Query parameters
     * @param append Whether to append to existing data
     */
    async loadAssetsByType(
      assetType: string,
      params: AssetQueryParams = {},
      append = false
    ) {
      const key = `type-${assetType}`;

      if (this.isLoading.get(key)) return;

      this.isLoading.set(key, true);
      this.errors.set(key, null);

      try {
        const queryParams = {
          ...params,
          assetType: assetType === 'all' ? undefined : assetType,
        };

        const { data, error, fetch } = lazyFetchAssetsByTypeApi(queryParams);
        await fetch();

        if (error.value) {
          const errorMessage =
            error.value instanceof Error
              ? error.value.message
              : 'Failed to load assets';
          this.errors.set(key, errorMessage);
          console.error('Error fetching assets by type:', error.value);
          return;
        }

        if (data.value) {
          const currentAssets = this.assets.get(key) || [];

          this.assets.set(
            key,
            append ? [...currentAssets, ...data.value.items] : data.value.items
          );

          this.pagination.set(key, {
            total: data.value.total,
            page: data.value.page,
            per_page: data.value.per_page,
            hasMore: data.value.items.length === data.value.per_page,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.errors.set(key, errorMessage);
        console.error('Failed to load assets by type:', error);
      } finally {
        this.isLoading.set(key, false);
      }
    },

    /**
     * Load more assets by type
     */
    async loadMoreAssetsByType(
      assetType: string,
      params: AssetQueryParams = {}
    ) {
      const key = `type-${assetType}`;
      const pagination = this.pagination.get(key);
      if (!pagination || !pagination.hasMore) return;

      const nextPage = pagination.page + 1;
      await this.loadAssetsByType(
        assetType,
        { ...params, page: nextPage },
        true
      );
    },

    /**
     * Refresh assets by type
     */
    async refreshAssetsByType(
      assetType: string,
      params: AssetQueryParams = {}
    ) {
      const key = `type-${assetType}`;
      this.assets.delete(key);
      this.pagination.delete(key);
      await this.loadAssetsByType(assetType, params);
    },

    /**
     * Get assets by type key
     */
    getAssetsByType(assetType: string) {
      const key = `type-${assetType}`;
      return this.assets.get(key) || [];
    },

    /**
     * Get pagination by type key
     */
    getPaginationByType(assetType: string) {
      const key = `type-${assetType}`;
      return (
        this.pagination.get(key) || {
          total: 0,
          page: 1,
          per_page: 20,
          hasMore: false,
        }
      );
    },

    /**
     * Check if loading by type
     */
    isLoadingType(assetType: string) {
      const key = `type-${assetType}`;
      return this.isLoading.get(key) || false;
    },

    /**
     * Get error by type
     */
    getErrorByType(assetType: string) {
      const key = `type-${assetType}`;
      return this.errors.get(key) || null;
    },
  },
});
