<script setup lang="ts">
import type { AssetResponse } from '@asetflow/shared-types';

interface Props {
  assets?: AssetResponse[];
}

const { assets = [] } = defineProps<Props>();
const route = useRoute();
const folderId = ref(route.params.id);

const onClickUpload = () => {
  const url = '/media/add';
  if (folderId.value) {
    navigateTo(url + '?folderId=' + folderId.value);
    return;
  }
  navigateTo('/media/add');
};
</script>

<template>
  <div class="flex-1 overflow-y-auto rounded-lg">
    <div
      v-if="assets.length > 0"
      class="flex flex-col md:grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <template v-for="asset in assets" :key="asset.id">
        <slot :asset="asset" />
      </template>
    </div>

    <UiEmptyState
      v-else
      size="md"
      title="No Assets Found"
      description="This folder is empty. Upload some assets to get started."
      icon="ri:folder-open-line"
      :actions="[
        {
          text: 'Upload Assets',
          variant: 'primary',
          onClick: onClickUpload,
        },
      ]"
    ></UiEmptyState>
  </div>
</template>
