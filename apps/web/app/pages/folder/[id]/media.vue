<script setup lang="ts">
import { checkFolderIdApi } from '~/lib/api/folder';
import type { AsetResponse } from '@asetflow/shared-types';

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
    } catch (_) {
      return false;
    }
  },
});

const route = useRoute();
const router = useRouter();
const assetStore = useAssetStore();
const folderStore = useFolderStore();

const folderId = computed(() => route.params.id as string);
const selectedAsset = ref<AsetResponse | null>(null);
const selectedAssetType = ref<string>('all');
const loadMoreRef = ref<HTMLElement>();

const assets = computed(() => assetStore.getAssetsByFolder(folderId.value));
const pagination = computed(() => assetStore.getPagination(folderId.value));
const isLoading = computed(() => assetStore.isLoadingFolder(folderId.value));
const error = computed(() => assetStore.getError(folderId.value));

// Get folder info
const currentFolder = computed(() =>
  folderStore.findFolderById(folderId.value)
);

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

const handleDelete = async () => {
  if (!selectedAsset.value) return;

  // TODO: Show confirmation dialog
  const confirmed = confirm(
    `Are you sure you want to delete "${selectedAsset.value.originalName}"?`
  );

  if (confirmed) {
    try {
      // TODO: Call delete API
      console.log('Delete asset:', selectedAsset.value.id);
      // await deleteAssetApi(selectedAsset.value.id);
      // assetStore.removeAsset(folderId.value, selectedAsset.value.id);
      selectedAsset.value = null;
    } catch (err) {
      console.error('Error deleting asset:', err);
    }
  }
};

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

// Cleanup on unmount
onUnmounted(() => {
  stopIntersection();
});
</script>

<template>
  <UiContent>
    <MediaHeader
      @back="backToFolder"
      @refresh="handleRefresh"
      @asset-type-change="handleAssetTypeChange"
    />

    <div class="flex flex-1 flex-col overflow-hidden p-2">
      <!-- Folder Info -->
      <div v-if="currentFolder" class="mb-2 rounded-lg bg-base-200 p-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon name="ri:folder-line" class="h-5 w-5 text-primary" />
            <h2 class="text-lg font-semibold">{{ currentFolder.name }}</h2>
          </div>
          <span class="text-sm text-base-content/60">
            {{ pagination.total }}
            {{ pagination.total === 1 ? 'asset' : 'assets' }}
          </span>
        </div>
      </div>

      <!-- Assets Grid with Infinite Scroll -->
      <div class="relative flex-1 overflow-hidden">
        <!-- Error State -->
        <div
          v-if="error"
          class="flex h-full flex-col items-center justify-center p-8"
        >
          <Icon
            name="ri:error-warning-line"
            class="mb-4 h-24 w-24 text-error/50"
          />
          <p class="mb-2 text-lg font-medium text-error">
            Error Loading Assets
          </p>
          <p class="mb-4 text-sm text-base-content/60">{{ error }}</p>
          <button class="btn btn-primary btn-sm" @click="handleRefresh">
            <Icon name="ri:restart-line" class="h-4 w-4" />
            Try Again
          </button>
        </div>

        <!-- Loading First Time -->
        <div
          v-else-if="isLoading && assets.length === 0"
          class="flex h-full items-center justify-center"
        >
          <div class="flex flex-col items-center gap-2">
            <span class="loading loading-spinner loading-lg text-primary" />
            <p class="text-sm text-base-content/60">Loading assets...</p>
          </div>
        </div>

        <!-- Assets Grid -->
        <div v-else class="h-full overflow-y-auto">
          <MediaGrid v-model="selectedAsset" :assets="assets" />

          <!-- Load More Trigger -->
          <div
            v-if="pagination.hasMore"
            ref="loadMoreRef"
            class="flex justify-center p-4"
          >
            <span class="loading loading-spinner loading-md text-primary" />
          </div>

          <!-- End Message -->
          <div
            v-else-if="assets.length > 0"
            class="p-4 text-center text-sm text-base-content/40"
          >
            All assets loaded
          </div>
        </div>
      </div>
    </div>

    <AsetPanel
      v-if="selectedAsset"
      :asset="selectedAsset"
      @close="handleClosePanel"
      @download="handleDownload"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <BackToTop />
  </UiContent>
</template>
