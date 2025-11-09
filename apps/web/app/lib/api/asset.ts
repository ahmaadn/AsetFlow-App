import type { AssetListResponse, AssetResponse } from '@asetflow/shared-types';
import type { UpdateAssetType } from '@asetflow/validators';

export interface AssetQueryParams {
  page?: number;
  per_page?: number;
  assetType?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

export function fetchAssetsApi(folderId: string, query: AssetQueryParams = {}) {
  const { get } = useApi();
  return get<AssetListResponse>(`/folders/${folderId}/assets`, {
    params: query,
  });
}

/**
 * Lazy fetch assets untuk infinite scroll
 */
export function lazyFetchAssetsApi(
  folderId: string,
  query: AssetQueryParams = {}
) {
  return useLazyApi<AssetListResponse>(`/folders/${folderId}/assets`, {
    method: 'GET',
    params: query,
  });
}

export function fetchAssetApi(assetId: string) {
  const { get } = useApi();
  return get<AssetResponse>(`/assets/${assetId}`);
}

export function deleteAssetApi(assetId: string) {
  const { delete: del } = useApi();
  return del(`/assets/${assetId}`);
}

export function updateAssetApi(assetId: string, data: UpdateAssetType) {
  const { put } = useApi();
  return put<AssetResponse, UpdateAssetType>(`/assets/${assetId}`, data);
}

/**
 * Fetch assets by type
 */
export function fetchAssetsByTypeApi(query: AssetQueryParams = {}) {
  const { get } = useApi();
  return get<AssetListResponse>('/assets', {
    params: query,
  });
}

/**
 * Lazy fetch assets by type untuk infinite scroll
 */
export function lazyFetchAssetsByTypeApi(query: AssetQueryParams = {}) {
  return useLazyApi<AssetListResponse>('/assets', {
    method: 'GET',
    params: query,
  });
}
