<script setup lang="ts">
import type { AssetResponse } from '@asetflow/shared-types';
import { formatSize } from '@asetflow/shared';

interface Props {
  asset: AssetResponse;
  selected?: boolean;
}

const props = defineProps<Props>();
const target = useTemplateRef<HTMLDivElement>('target');
const targetIsVisible = useElementVisibility(target, {
  threshold: 0.1,
  rootMargin: '200px',
});
const visibility = shallowRef(false);
const imageError = shallowRef(false);

watch(
  targetIsVisible,
  (isVisible) => {
    if (isVisible && !visibility.value) {
      visibility.value = true;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div
    ref="target"
    class="asset-item group cursor-pointer rounded-lg border-2 transition-all hover:shadow-lg"
    :class="[
      selected
        ? 'border-primary bg-primary/5'
        : 'border-base-300 hover:border-primary/50',
    ]"
  >
    <!-- Preview/Icon Container -->
    <div
      class="relative aspect-square w-full overflow-hidden rounded-t-lg bg-base-200"
    >
      <!-- Image/Video Preview -->
      <NuxtImg
        v-if="
          (isImageMimeType(asset.mimeType) ||
            isVideoMimeType(asset.mimeType)) &&
          !imageError &&
          visibility
        "
        :src="asset.url"
        :alt="asset.originalName"
        class="h-full w-full object-cover"
        loading="lazy"
        densities="x1 x2"
        preload
        height="300"
        width="300"
        quality="80"
        format="webp"
        placeholder-class="bg-base-200"
        @error="imageError = true"
      >
      </NuxtImg>

      <!-- Fallback Icon -->
      <div v-else class="flex h-full w-full items-center justify-center">
        <Icon
          :name="getIconForMimeType(props.asset.mimeType)"
          class="h-16 w-16 text-base-content/30"
        />
      </div>

      <!-- Selected Indicator -->
      <div v-if="selected" class="absolute right-2 top-2 bg-primary p-1">
        <Icon name="ri:check-line" class="h-4 w-4 text-primary-content" />
      </div>

      <!-- Asset Type Badge -->
      <div
        class="absolute left-2 top-2 rounded bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
      >
        {{ asset.assetType }}
      </div>
    </div>

    <!-- Info -->
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
