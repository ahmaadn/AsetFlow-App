import type { FolderItem, PaginationResult } from '@asetflow/shared-types';
import type { CreateFolderType, UpdateFolderType } from '@asetflow/validators';

export interface QueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

export function fetchFoldersApi(query: QueryParams, options = {}) {
  const { get } = useApi();
  return get<PaginationResult<FolderItem>>('/folders', {
    params: query,
    ...options,
  });
}

export function createFolderApi(data: CreateFolderType) {
  const { post } = useApi();
  return post<FolderItem, CreateFolderType>('/folders', {
    ...data,
  });
}

export function updateFolderApi(folderId: string, data: UpdateFolderType) {
  const { put } = useApi();
  return put<FolderItem, UpdateFolderType>(`/folders/${folderId}`, {
    ...data,
  });
}

export function deleteFolderApi(folderId: string) {
  const { delete: del } = useApi();
  return del<null>(`/folders/${folderId}`);
}
