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
const isVisible = useElementVisibility(target, {
  rootMargin: '1200px',
});

const targetIsVisible = ref(false);

watch(isVisible, (val) => {
  if (val) targetIsVisible.value = true;
});
</script>

<template>
  <div
    ref="target"
    class="asset-item group cursor-pointer rounded-lg border-2 transition-all hover:shadow-lg bg-base-100 overflow-hidden"
    :class="{
      'border-primary shadow-md': props.selected,
      'border-base-300 hover:border-primary': !props.selected,
    }"
  >
    <UiAssetPreview
      :asset="props.asset"
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
        <!-- Checkbox - Show on hover or when selected -->

        <!-- Selected indicator badge -->
        <div
          v-if="props.selected"
          class="absolute right-0 top-0 bg-primary p-1.5 rounded-bl-lg"
        >
          <Icon name="ri:check-line" class="size-4 text-primary-content" />
        </div>
      </template>
    </UiAssetPreview>

    <div class="p-3">
      <div class="flex items-center justify-between gap-2">
        <p
          class="truncate text-sm font-medium text-base-content flex-1"
          :title="props.asset.name"
        >
          {{ props.asset.name }}
        </p>
        <button
          class="btn btn-ghost btn-xs btn-square opacity-0 group-hover:opacity-100 transition-opacity"
          title="More options"
          @click.stop
        >
          <Icon name="ri:more-2-fill" class="size-4" />
        </button>
      </div>
      <p class="text-xs text-base-content/60">
        {{ formatSize(props.asset.size) }}
      </p>
    </div>
  </div>
</template>
