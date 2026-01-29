import { MAX_CONCURRENT_UPLOADS, ErrorCode } from '@asetflow/shared';

export interface UploadItem {
  file: File;
  filename: string;
  slug?: string;
  apiEndpoint: string;
  url?: string;
}

export interface UploadQueueItem extends UploadItem {
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed' | 'cancelled';
  error?: string;
  abortController?: AbortController;
}

export const useUploadQueue = () => {
  const queue = useState<Array<UploadQueueItem>>('uploadQueue', () => []);
  const config = useRuntimeConfig();
  const BASE_URL = config.public.apiBase as string;
  const VERSION = '/v1';

  const isUploading = computed(() =>
    queue.value.some((item) => item.status === 'uploading')
  );

  const isCompleted = computed(
    () =>
      queue.value.length > 0 &&
      queue.value.every(
        (item) =>
          item.status === 'completed' ||
          item.status === 'failed' ||
          item.status === 'cancelled'
      )
  );

  const currentUpload = computed(() =>
    queue.value.find((item) => item.status === 'uploading')
  );

  const uploadStats = computed(() => {
    const uploading = queue.value.filter(
      (item) => item.status === 'uploading'
    ).length;
    const completed = queue.value.filter(
      (item) =>
        item.status === 'completed' ||
        item.status === 'failed' ||
        item.status === 'cancelled'
    ).length;
    const success = queue.value.filter(
      (item) => item.status === 'completed'
    ).length;
    const error = queue.value.filter((item) => item.status === 'failed').length;
    const cancelled = queue.value.filter(
      (item) => item.status === 'cancelled'
    ).length;

    return {
      completed,
      total: queue.value.length,
      uploading,
      remaining: queue.value.length - completed,
      success,
      error,
      cancelled,
    };
  });

  const addFiles = (data: UploadItem[]) => {
    const newItems = data.map((item) => ({
      id: crypto.randomUUID(),
      file: item.file,
      filename: item.filename,
      slug: item.slug,
      apiEndpoint: item.apiEndpoint,
      url: item.url || URL.createObjectURL(item.file),
      status: 'pending' as const,
      progress: 0,
    }));
    queue.value.push(...newItems);
  };

  const removeFile = (id: string) => {
    const item = queue.value.find((f) => f.id === id);
    if (item?.url) {
      URL.revokeObjectURL(item.url);
    }
    queue.value = queue.value.filter((f) => f.id !== id);
  };

  const cancelUpload = (id: string) => {
    const item = queue.value.find((f) => f.id === id);
    if (item) {
      if (item?.status === 'uploading' && item.abortController) {
        item.abortController.abort();
      }
      item.status = 'cancelled';
      item.error = 'Cancelled by user';
    }
  };

  const uploadFile = async (
    item: UploadQueueItem,
    retryCount = 0
  ): Promise<void> => {
    const MAX_RETRY = 1;

    const formData = new FormData();
    formData.append('file', item.file);
    formData.append('filename', item.filename);
    if (item.slug) {
      formData.append('slug', item.slug);
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      item.abortController = {
        abort: () => xhr.abort(),
      } as AbortController;

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          item.progress = Math.round((e.loaded / e.total) * 100);
        }
      });

      // Handle completion
      xhr.addEventListener('load', async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          item.status = 'completed';
          item.progress = 100;
          resolve(xhr.response);
        } else if (xhr.status === 401 && retryCount < MAX_RETRY) {
          // Parse response untuk cek errorCode
          let errorCode: string | undefined;
          try {
            const responseData = JSON.parse(xhr.responseText);
            errorCode = responseData?.errorCode;
          } catch {
            // Jika gagal parse, anggap bukan TOKEN_EXPIRED
          }

          const { refreshToken, setAccessToken, setRefreshToken } = useAuth();

          // Token expired, coba refresh
          if (errorCode === ErrorCode.TOKEN_EXPIRED) {
            try {
              if (!refreshToken.value) {
                setAccessToken(null);
                setRefreshToken(null);
                await navigateTo('/login');
                item.status = 'failed';
                item.error = 'Session expired';
                reject(new Error('Session expired'));
                return;
              }

              // Refresh token
              const { $api } = useNuxtApp();
              const response = await $api<{ accessToken: string }>(
                '/v1/auth/refresh',
                {
                  method: 'POST',
                  body: {
                    refreshToken: refreshToken.value,
                  },
                }
              );

              setAccessToken(response.accessToken);

              // Retry upload dengan token baru
              item.progress = 0;
              await uploadFile(item, retryCount + 1);
              resolve();
            } catch (error) {
              console.error('Failed to refresh token:', error);
              await navigateTo('/logout');
              item.status = 'failed';
              item.error = 'Session expired';
              reject(new Error('Session expired'));
            }
          } else {
            // 401 tapi bukan TOKEN_EXPIRED
            item.status = 'failed';
            item.error = 'Unauthorized';
            reject(new Error('Unauthorized'));
          }
        } else {
          item.status = 'failed';
          item.error =
            xhr.status === 401
              ? 'Unauthorized'
              : `Upload failed: ${xhr.statusText}`;

          reject(new Error(xhr.statusText));
        }
      });

      // Handle error
      xhr.addEventListener('error', () => {
        item.status = 'failed';
        item.error = 'Network error';
        reject(new Error('Network error'));
      });

      // Handle abort
      xhr.addEventListener('abort', () => {
        item.status = 'cancelled';
        item.error = 'Upload cancelled';
        reject(new Error('Upload cancelled'));
      });

      xhr.open('POST', `${BASE_URL}${VERSION}${item.apiEndpoint}`);
      const { accessToken } = useAuth();
      if (accessToken.value) {
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken.value}`);
      }
      xhr.send(formData);
    });
  };

  const processQueue = async () => {
    const activeUploads = new Map<string, Promise<void>>();

    const startNextUpload = async () => {
      // Cari file pending berikutnya
      const nextItem = queue.value.find((item) => item.status === 'pending');

      if (!nextItem) return;

      nextItem.status = 'uploading';

      // Mulai upload dan track dengan ID
      const uploadPromise = uploadFile(nextItem)
        .catch((err) => {
          console.error(`Upload failed for ${nextItem.filename}:`, err);
        })
        .finally(() => {
          // Hapus dari active uploads ketika selesai
          activeUploads.delete(nextItem.id);

          // Langsung lanjutkan dengan file baru jika masih ada slot
          if (activeUploads.size < MAX_CONCURRENT_UPLOADS) {
            startNextUpload();
          }
        });

      activeUploads.set(nextItem.id, uploadPromise);
    };

    // Mulai upload awal sampai MAX_CONCURRENT_UPLOADS
    const initialUploads: Promise<void>[] = [];
    for (let i = 0; i < MAX_CONCURRENT_UPLOADS; i++) {
      initialUploads.push(startNextUpload());
    }
    await Promise.all(initialUploads);

    // Tunggu semua upload yang masih aktif selesai
    while (activeUploads.size > 0) {
      await Promise.race(activeUploads.values());
    }
  };

  const startUpload = async () => {
    if (!isUploading.value) {
      await processQueue();
    }
  };

  const clearCompleted = () => {
    queue.value.forEach((item) => {
      if (item.status === 'completed' || item.status === 'failed') {
        if (item.url) {
          URL.revokeObjectURL(item.url);
        }
      }
    });
    queue.value = queue.value.filter(
      (item) => item.status === 'pending' || item.status === 'uploading'
    );
  };

  const clearAll = () => {
    queue.value.forEach((item) => {
      if (item.url) {
        URL.revokeObjectURL(item.url);
      }
    });
    queue.value = [];
  };

  const cancelAllUploadTasks = () => {
    queue.value.forEach((item) => {
      if (item.status === 'uploading' && item.abortController) {
        item.abortController.abort();
      }
      item.status = 'cancelled';
      item.error = 'Cancelled by user';
    });

    clearAll();
  };

  return {
    queue,
    isUploading,
    isCompleted,
    currentUpload,
    uploadStats,
    addFiles,
    cancelUpload,
    removeFile,
    startUpload,
    clearCompleted,
    clearAll,
    cancelAllUploadTasks,
  };
};
