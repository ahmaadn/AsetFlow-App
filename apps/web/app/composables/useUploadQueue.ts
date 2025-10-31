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
  const MAX_CONCURRENT_UPLOADS = 3;
  const queue = useState<Array<UploadQueueItem>>('uploadQueue', () => []);
  const config = useRuntimeConfig();
  const baseURL = (config.public.apiBase || '/api') as string;

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

  const uploadFile = async (item: UploadQueueItem): Promise<void> => {
    const formData = new FormData();
    formData.append('file', item.file);
    formData.append('filename', item.filename);
    if (item.slug) {
      formData.append('slug', item.slug);
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

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
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          item.status = 'completed';
          item.progress = 100;
          resolve(xhr.response);
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

      xhr.open('POST', `${baseURL}${item.apiEndpoint}`);

      const token = useAuth().tokenCookie.value;
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  };

  const processQueue = async () => {
    const activeUploads: Promise<void>[] = [];

    while (
      queue.value.some(
        (item) => item.status === 'pending' || item.status === 'uploading'
      )
    ) {
      // Ambil file yang sedang diupload
      let currentUploading = queue.value.filter(
        (item) => item.status === 'uploading'
      ).length;

      // Jika masih bisa upload lebih banyak
      while (currentUploading < MAX_CONCURRENT_UPLOADS) {
        const nextItem = queue.value.find((item) => item.status === 'pending');

        if (nextItem) {
          nextItem.status = 'uploading';

          // Jalankan upload secara parallel
          const uploadPromise = uploadFile(nextItem).catch((err) => {
            console.error(`Upload failed for ${nextItem.filename}:`, err);
          });

          activeUploads.push(uploadPromise);
        }
        currentUploading++;
      }

      // Tunggu salah satu upload selesai sebelum lanjut
      if (activeUploads.length > 0) {
        await Promise.race(activeUploads);
        // Hapus promise yang sudah selesai
        const settled = await Promise.allSettled(activeUploads);
        activeUploads.length = 0;

        // Tambahkan kembali yang belum selesai
        settled.forEach((result) => {
          if (result.status === 'rejected') {
            activeUploads.push(Promise.resolve());
          }
        });
      }

      // Jika tidak ada lagi pending dan semua upload selesai, keluar
      if (
        !queue.value.some((item) => item.status === 'pending') &&
        !queue.value.some((item) => item.status === 'uploading')
      ) {
        break;
      }

      // Small delay untuk menghindari busy loop
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Tunggu semua upload selesai
    await Promise.all(activeUploads);
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
  };
};
