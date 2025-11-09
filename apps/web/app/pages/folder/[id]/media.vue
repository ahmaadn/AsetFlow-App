<script setup lang="ts">
import { checkFolderIdApi } from '~/lib/api/folder';
import type { AssetType } from '~/types';

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
const selectedAssetType = ref<AssetType>('all');

const assets = computed(() => assetStore.getAssetsByFolder(folderId.value));
const pagination = computed(() => assetStore.getPagination(folderId.value));
const isLoading = computed(() => assetStore.isLoadingFolder(folderId.value));
const error = computed(() => assetStore.getError(folderId.value));

const handleBack = () => {
  router.push('/folder');
};

const handleRefresh = async () => {
  try {
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
    selectedAssetType.value = type as AssetType;
    await assetStore.refreshAssets(folderId.value, {
      assetType: type === 'all' ? undefined : type,
    });
  } catch (err) {
    console.error('Error changing asset type:', err);
  }
};

const handleLoadMore = async () => {
  try {
    await assetStore.loadMoreAssets(folderId.value, {
      assetType:
        selectedAssetType.value === 'all' ? undefined : selectedAssetType.value,
    });
  } catch (err) {
    console.error('Error loading more assets:', err);
  }
};

const handleDelete = async (id: string) => {
  try {
    await assetStore.deleteAsset(folderId.value, id);
    toast.success('Asset deleted successfully');
  } catch (err) {
    console.error('Error deleting asset:', err);
    toast.error('Failed to delete asset');
  }
};

onMounted(async () => {
  try {
    if (assets.value.length === 0) {
      await assetStore.loadAssets(folderId.value);
    }
  } catch (err) {
    console.error('Error loading initial assets:', err);
  }
});
</script>

<template>
  <MediaBrowser
    :assets="assets"
    :is-loading="isLoading"
    :error="error"
    :has-more="pagination.hasMore"
    :selected-asset-type="selectedAssetType"
    @back="handleBack"
    @refresh="handleRefresh"
    @asset-type-change="handleAssetTypeChange"
    @load-more="handleLoadMore"
    @delete="handleDelete"
  />
</template>
