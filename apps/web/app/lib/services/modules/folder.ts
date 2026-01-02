import type {
  CreateFolderInput,
  UpdateFolderInput,
} from '@asetflow/validators';
import type {
  FolderItemType,
  PaginationResponse,
} from '@asetflow/shared-types';
import { API_CONFIG } from '../config';

export interface QueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

type OptionFetch = Omit<Parameters<typeof $fetch>[1], 'method'>;

export class FolderService {
  api: typeof $fetch;

  constructor() {
    this.api = useNuxtApp().$api;
  }

  /**
   * Get a list of folders with optional query parameters for filtering and pagination
   * @param query Query parameters for filtering and pagination
   * @param option Additional fetch options
   * @returns A promise resolving to a paginated list of folders
   */
  getFolders(query: QueryParams, option: OptionFetch = {}) {
    return this.api<PaginationResponse<FolderItemType>>(
      `${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS.FOLDERS}`,
      {
        method: 'GET',
        params: query,
        ...option,
      }
    );
  }

  /**
   * Create a new folder
   * @param data The data for the new folder
   * @param option Additional fetch options
   * @returns A promise resolving to the created folder
   */
  createFolder(data: CreateFolderInput, option: OptionFetch = {}) {
    return this.api<FolderItemType>(
      `${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS.FOLDERS}`,
      {
        method: 'POST',
        body: data,
        ...option,
      }
    );
  }

  /**
   * Update an existing folder
   * @param folderId The ID of the folder to update
   * @param data The data to update the folder with
   * @param option Additional fetch options
   * @returns A promise resolving to the updated folder
   */
  updateFolder(
    folderId: string,
    data: UpdateFolderInput,
    option: OptionFetch = {}
  ) {
    return this.api<FolderItemType>(
      `${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS.FOLDERS}/${folderId}`,
      {
        method: 'PUT',
        body: data,
        ...option,
      }
    );
  }

  /**
   * Check if a folder exists by its ID
   * @param folderId The ID of the folder to check
   * @param option Additional fetch options
   * @returns A promise resolving to null if the folder exists
   */
  checkFolder(folderId: string, option: OptionFetch = {}) {
    return this.api<null>(
      `${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS.FOLDERS}/check/${folderId}`,
      {
        method: 'HEAD',
        ...option,
      }
    );
  }

  /**
   * Delete a folder by its ID
   * @param folderId The ID of the folder to delete
   * @param option Additional fetch options
   * @returns A promise resolving when the folder is deleted
   */
  deleteFolder(folderId: string, option: OptionFetch = {}) {
    return this.api<null>(
      `${API_CONFIG.VERSION}${API_CONFIG.ENDPOINTS.FOLDERS}/${folderId}`,
      {
        method: 'DELETE',
        ...option,
      }
    );
  }
}
