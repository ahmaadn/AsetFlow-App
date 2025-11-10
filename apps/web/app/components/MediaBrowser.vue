<script setup lang="ts">
import type { AssetResponse } from '@asetflow/shared-types';
import type { AssetType } from '~/types';

interface Props {
  assets: AssetResponse[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  selectedAssetType?: AssetType;
  loadingMessage?: string;
}

interface Emits {
  back: [];
  refresh: [];
  'asset-type-change': [type: string];
  'load-more': [];
  delete: [id: string];
}

const props = withDefaults(defineProps<Props>(), {
  selectedAssetType: 'all',
  loadingMessage: 'Loading assets...',
});

const emit = defineEmits<Emits>();

const selectedAsset = ref<AssetResponse | null>(null);
const loadMoreRef = ref<HTMLElement>();
const isModalDeleteOpen = ref(false);

const { getViewModeAssets, setViewModeAssets } = useSetting();

// Load more when scroll to bottom
const { stop: stopIntersection } = useIntersectionObserver(
  loadMoreRef,
  async ([entry]) => {
    if (entry?.isIntersecting && props.hasMore && !props.isLoading) {
      emit('load-more');
    }
  }
);

const handleClosePanel = () => {
  selectedAsset.value = null;
  isModalDeleteOpen.value = false;
};

const handleDownload = () => {
  console.log('Download asset:', selectedAsset.value?.id);
};

const handleEdit = () => {
  if (!selectedAsset.value) return;
  console.log('Edit asset:', selectedAsset.value.id);
};

const onDelete = async () => {
  if (!selectedAsset.value) return;
  emit('delete', selectedAsset.value.id);
  selectedAsset.value = null;
  isModalDeleteOpen.value = false;
};

function toggleSelect(asset: AssetResponse) {
  if (!asset) return;
  selectedAsset.value =
    selectedAsset.value && selectedAsset.value.id === asset.id ? null : asset;
}

onUnmounted(stopIntersection);
</script>

<template>
  <div class="flex-1 relative">
    <AppMediaHeader
      :default-asset-type="selectedAssetType"
      :default-view-mode="getViewModeAssets"
      @back="emit('back')"
      @refresh="emit('refresh')"
      @asset-type-change="emit('asset-type-change', $event)"
      @view-mode-change="setViewModeAssets"
    />

    <div class="flex flex-col overflow-hidden p-2 w-full">
      <div class="relative flex-1 overflow-hidden">
        <div
          v-if="error"
          class="flex h-full flex-col items-center justify-center p-8"
        >
          <Icon
            name="ri:error-warning-line"
            class="mb-4 h-24 w-24 text-error"
          />
          <p class="mb-2 text-lg font-medium text-error">
            Error Loading Assets
          </p>
          <button class="btn btn-primary btn-sm" @click="emit('refresh')">
            <Icon name="ri:restart-line" class="h-4 w-4" />
            Try Again
          </button>
        </div>

        <div
          v-else-if="isLoading && assets.length === 0"
          class="flex h-full items-center justify-center"
        >
          <div class="flex flex-col items-center gap-2">
            <span class="loading loading-spinner loading-lg text-primary" />
            <p class="text-sm text-base-content/60">{{ loadingMessage }}</p>
          </div>
        </div>

        <div v-else class="w-full h-full overflow-auto">
          <AppMediaGrid v-if="getViewModeAssets === 'grid'" :assets="assets">
            <template #default="{ asset }">
              <AssetItem
                :asset="asset"
                :selected="
                  Boolean(selectedAsset && selectedAsset.id === asset.id)
                "
                @click="toggleSelect(asset)"
              />
            </template>
          </AppMediaGrid>
          <AppMediaList
            v-else
            v-model:selected="selectedAsset"
            :assets="assets"
          />

          <div v-if="hasMore" ref="loadMoreRef" class="flex justify-center p-4">
            <span class="loading loading-spinner loading-md text-primary" />
          </div>

          <div
            v-else-if="assets.length > 0"
            class="p-4 text-center text-sm text-base-content/40"
          >
            All assets loaded
          </div>
        </div>
      </div>
    </div>

    <AppPanelAsset
      v-if="selectedAsset"
      :asset="selectedAsset"
      @close="handleClosePanel"
      @download="handleDownload"
      @edit="handleEdit"
      @delete="isModalDeleteOpen = true"
    />

    <AppModalDelete
      v-if="selectedAsset && isModalDeleteOpen"
      v-model="isModalDeleteOpen"
      :confirm-text="selectedAsset.slug"
      @confirm="onDelete"
      @cancel="isModalDeleteOpen = false"
    >
      <p>
        Apakah Anda yakin ingin menghapus Asset
        <span class="font-semibold text-base-content/100">
          {{ selectedAsset.originalName }}</span
        >? Tindakan ini tidak dapat dibatalkan.
      </p>
    </AppModalDelete>

    <BackToTop />
  </div>
</template>
