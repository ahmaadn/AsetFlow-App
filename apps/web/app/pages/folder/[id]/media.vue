<script setup lang="ts">
import { checkFolderIdApi } from '~/lib/api/folder';
import type { AssetResponse } from '@asetflow/shared-types';

definePageMeta({
  title: 'Media Library',
  async validate(route) {
    const auth = useAuth();
    if (!auth.isAuthenticated.value) return false;

    const folderStore = useFolderStore();
    const existingFolder = folderStore.findFolderById(
      route.params.id as string
    );
    if (existingFolder) return true;

    try {
      await checkFolderIdApi(route.params.id as string);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return false;
    }
  },
});

const route = useRoute();
const router = useRouter();
const assetStore = useAssetStore();
const toast = useToast();

const folderId = computed(() => route.params.id as string);
const selectedAsset = ref<AssetResponse | null>(null);
const selectedAssetType = ref<string>('all');
const loadMoreRef = ref<HTMLElement>();
const isModalDeleteOpen = ref(false);

const assets = computed(() => assetStore.getAssetsByFolder(folderId.value));
const pagination = computed(() => assetStore.getPagination(folderId.value));
const isLoading = computed(() => assetStore.isLoadingFolder(folderId.value));
const error = computed(() => assetStore.getError(folderId.value));

// Load more when scroll to bottom
const { stop: stopIntersection } = useIntersectionObserver(
  loadMoreRef,
  async ([entry]) => {
    if (entry?.isIntersecting && pagination.value.hasMore && !isLoading.value) {
      try {
        await assetStore.loadMoreAssets(folderId.value, {
          assetType:
            selectedAssetType.value === 'all'
              ? undefined
              : selectedAssetType.value,
        });
      } catch (err) {
        console.error('Error loading more assets:', err);
      }
    }
  }
);

// Handlers
const backToFolder = () => {
  router.push('/folder');
};

const handleRefresh = async () => {
  try {
    selectedAsset.value = null;
    await assetStore.refreshAssets(folderId.value, {
      assetType:
        selectedAssetType.value === 'all' ? undefined : selectedAssetType.value,
    });
  } catch (err) {
    console.error('Error refreshing assets:', err);
  }
};

const handleAssetTypeChange = async (type: string) => {
  try {
    selectedAssetType.value = type;
    selectedAsset.value = null;
    await assetStore.refreshAssets(folderId.value, {
      assetType: type === 'all' ? undefined : type,
    });
  } catch (err) {
    console.error('Error changing asset type:', err);
  }
};

// Panel handlers
const handleClosePanel = () => {
  selectedAsset.value = null;
  isModalDeleteOpen.value = false;
};

const handleDownload = () => {
  // Download logic already handled in panel
  console.log('Download asset:', selectedAsset.value?.id);
};

const handleEdit = () => {
  if (!selectedAsset.value) return;
  // TODO: Navigate to edit page or open edit modal
  console.log('Edit asset:', selectedAsset.value.id);
  // router.push(`/folder/${folderId.value}/asset/${selectedAsset.value.id}/edit`);
};

const onDelete = async () => {
  if (!selectedAsset.value) return;

  try {
    await assetStore.deleteAsset(folderId.value, selectedAsset.value.id);
    selectedAsset.value = null;
    isModalDeleteOpen.value = false;
    toast.success('Asset deleted successfully');
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

// Initial load
onMounted(async () => {
  try {
    if (assets.value.length === 0) {
      await assetStore.loadAssets(folderId.value);
    }
  } catch (err) {
    console.error('Error loading initial assets:', err);
  }
});

onUnmounted(stopIntersection);
</script>

<template>
  <div class="flex-1 relative">
    <MediaHeader
      @back="backToFolder"
      @refresh="handleRefresh"
      @asset-type-change="handleAssetTypeChange"
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
          <MediaGrid :assets="assets">
            <template #default="{ asset }">
              <AssetItem
                :asset="asset"
                :selected="
                  Boolean(selectedAsset && selectedAsset.id === asset.id)
                "
                @click="toggleSelect(asset)"
              />
            </template>
          </MediaGrid>

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
        <span id="asset-name" class="font-semibold text-base-content/100">
          {{ selectedAsset.originalName }}</span
        >? Tindakan ini tidak dapat dibatalkan.
      </p>
    </AppModalDelete>

    <BackToTop />
  </div>
</template>
