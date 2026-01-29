<script setup lang="ts">
import type { AssetResponse } from '@asetflow/shared-types';
import type { AssetType, ViewMode } from '~/types';
import type { TabItem } from '~/components/ui/Tabs.vue';
import type { ComboBoxOption } from '~/components/ui/combo/state';

definePageMeta({
  title: 'Media Library',
  layout: 'dashboard',
});

const route = useRoute();
const assetStore = useAssetStore();
const toast = useToast();

const typeAsset = computed(() => (route.query.type as string) || 'all');
const selectedAssetType = ref<AssetType>('all');

const assets = computed(() => assetStore.getAssetsByType(typeAsset.value));
const pagination = computed(() => assetStore.getPagination(typeAsset.value));
const isLoading = computed(() => assetStore.isLoadingFolder(typeAsset.value));
const error = computed(() => assetStore.getError(typeAsset.value));

const selectedAsset = ref<AssetResponse | null>(null);
const loadMoreRef = ref<HTMLElement>();
const isModalDeleteOpen = ref(false);

const { getViewModeAssets, setViewModeAssets } = useSetting();

// View mode tabs
const viewTabs: TabItem[] = [
  { key: 'grid', icon: 'ri:layout-grid-fill' },
  { key: 'list', icon: 'ri:list-check' },
];

// Asset type filter options
const assetTypeOptions: ComboBoxOption[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Document', value: 'document' },
  { label: 'Audio', value: 'audio' },
];

const selectedAssetTypeFilter = ref<ComboBoxOption | null>(
  assetTypeOptions.find((o) => o.value === selectedAssetType.value) || null
);

// Watch asset type filter changes
watch(selectedAssetTypeFilter, async (newVal) => {
  const type = (newVal?.value as AssetType) || 'all';
  selectedAssetType.value = type;
  try {
    await assetStore.refreshAssetsByType(typeAsset.value, {
      assetType: type === 'all' ? undefined : type,
    });
  } catch (err) {
    console.error('Error changing asset type:', err);
  }
});

// Load more when scroll to bottom
const { stop: stopIntersection } = useIntersectionObserver(
  loadMoreRef,
  async ([entry]) => {
    if (entry?.isIntersecting && pagination.value.hasMore && !isLoading.value) {
      await handleLoadMore();
    }
  }
);

const handleRefresh = async () => {
  try {
    await assetStore.refreshAssetsByType(typeAsset.value, {
      assetType:
        selectedAssetType.value === 'all' ? undefined : selectedAssetType.value,
    });
  } catch (err) {
    console.error('Error refreshing assets:', err);
  }
};

const handleLoadMore = async () => {
  try {
    await assetStore.loadMoreAssetsByType(typeAsset.value, {
      assetType:
        selectedAssetType.value === 'all' ? undefined : selectedAssetType.value,
    });
  } catch (err) {
    console.error('Error loading more assets:', err);
  }
};

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

const _handleDelete = async () => {
  if (!selectedAsset.value) return;
  try {
    await assetStore.deleteAsset(typeAsset.value, selectedAsset.value.id);
    toast.success('Asset deleted successfully');
    selectedAsset.value = null;
    isModalDeleteOpen.value = false;
  } catch (err) {
    console.error('Error deleting asset:', err);
    toast.error('Failed to delete asset');
  }
};

function toggleSelect(asset: AssetResponse) {
  if (!asset) return;
  selectedAsset.value =
    selectedAsset.value && selectedAsset.value.id === asset.id ? null : asset;
}

function onUpdateAsset(updatedAsset: AssetResponse) {
  if (selectedAsset.value && selectedAsset.value.id === updatedAsset.id) {
    selectedAsset.value = updatedAsset;
  }
}

onMounted(async () => {
  try {
    if (assets.value.length === 0) {
      await assetStore.loadAssetsByType(typeAsset.value);
    }
  } catch (err) {
    console.error('Error loading initial assets:', err);
  }
});

onUnmounted(stopIntersection);
</script>

<template>
  <div class="flex-1 relative">
    <div class="mb-8">
      <AppBanner
        title="Drive Folders"
        subtitle="Manage your folders to organize your digital assets effectively."
      />
    </div>
    <div class="space-y-4">
      <UiFilterToolbar
        search-placeholder="Search assets"
        :item-count="assets.length"
        item-label="Assets"
      >
        <template #left>
          <!-- Refresh Button -->
          <button class="btn bg-base-100 btn-sm gap-2" @click="handleRefresh">
            <Icon name="ri:restart-line" class="size-4" />
            Refresh
          </button>

          <!-- Asset Type Filter -->
          <UiComboBox
            v-model="selectedAssetTypeFilter"
            class="w-auto"
            :options="assetTypeOptions"
          >
            <template #display="{ modelValue, isOpen, open }">
              <button
                class="btn bg-base-100 btn-sm gap-2"
                :class="{ 'btn-active': isOpen || modelValue }"
                @click="open"
              >
                <Icon name="ri:filter-3-line" class="size-4" />
                {{
                  (modelValue as ComboBoxOption | null)?.label || 'All Types'
                }}
                <Icon
                  :name="isOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'"
                  class="size-4"
                />
              </button>
            </template>
          </UiComboBox>
        </template>

        <template #right>
          <UiTabs
            :model-value="getViewModeAssets"
            :tabs="viewTabs"
            variant="box"
            size="sm"
            class-tabs="bg-base-300"
            icon-only
            @update:model-value="setViewModeAssets($event as ViewMode)"
          />
        </template>
      </UiFilterToolbar>

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
            <button class="btn btn-primary btn-sm" @click="handleRefresh">
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
              <p class="text-sm text-base-content/60">Loading assets...</p>
            </div>
          </div>

          <div v-else class="w-full h-full overflow-auto">
            <AppMediaGrid v-if="getViewModeAssets === 'grid'" :assets="assets">
              <template #default="{ asset }">
                <AppAssetItem
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

            <div
              v-if="pagination.hasMore"
              ref="loadMoreRef"
              class="flex justify-center p-4"
            >
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

      <AppAssetPanel
        v-if="selectedAsset"
        :asset="selectedAsset"
        @close="handleClosePanel"
        @download="handleDownload"
        @edit="handleEdit"
        @delete="isModalDeleteOpen = true"
        @update="onUpdateAsset"
      />
    </div>

    <!-- <AppModalDelete
      v-if="selectedAsset && isModalDeleteOpen"
      v-model="isModalDeleteOpen"
      :confirm-text="selectedAsset.slug"
      @confirm="handleDelete"
      @cancel="isModalDeleteOpen = false"
    >
      <p>
        Apakah Anda yakin ingin menghapus Asset
        <span class="font-semibold text-base-content/100">
          {{ selectedAsset.name }}</span
        >? Tindakan ini tidak dapat dibatalkan.
      </p>
    </AppModalDelete> -->

    <BackToTop />
  </div>
</template>
