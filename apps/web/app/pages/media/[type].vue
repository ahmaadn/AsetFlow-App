<script setup lang="ts">
type AssetType = 'all' | 'image' | 'video' | 'document' | 'audio';

definePageMeta({
  title: 'Media Item',
  validate(route) {
    const paths = ['all', 'document', 'image', 'video', 'audio'];
    return paths.includes(route.params.type as AssetType);
  },
});

const route = useRoute();
const router = useRouter();
const assetStore = useAssetStore();
const toast = useToast();

const assetType = ref<AssetType>((route.params.type as AssetType) || 'all');

const mediaTitle = computed(() => {
  const types = {
    all: 'All Media',
    document: 'Documents',
    image: 'Images',
    video: 'Videos',
    audio: 'Audios',
  } as const;
  return types[assetType.value as keyof typeof types] || 'Media';
});

const assets = computed(() => assetStore.getAssetsByType(assetType.value));
const pagination = computed(() =>
  assetStore.getPaginationByType(assetType.value)
);
const isLoading = computed(() => assetStore.isLoadingType(assetType.value));
const error = computed(() => assetStore.getErrorByType(assetType.value));

const handleBack = () => {
  router.push('/media');
};

const handleRefresh = async () => {
  try {
    await assetStore.refreshAssetsByType(assetType.value);
  } catch (err) {
    console.error('Error refreshing assets:', err);
  }
};

const handleAssetTypeChange = async (type: string) => {
  router.push(`/media/${type}`);
};

const handleLoadMore = async () => {
  try {
    await assetStore.loadMoreAssetsByType(assetType.value);
  } catch (err) {
    console.error('Error loading more assets:', err);
  }
};

const handleDelete = async (id: string) => {
  try {
    const key = `type-${assetType.value}`;
    await assetStore.deleteAsset(key, id);
    toast.success('Asset deleted successfully');
  } catch (err) {
    console.error('Error deleting asset:', err);
    toast.error('Failed to delete asset');
  }
};

watch(assetType, async (newType) => {
  if (assets.value.length === 0) {
    await assetStore.loadAssetsByType(newType);
  }
});

onMounted(async () => {
  try {
    if (assets.value.length === 0) {
      await assetStore.loadAssetsByType(assetType.value);
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
    :selected-asset-type="assetType"
    :loading-message="`Loading ${mediaTitle}...`"
    @back="handleBack"
    @refresh="handleRefresh"
    @asset-type-change="handleAssetTypeChange"
    @load-more="handleLoadMore"
    @delete="handleDelete"
  />
</template>
