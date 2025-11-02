import type { AssetResponse } from '@asetflow/shared-types';

export function uploadFileApi(url: string, data: FormData) {
  const { post } = useApi();
  return post<AssetResponse, FormData>(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
