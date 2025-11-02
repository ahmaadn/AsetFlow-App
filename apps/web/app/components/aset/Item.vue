<script setup lang="ts">
import type { AsetResponse } from '@asetflow/shared-types';
interface Props {
  asset: AsetResponse;
  selected?: boolean;
}

const placeholder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADklEQVR4AWL69u3bfwAAAAD//w3X+F0AAAAGSURBVAMACbQD5IV3B4oAAAAASUVORK5CYII=';

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'click'): void;
}>();

const imageError = ref(false);

const handleImageError = () => {
  imageError.value = true;
};
</script>

<template>
  <div
    ref="imageRef"
    class="asset-item group relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-lg"
    :class="[
      selected
        ? 'border-primary bg-primary/5'
        : 'border-base-300 hover:border-primary/50',
    ]"
    @click="emit('click')"
  >
    <!-- Preview/Icon Container -->
    <div
      class="relative aspect-square w-full overflow-hidden rounded-t-lg bg-base-200"
    >
      <!-- Image/Video Preview -->
      <UnLazyImage
        v-if="
          (isImageMimeType(asset.mimeType) ||
            isVideoMimeType(asset.mimeType)) &&
          !imageError
        "
        :ssr="false"
        :src="asset.url"
        :alt="asset.originalName"
        class="h-full w-full object-cover"
        loading="lazy"
        preload
        height="300"
        width="300"
        auto-sizes
        :placeholder-src="placeholder"
        @error="handleImageError"
      >
      </UnLazyImage>

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
