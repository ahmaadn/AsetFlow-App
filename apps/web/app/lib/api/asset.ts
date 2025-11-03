import type { AssetListResponse } from '@asetflow/shared-types';

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
  return get(`/assets/${assetId}`);
}

export function deleteAssetApi(assetId: string) {
  const { delete: del } = useApi();
  return del(`/assets/${assetId}`);
}

export function updateAssetApi(
  assetId: string,
  data: { originalName?: string; slug?: string }
) {
  const { put } = useApi();
  return put(`/assets/${assetId}`, data);
}
