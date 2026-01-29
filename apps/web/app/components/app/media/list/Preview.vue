<script setup lang="ts">
import { isImageMimeType } from '@asetflow/shared';
import type { AssetResponse } from '@asetflow/shared-types';
import { useElementVisibility } from '@vueuse/core';

interface Props {
  asset: AssetResponse;
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 48,
});

const previewRef = useTemplateRef<HTMLDivElement>('previewRef');
const isVisible = useElementVisibility(previewRef, {
  rootMargin: '200px',
});
</script>

<template>
  <div
    ref="previewRef"
    class="flex items-center justify-center rounded-md overflow-hidden bg-base-200 border border-base-300"
    :style="{ width: `${props.size}px`, height: `${props.size}px` }"
  >
    <NuxtImg
      v-if="isImageMimeType(props.asset.mimeType) && isVisible"
      provider="cloudinary"
      :src="props.asset.url"
      :alt="props.asset.name"
      class="h-full w-full object-cover"
      loading="lazy"
      :height="props.size"
      :width="props.size"
      format="webp"
      fit="thumbnail"
    />
    <div
      v-else
      class="flex h-full w-full items-center justify-center bg-base-200"
    >
      <UiAssetTypeIcon :mime-type="props.asset.mimeType" class="size-6" />
    </div>
  </div>
</template>
