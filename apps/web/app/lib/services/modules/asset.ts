import type { UpdateAssetInput } from '@asetflow/validators';
import type { AssetListResponse, AssetResponse } from '@asetflow/shared-types';
import { API_CONFIG } from '../config';

export interface AssetQueryParams {
  page?: number;
  per_page?: number;
  assetType?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

type OptionFetch = Omit<Parameters<typeof $fetch>[1], 'method'>;

export class AssetService {
  api: typeof $fetch;

  constructor() {
    this.api = useNuxtApp().$api;
  }

  /**
   * Get assets by folder ID
   * @param folderId The ID of the folder
   * @param query Query parameters for filtering and pagination
   * @param option Additional fetch options
   * @returns A promise resolving to a list of assets
   */
  getAssetsByFolder(
    folderId: string,
    query: AssetQueryParams,
    option: OptionFetch = {}
  ) {
    return this.api<AssetListResponse>(
      `${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS.FOLDERS}/${folderId}/assets`,
      {
        method: 'GET',
        params: query,
        ...option,
      }
    );
  }

  /**
   * Get a single asset by its ID
   * @param assetId The ID of the asset
   * @param option Additional fetch options
   * @returns A promise resolving to the asset details
   */
  getAsset(assetId: string, option: OptionFetch = {}) {
    return this.api<AssetResponse>(
      `${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS.ASSETS}/${assetId}`,
      {
        method: 'GET',
        ...option,
      }
    );
  }

  /**
   * Delete an asset by its ID
   * @param assetId The ID of the asset
   * @param option Additional fetch options
   * @returns A promise resolving when the asset is deleted
   */
  deleteAsset(assetId: string, option: OptionFetch = {}) {
    return this.api(
      `${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS.ASSETS}/${assetId}`,
      {
        method: 'DELETE',
        ...option,
      }
    );
  }

  /**
   * Update an asset by its ID
   * @param assetId The ID of the asset
   * @param data The data to update the asset with
   * @param option Additional fetch options
   * @returns A promise resolving to the updated asset
   */
  updateAsset(
    assetId: string,
    data: UpdateAssetInput,
    option: OptionFetch = {}
  ) {
    return this.api<AssetResponse>(
      `${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS.ASSETS}/${assetId}`,
      {
        method: 'PUT',
        body: data,
        ...option,
      }
    );
  }

  /**
   * Get assets by type
   * @param query Query parameters for filtering and pagination
   * @param option Additional fetch options
   * @returns A promise resolving to a list of assets
   */
  getAssetsByType(query: AssetQueryParams, option: OptionFetch) {
    return this.api<AssetListResponse>(
      `${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS.ASSETS}`,
      {
        method: 'GET',
        params: query,
        ...option,
      }
    );
  }
}
