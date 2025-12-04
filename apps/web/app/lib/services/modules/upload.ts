import type { AssetResponse } from '@asetflow/shared-types';
import { API_CONFIG } from '../config';

type OptionFetch = Omit<Parameters<typeof $fetch>[1], 'method'>;

export class UploadService {
  api: typeof $fetch;

  constructor() {
    this.api = useNuxtApp().$api;
  }

  /**
   * Upload a file to the specified URL
   * @param url The URL to upload the file to
   * @param data The form data containing the file
   * @param option Additional fetch options
   * @returns A promise resolving to the uploaded asset response
   */
  uploadFile(url: string, data: FormData, option: OptionFetch = {}) {
    return this.api<AssetResponse>(url, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(option.headers || {}),
      },
      ...option,
    });
  }
}
