<script setup lang="ts">
import type { AssetResponse } from '@asetflow/shared-types';
import {
  formatSize,
  getIconForMimeType,
  isImageMimeType,
  isVideoMimeType,
} from '@asetflow/shared';

interface Props {
  asset: AssetResponse;
  width?: string | number;
  height?: string | number;
  selected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  width: '150',
  height: '150',
});

const target = useTemplateRef<HTMLDivElement>('target');
const targetIsVisible = useElementVisibility(target, {
  rootMargin: '1200px',
});
</script>

<template>
  <div
    ref="target"
    class="asset-item group cursor-pointer border-2 transition-all hover:shadow-lg border-base-300 hover:border-primary"
    :class="{ 'border-primary': selected }"
  >
    <!-- Preview/Icon Container -->
    <div class="relative aspect-square w-full overflow-hidden bg-base-200">
      <!-- Image/Video Preview -->
      <NuxtImg
        v-if="
          (isImageMimeType(asset.mimeType) ||
            isVideoMimeType(asset.mimeType)) &&
          targetIsVisible
        "
        provider="cloudinary"
        :src="asset.url"
        :alt="asset.originalName"
        class="h-full w-full object-cover"
        loading="lazy"
        preload
        :height="height"
        :width="width"
        format="webp"
        fit="thumbnail"
      />

      <!-- Fallback Icon -->
      <div v-else class="flex h-full w-full items-center justify-center">
        <Icon
          :name="getIconForMimeType(props.asset.mimeType)"
          class="h-16 w-16 text-base-content/30"
        />
      </div>

      <div v-if="selected" class="absolute right-0 top-0 bg-primary p-1 flex">
        <Icon name="ri:check-line" class="size-5 text-primary-content" />
      </div>

      <div
        class="absolute left-2 top-2 rounded bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
      >
        {{ asset.assetType }}
      </div>
    </div>

    <div class="p-3">
      <p
        class="truncate text-sm font-medium text-base-content"
        :title="asset.originalName"
      >
        {{ asset.originalName }}
      </p>
      <p class="text-xs text-base-content/60">
        {{ formatSize(asset.size) }}
      </p>
    </div>
  </div>
</template>
