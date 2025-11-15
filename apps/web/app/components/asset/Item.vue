<script setup lang="ts">
import type { AssetResponse } from '@asetflow/shared-types';
import { formatSize } from '@asetflow/shared';

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
    :class="{ 'border-primary': props.selected }"
  >
    <UiAssetPreview
      :asset="props.asset"
      class="bg-base-200"
      aspect="square"
      :icon-view-mode="!targetIsVisible"
    >
      <template #media-preview>
        <NuxtImg
          provider="cloudinary"
          :src="props.asset.url"
          :alt="props.asset.name"
          class="h-full w-full object-cover"
          loading="lazy"
          preload
          :height="props.height"
          :width="props.width"
          format="webp"
          fit="thumbnail"
        />
      </template>
      <template #default>
        <div
          v-if="props.selected"
          class="absolute right-0 top-0 bg-primary p-1 flex"
        >
          <Icon name="ri:check-line" class="size-5 text-primary-content" />
        </div>
      </template>
    </UiAssetPreview>

    <div class="p-3">
      <p
        class="truncate text-sm font-medium text-base-content"
        :title="props.asset.name"
      >
        {{ props.asset.name }}
      </p>
      <p class="text-xs text-base-content/60">
        {{ formatSize(props.asset.size) }}
      </p>
    </div>
  </div>
</template>
