<script setup lang="ts">
type FolderOption = {
  label: string;
  value: string;
  [key: string]: unknown;
};

const toast = useToast();
const { $uploadQueue } = useNuxtApp();
const folderStore = useFolderStore();
const sFilesStore = useStaggingFilesStore();
const folderIdParam = useUrlSearchParams('history').folderId;

const tempFiles = ref<File[] | null>(null);
const targetFolder = ref<FolderOption | null>(null);
const isUploadSuccess = ref(false);

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
</script>

<template>
  <div class="p-6 md:p-8 space-y-8">
    <AppUploadFolderSelector
      v-model="targetFolder"
      :folders="folders"
      @add-folder="folderStore.createFolder"
    />
    <AppUploadFileUploader v-model="tempFiles" :show="!!targetFolder" />
    <AppStagingList
      :length="sFilesStore.totalFiles"
      :show="!!targetFolder && sFilesStore.totalFiles > 0"
      :has-error="sFilesStore.hasErrors"
      :is-uploading="sFilesStore.isUploading"
      @upload="uploadFiles"
      @clear-all="sFilesStore.clearStagingFiles"
    >
      <AppStagingFile
        v-for="(item, index) in sFilesStore.stagingFiles"
        :key="`staging-${index}`"
        v-model="sFilesStore.stagingFiles[index]!"
        :index="index"
        @update:model-value="onUpdateStagingFile"
        @delete="sFilesStore.deleteStagingFile(index)"
      />
    </AppStagingList>
    <AppUploadSuccessCard
      :show="isUploadSuccess && sFilesStore.totalFiles === 0"
      :folder-name="targetFolder?.label || ''"
      :folder-id="targetFolder?.value || ''"
      @close="isUploadSuccess = false"
      @reset="sFilesStore.clear"
      @navigate="navigateToFolder"
    />

    <BackToTop />
  </div>
</template>
