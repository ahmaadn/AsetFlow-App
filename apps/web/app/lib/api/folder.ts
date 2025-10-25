import type { FolderItem, PaginationResult } from '@asetflow/shared-types';

export interface QueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

export function fetchFolders(query: QueryParams, options = {}) {
  const { get } = useApi();
  return get<PaginationResult<FolderItem>>('/folders', {
    params: query,
    ...options,
  });
}

export function createFolder(data: { name: string; slug?: string }) {
  const { post } = useApi();
  return post<FolderItem, { name: string; slug?: string }>('/folders', {
    ...data,
  });
}
