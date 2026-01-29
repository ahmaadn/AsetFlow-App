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
        :src="props.asset.url"
        :alt="props.asset.name"
        class="h-full w-full object-contain"
      />
    </slot>
    <div v-else class="flex h-full w-full items-center justify-center">
      <Icon
        :name="getIconForMimeType(props.asset.mimeType)"
        class="h-20 w-20 text-base-content/30"
      />
    </div>
    <div
      class="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
    >
      {{ getAssetTypeFromMime(props.asset.mimeType) }}
    </div>
    <slot />
  </div>
</template>
