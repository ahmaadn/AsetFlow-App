<script setup lang="ts">
type FolderOption = {
  label: string;
  value: string;
  [key: string]: unknown;
};

definePageMeta({
  title: 'Upload Assets',
  layout: 'dashboard',
});

const toast = useToast();
const { $uploadQueue } = useNuxtApp();
const folderStore = useFolderStore();
const sFilesStore = useStaggingFilesStore();
const folderIdParam = useUrlSearchParams('history').folderId;

const tempFiles = ref<File[] | null>(null);
const targetFolder = ref<FolderOption | null>(null);
const isUploadSuccess = ref(false);
const loadingFolders = computed(() => folderStore.isLoading);
const hasMoreFolders = computed(() => folderStore.hasMore);

const folders = computed<FolderOption[]>(() =>
  folderStore.folders.map((f) => ({
    label: f.name,
    value: f.id,
    slug: f.slug,
  }))
);

async function uploadFiles() {
  // Check final validation before upload

  if (!sFilesStore.isAllValid) {
    toast.error('Please fix all errors before uploading');
    return;
  }

  if (!sFilesStore.targetFolderId) {
    toast.error('Please select a target folder before uploading');
    return;
  }

  sFilesStore.setUploading(true);
  isUploadSuccess.value = false;

  const uploadItems: UploadItem[] = sFilesStore.stagingFiles
    .filter((item) => item.file)
    .map((item) => ({
      file: item.file!,
      filename: item.name + (item.extension ? `.${item.extension}` : ''),
      slug: item.slug,
      apiEndpoint: `/folders/${targetFolder.value!.value}/upload`,
      url: item.previewUrl,
    }));

  $uploadQueue.addFiles(uploadItems);

  sFilesStore.clearStagingFiles();

  try {
    await $uploadQueue.startUpload();
    isUploadSuccess.value = true;
    toast.success(`Successfully uploaded ${uploadItems.length} file(s)`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    toast.error('AppUpload failed. Please try again.');
    isUploadSuccess.value = false;
  } finally {
    sFilesStore.setUploading(false);
  }
}

function navigateToFolder() {
  if (sFilesStore.targetFolderId) {
    navigateTo(`/folder/${sFilesStore.targetFolderId}/media`);
  }
}

function onUpdateStagingFile() {
  debouncedValidate();
}

async function loadMoreFolders() {
  await folderStore.loadMoreFolders();
}

async function handleAddFolder() {
  await folderStore.createFolder({ name: '' });
}

// Debounced validation
const debouncedValidate = useDebounceFn(() => {
  sFilesStore.reValidateStagingFile();
}, 300);

watch(
  tempFiles,
  (newFiles) => {
    if (newFiles) {
      sFilesStore.addFilesToStaging(newFiles);
    }
  },
  { immediate: true }
);

watch(
  targetFolder,
  (newFolder) => {
    if (newFolder) {
      sFilesStore.setTargetFolderId(newFolder ? newFolder.value : null);
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await folderStore.loadFolders();
  if (folderIdParam && typeof folderIdParam === 'string') {
    sFilesStore.setTargetFolderId(folderIdParam);
  }
  targetFolder.value =
    folders.value.find((f) => f.value === sFilesStore.targetFolderId) || null;
});

const modal = useModal();

const handleClearAll = async () => {
  const confirm = await modal.timer({
    title: 'Clear All Files',
    message: 'Are you sure you want to remove all files from pending uploads?',
    variant: 'error',
    confirmText: 'Clear All',
    cancelText: 'Cancel',
  });

  if (confirm) {
    sFilesStore.clearStagingFiles();
  }
};
</script>

<template>
  <div class="space-y-8">
    <AppBanner
      title="Upload Assets"
      subtitle="Add files to your digital asset library. You can rename and tag them before finalizing."
    />
    <section>
      <ui-file-select v-model="tempFiles" />
    </section>
    <div v-if="!!sFilesStore.totalFiles" class="flex flex-col gap-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-base-content">
            Pending Uploads
            <span class="text-base-content/60"
              >({{ sFilesStore.totalFiles }} files)</span
            >
          </h3>
          <p class="text-sm text-base-content/70">
            Review and manage your files before uploading to the selected
            folder.
          </p>
        </div>
        <button class="btn btn-sm btn-ghost btn-error" @click="handleClearAll">
          <Icon name="ri:close-circle-line" class="size-4" />
          Clear all
        </button>
      </div>
      <AppUploadFolderSelector
        v-model="targetFolder"
        :folders="folders"
        :loading="loadingFolders"
        :has-more="hasMoreFolders"
        @add-folder="handleAddFolder"
        @load-more="loadMoreFolders"
      />
      <AppUploadPendingList
        :items="sFilesStore.stagingFiles"
        :has-error="sFilesStore.hasErrors"
        :is-uploading="sFilesStore.isUploading"
        @upload="uploadFiles"
        @clear-all="sFilesStore.clearStagingFiles"
        @add-more="tempFiles = null"
        @update-item="onUpdateStagingFile"
        @delete-item="(index: number) => sFilesStore.deleteStagingFile(index)"
      />
      <AppUploadSuccessCard
        :show="isUploadSuccess && sFilesStore.totalFiles === 0"
        :folder-name="targetFolder?.label || ''"
        :folder-id="targetFolder?.value || ''"
        @close="isUploadSuccess = false"
        @reset="sFilesStore.clear"
        @navigate="navigateToFolder"
      />
    </div>
    <BackToTop />
  </div>
</template>
