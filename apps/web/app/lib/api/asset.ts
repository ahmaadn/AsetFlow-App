import type { AsetListResponse } from '@asetflow/shared-types';

export interface AssetQueryParams {
  page?: number;
  per_page?: number;
  assetType?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

export function fetchAssetsApi(folderId: string, query: AssetQueryParams = {}) {
  const { get } = useApi();
  return get<AsetListResponse>(`/folders/${folderId}/assets`, {
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
  return useLazyApi<AsetListResponse>(`/folders/${folderId}/assets`, {
    method: 'GET',
    params: query,
  });
}
