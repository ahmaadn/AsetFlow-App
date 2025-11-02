<script setup lang="ts">
import type { AssetResponse } from '@asetflow/shared-types';
import { formatDisplayDate, formatSize } from '@asetflow/shared';

const props = defineProps<{
  asset: AssetResponse;
}>();

const emit = defineEmits<{
  (e: 'close' | 'download' | 'edit' | 'delete'): void;
}>();

// Handle close
const handleClose = () => {
  emit('close');
};

// Handle actions
const handleDownload = () => {
  window.open(props.asset.url, '_blank');
  emit('download');
};

const handleEdit = () => {
  emit('edit');
};

const handleDelete = () => {
  emit('delete');
};
</script>

<template>
  <Teleport to="body">
    <!-- Overlay -->
    <div
      class="fixed inset-0 z-50 bg-black/50 transition-opacity"
      @click="handleClose"
    />

    <!-- Panel -->
    <aside
      class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-base-100 shadow-2xl transition-transform"
      @click.stop
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between border-b border-base-300 p-4"
      >
        <h3 class="text-lg font-semibold text-base-content">Asset Details</h3>
        <button class="btn btn-ghost btn-sm btn-circle" @click="handleClose">
          <Icon name="ri:close-line" class="h-5 w-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Preview -->
        <div class="border-b border-base-300 p-4">
          <div
            class="relative aspect-video w-full overflow-hidden rounded-lg bg-base-200"
          >
            <!-- Image Preview -->
            <img
              v-if="
                isImageMimeType(asset.mimeType) ||
                isVideoMimeType(asset.mimeType)
              "
              :src="asset.url"
              :alt="asset.originalName"
              class="h-full w-full object-contain"
            />

            <!-- Icon Fallback -->
            <div v-else class="flex h-full w-full items-center justify-center">
              <Icon
                :name="
                  asset.assetType === 'video'
                    ? 'ri:video-line'
                    : asset.assetType === 'audio'
                      ? 'ri:music-line'
                      : asset.assetType === 'document'
                        ? 'ri:file-text-line'
                        : 'ri:file-line'
                "
                class="h-20 w-20 text-base-content/30"
              />
            </div>

            <!-- Asset Type Badge -->
            <div
              class="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
            >
              {{ asset.assetType }}
            </div>
          </div>
        </div>

        <!-- Information -->
        <div class="space-y-6 p-4">
          <!-- Basic Info -->
          <div class="space-y-3">
            <h4
              class="text-xs font-semibold uppercase tracking-wider text-base-content/60"
            >
              Information
            </h4>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between gap-4">
                <dt class="text-base-content/60">Name</dt>
                <dd class="break-all text-right font-medium text-base-content">
                  {{ asset.originalName }}
                </dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-base-content/60">Slug</dt>
                <dd class="break-all text-right font-medium text-base-content">
                  {{ asset.slug }}
                </dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-base-content/60">Type</dt>
                <dd class="font-medium text-base-content">
                  {{ asset.mimeType }}
                </dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-base-content/60">Size</dt>
                <dd class="font-medium text-base-content">
                  {{ formatSize(asset.size) }}
                </dd>
              </div>
              <div
                v-if="asset.width && asset.height"
                class="flex justify-between gap-4"
              >
                <dt class="text-base-content/60">Dimensions</dt>
                <dd class="font-medium text-base-content">
                  {{ asset.width }} × {{ asset.height }}
                </dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-base-content/60">Format</dt>
                <dd class="font-medium text-base-content">
                  {{ asset.format }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- Dates -->
          <div class="space-y-3">
            <h4
              class="text-xs font-semibold uppercase tracking-wider text-base-content/60"
            >
              Dates
            </h4>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between gap-4">
                <dt class="text-base-content/60">Created</dt>
                <dd class="text-right font-medium text-base-content">
                  {{ formatDisplayDate(asset.createdAt) }}
                </dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-base-content/60">Updated</dt>
                <dd class="text-right font-medium text-base-content">
                  {{ formatDisplayDate(asset.updatedAt) }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- URLs -->
          <div class="space-y-3">
            <h4
              class="text-xs font-semibold uppercase tracking-wider text-base-content/60"
            >
              URLs
            </h4>
            <div class="space-y-3">
              <ClipboardInput
                id="asset-url"
                title="Asset URL"
                :value="asset.url"
              />
              <ClipboardInput
                id="public-id"
                title="Public ID"
                :value="asset.publicId"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="border-t border-base-300 bg-base-100 p-4">
        <div class="space-y-2">
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
  </Teleport>
</template>
