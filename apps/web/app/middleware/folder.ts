import type { FolderDetailResponse } from '@asetflow/shared-types';

export default defineNuxtRouteMiddleware(async (to) => {
  const { $api } = useNuxtApp();
  const folderId = to.params.folderId as string;
  console.log('Fetching folder detail for ID:', folderId);

  try {
    await $api<FolderDetailResponse>(`/v1/folders/${folderId}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Folder not found, redirecting to /drive', error);
    return await navigateTo('/drive');
  }
});
