<script setup lang="ts">
import type { AssetResponse } from '@asetflow/shared-types';
import type { UpdateAssetInput } from '@asetflow/validators';
import {
  formatDisplayDate,
  formatSize,
  generateSlug,
  getAssetTypeFromMime,
} from '@asetflow/shared';

interface Props {
  asset: AssetResponse;
}

interface Emits {
  close: [];
  download: [];
  edit: [];
  delete: [];
  update: [data: AssetResponse];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const assetStore = useAssetStore();
const folderStore = useFolderStore();
const toast = useToast();
const { getPublicAssetUrl } = usePublicApi();

const isEditMode = ref(false);
const isUpdating = ref(false);
const editForm = ref<UpdateAssetInput>({
  name: props.asset.name,
  slug: props.asset.slug,
});

const handleClose = () => emit('close');

const handleDownload = () => {
  window.open(props.asset.url, '_blank');
  emit('download');
};

const handleEdit = () => {
  isEditMode.value = true;
  editForm.value = {
    name: props.asset.name,
    slug: props.asset.slug,
  };
};

const handleDelete = () => emit('delete');

const handleCancelEdit = () => {
  isEditMode.value = false;
  editForm.value = {
    name: props.asset.name,
    slug: props.asset.slug,
  };
};

const handleSaveEdit = async () => {
  if (!editForm.value.name?.trim() || !editForm.value.slug?.trim()) {
    toast.error('Name and slug are required');
    return;
  }

  isUpdating.value = true;
  try {
    const updatedAsset = await assetStore.updateAsset(
      props.asset.folderId,
      props.asset.id,
      editForm.value
    );

    emit('update', updatedAsset);
    isEditMode.value = false;
    toast.success('Asset updated successfully');
  } catch (error) {
    console.error('Failed to update asset:', error);
    toast.error('Failed to update asset');
  } finally {
    isUpdating.value = false;
  }
};

const onNameInput = () => {
  if (editForm.value.name) {
    editForm.value.slug = generateSlug(editForm.value.name);
  }
};

const currentFolder = computed(() => {
  return folderStore.findFolderById(props.asset.folderId);
});

const publicAssetUrl = computed(() => {
  if (!currentFolder.value) return '';
  return getPublicAssetUrl(currentFolder.value.slug, props.asset.slug);
});
</script>

<template>
  <Teleport to="#modal-container">
    <div>
      <div
        class="fixed inset-0 z-50 bg-black/50 transition-opacity"
        @click="handleClose"
      />

      <aside
        class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-base-100 shadow-2xl transition-transform"
        @click.stop
      >
        <div
          class="flex items-center justify-between border-b border-base-300 p-4"
        >
          <h3 class="text-lg font-semibold text-base-content">
            {{ isEditMode ? 'Edit Asset' : 'Asset Details' }}
          </h3>
          <button class="btn btn-ghost btn-sm btn-circle" @click="handleClose">
            <Icon name="ri:close-line" class="h-5 w-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div class="border-b border-base-300 p-4">
            <UiAssetPreview :asset="asset" class="rounded-lg bg-base-200" />
          </div>

          <div class="space-y-6 p-4">
            <div class="space-y-2">
              <UiInfoTitle>Information</UiInfoTitle>
              <dl class="space-y-2 text-sm">
                <UiInfoRow label="Name">
                  <input
                    v-if="isEditMode"
                    v-model="editForm.name"
                    type="text"
                    class="input input-bordered input-sm w-full"
                    placeholder="Asset name"
                    @input="onNameInput"
                  />
                  <span v-else class="break-all">
                    {{ asset.name }}
                  </span>
                </UiInfoRow>

                <UiInfoRow label="Slug">
                  <input
                    v-if="isEditMode"
                    v-model="editForm.slug"
                    type="text"
                    class="input input-bordered input-sm w-full"
                    placeholder="asset-slug"
                  />
                  <span v-else class="break-all">
                    {{ asset.slug }}
                  </span>
                </UiInfoRow>

                <UiInfoRow label="Asset Type">
                  {{ getAssetTypeFromMime(asset.mimeType) }}
                </UiInfoRow>

                <UiInfoRow label="Size">
                  {{ formatSize(asset.size) }}
                </UiInfoRow>

                <UiInfoRow label="MIME Type"> {{ asset.mimeType }} </UiInfoRow>
                <UiInfoRow label="Views"> {{ asset.viewCount }} </UiInfoRow>
              </dl>
            </div>

            <div v-if="asset.metadata" class="space-y-2">
              <UiInfoTitle>Metadata</UiInfoTitle>
              <dl class="space-y-2 text-sm">
                <UiInfoRow
                  v-for="(value, key) in asset.metadata"
                  :key="key"
                  :label="key"
                >
                  {{ value }}
                </UiInfoRow>
              </dl>
            </div>

            <div class="space-y-2">
              <UiInfoTitle>Dates</UiInfoTitle>
              <dl class="space-y-2 text-sm">
                <UiInfoRow label="Created">
                  {{ formatDisplayDate(asset.createdAt) }}
                </UiInfoRow>
                <UiInfoRow label="Updated">
                  {{ formatDisplayDate(asset.updatedAt) }}
                </UiInfoRow>
              </dl>
            </div>
            <div class="space-y-3">
              <ClipboardInput
                id="asset-url"
                title="Asset URL"
                :value="asset.url"
              />
              <ClipboardInput
                v-if="publicAssetUrl"
                id="public-api-url"
                title="Public API URL"
                :value="publicAssetUrl"
              />
            </div>
          </div>
        </div>

        <div class="border-t border-base-300 bg-base-100 p-4">
          <div v-if="isEditMode" class="flex gap-2">
            <button
              class="btn btn-ghost flex-1"
              :disabled="isUpdating"
              @click="handleCancelEdit"
            >
              Cancel
            </button>
            <button
              class="btn btn-primary flex-1"
              :disabled="isUpdating"
              @click="handleSaveEdit"
            >
              <span
                v-if="isUpdating"
                class="loading loading-spinner loading-sm"
              />
              Save
            </button>
          </div>

          <div v-else class="space-y-2">
            <button class="btn btn-primary btn-block" @click="handleDownload">
              <Icon name="ri:download-line" class="h-4 w-4" />
              Download
            </button>
            <div class="grid grid-cols-2 gap-2">
              <button class="btn btn-outline btn-warning" @click="handleEdit">
                <Icon name="ri:edit-line" class="h-4 w-4" />
                Edit
              </button>
              <button class="btn btn-outline btn-error" @click="handleDelete">
                <Icon name="ri:delete-bin-line" class="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </Teleport>
</template>
