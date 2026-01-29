<script setup lang="ts">
import type { AssetResponse } from '@asetflow/shared-types';

interface Props {
  assets?: AssetResponse[];
}

const { assets = [] } = defineProps<Props>();
const route = useRoute();
const folderId = ref(route.params.id);

const onClickUpload = () => {
  const url = '/assets/create';
  if (folderId.value) {
    navigateTo(url + '?folderId=' + folderId.value);
    return;
  }
  navigateTo('/assets/create');
};
</script>

<template>
  <div class="rounded-lg">
    <div
      v-if="assets.length > 0"
      class="grid gap-2 p-2 sm:gap-4 sm:p-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
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
