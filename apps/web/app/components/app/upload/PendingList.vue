<script setup lang="ts">
import type { StaggingFile } from '~/types';

interface Props {
  items: StaggingFile[];
  hasError: boolean;
  isUploading: boolean;
}

interface Emits {
  upload: [];
  clearAll: [];
  addMore: [];
  updateItem: [];
  deleteItem: [index: number];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const modal = useModal();

const columns = [
  { key: 'preview', label: 'Preview', className: 'w-20' },
  { key: 'name', label: 'Asset Name', className: 'min-w-md' },
  { key: 'size', label: 'Size', className: '' },
  { key: 'actions', label: 'Action', className: '' },
];

const getFileIcon = (type: string) => {
  if (type.includes('image')) return 'ri:image-line';
  if (type.includes('video')) return 'ri:video-line';
  if (type.includes('audio')) return 'ri:music-line';
  if (type.includes('pdf')) return 'ri:file-pdf-line';
  return 'ri:file-line';
};

const getFileTypeLabel = (filename: string) => {
  const ext = filename.split('.').pop()?.toUpperCase() || '';
  return ext ? `.${ext}` : '';
};

const handleDelete = async (row: StaggingFile) => {
  const index = props.items.indexOf(row);
  if (index === -1) return;

  const confirm = await modal.timer({
    title: 'Remove File',
    message: `Are you sure you want to remove "${row.name}" from pending uploads?`,
    variant: 'error',
    confirmText: 'Remove',
    cancelText: 'Cancel',
  });

  if (confirm) {
    emit('deleteItem', index);
  }
};
</script>

<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-base-content">Preview Assets</h3>
    </div>

    <div class="bg-base-100 rounded-lg border border-base-200">
      <UiTable
        class="w-full flex-1 h-full bg-base-100 rounded-md"
        :columns="columns"
        :rows="props.items"
      >
        <template #cell-preview="{ row }">
          <div
            v-if="row.previewUrl && row.assetType === 'image'"
            class="w-20 h-20 rounded-lg overflow-hidden bg-base-200"
          >
            <img
              :src="row.previewUrl"
              :alt="row.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="w-20 h-20 rounded-lg flex items-center justify-center shrink-0"
            :class="{
              'bg-blue-500/10': row.assetType === 'document',
              'bg-purple-500/10': row.assetType === 'video',
              'bg-green-500/10': row.assetType === 'audio',
              'bg-base-200': !row.assetType,
            }"
          >
            <Icon
              :name="getFileIcon(row.file.type)"
              class="size-6"
              :class="{
                'text-blue-500': row.assetType === 'document',
                'text-purple-500': row.assetType === 'video',
                'text-green-500': row.assetType === 'audio',
                'text-base-content/60': !row.assetType,
              }"
            />
          </div>
        </template>

        <template #cell-name="{ row }">
          <div class="w-full">
            <label
              class="input input-sm input-bordered flex items-center gap-2 w-full"
            >
              <input
                v-model="row.name"
                type="text"
                class="grow"
                placeholder="Asset name"
                :class="{ 'text-error': row.errors.length > 0 }"
                @input="emit('updateItem')"
              />
              <span class="opacity-70">{{
                getFileTypeLabel(row.file.name)
              }}</span>
            </label>
            <div v-if="row.errors.length > 0" class="mt-1">
              <p
                v-for="(error, idx) in row.errors"
                :key="idx"
                class="text-xs text-error"
              >
                {{ error }}
              </p>
            </div>
          </div>
        </template>

        <template #cell-size="{ row }">
          <span class="text-sm font-medium text-base-content/70 text-nowrap">{{
            row.size
          }}</span>
        </template>

        <template #cell-actions="{ row }">
          <button
            class="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
            :disabled="row.isUploading"
            @click="handleDelete(row)"
          >
            <Icon name="ri:delete-bin-line" class="size-4" />
          </button>
        </template>
      </UiTable>
    </div>

    <div
      v-if="props.hasError"
      class="alert alert-warning flex items-center gap-2"
    >
      <Icon name="ri:error-warning-line" class="size-5" />
      <span>Please fix all errors before uploading</span>
    </div>

    <div class="bg-base-200 rounded-lg p-4 flex items-center justify-end gap-4">
      <button
        class="btn btn-primary btn-sm"
        :disabled="
          props.hasError || props.items.length === 0 || props.isUploading
        "
        @click="emit('upload')"
      >
        <span
          v-if="props.isUploading"
          class="loading loading-spinner loading-xs"
        />
        <Icon v-else name="ri:upload-cloud-2-line" class="size-5" />
        Start Upload
      </button>
    </div>
  </section>
</template>
