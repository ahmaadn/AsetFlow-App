<script setup lang="ts">
import type { AssetResponse } from '@asetflow/shared-types';
import {
  getAssetTypeFromMime,
  getIconForMimeType,
  isImageMimeType,
} from '@asetflow/shared';

interface Props {
  asset: AssetResponse;
  aspect?: 'square' | 'video';
  iconViewMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  aspect: 'video',
  iconViewMode: false,
});
</script>

<template>
  <div
    class="relative w-full overflow-hidden"
    :class="{
      'aspect-square': props.aspect === 'square',
      'aspect-video': props.aspect === 'video',
    }"
  >
    <slot
      v-if="isImageMimeType(props.asset.mimeType) && !props.iconViewMode"
      name="media-preview"
    >
      <NuxtImg
        :src="asset.url"
        :alt="asset.name"
        class="h-full w-full object-contain"
      />
    </slot>

    <div v-else class="flex h-full w-full items-center justify-center">
      <Icon
        :name="getIconForMimeType(asset.mimeType)"
        class="h-20 w-20 text-base-content/30"
      />
    </div>

    <div
      class="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
    >
      {{ getAssetTypeFromMime(asset.mimeType) }}
    </div>
    <div
      class="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm inline-flex items-center gap-x-1"
    >
      <Icon name="ri:eye-fill" class="size-4" />
      <span>{{ asset.viewCount }}</span>
    </div>
    <slot />
  </div>
</template>
