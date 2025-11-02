<script setup lang="ts">
import type { AssetResponse } from '@asetflow/shared-types';

const { assets = [] } = defineProps<{ assets?: AssetResponse[] }>();
</script>

<template>
  <div class="flex-1 overflow-y-auto rounded-lg">
    <div
      v-if="assets.length > 0"
      class="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4"
    >
      <template v-for="asset in assets" :key="asset.id">
        <slot :asset="asset" />
      </template>
    </div>

    <!-- Empty State -->
    <div v-else class="flex h-full flex-col items-center justify-center p-8">
      <Icon
        name="ri:folder-open-line"
        class="mb-4 h-24 w-24 text-base-content/20"
      />
      <p class="text-lg font-medium text-base-content/60">No Assets Found</p>
      <p class="text-sm text-base-content/40">
        This folder is empty. Upload some assets to get started.
      </p>
    </div>
  </div>
</template>
