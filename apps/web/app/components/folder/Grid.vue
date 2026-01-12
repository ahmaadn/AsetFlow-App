<script setup lang="ts">
import type { FolderItemType } from '@asetflow/shared-types';
import type { AssetPreview } from './Card.vue';

export interface FolderWithPreviews extends FolderItemType {
  /** Asset previews for this folder */
  previews?: AssetPreview[];
  /** Total folder size */
  size?: string;
}

defineProps<{
  folders: FolderWithPreviews[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  click: [folder: FolderItemType];
  'double-click': [folder: FolderItemType];
  'menu-click': [folder: FolderItemType, event: MouseEvent];
}>();
</script>

<template>
  <div class="folder-grid">
    <!-- Grid Container -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <template v-if="loading && folders.length === 0">
        <!-- Loading Skeletons -->
        <FolderCardSkeleton v-for="i in 8" :key="`skeleton-${i}`" />
      </template>

      <template v-else>
        <FolderCard
          v-for="folder in folders"
          :key="folder.id"
          :folder="folder"
          :previews="folder.previews"
          @click="emit('click', folder)"
          @double-click="emit('double-click', folder)"
          @menu-click="(f, e) => emit('menu-click', f, e)"
        />
      </template>
    </div>

    <!-- Loading more indicator -->
    <div
      v-if="loading && folders.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4"
    >
      <FolderCardSkeleton v-for="i in 4" :key="`loading-more-${i}`" />
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && folders.length === 0"
      class="flex flex-col items-center justify-center py-16 text-base-content/60"
    >
      <Icon name="ri:folder-line" class="size-16 opacity-30 mb-4" />
      <p class="text-lg font-medium">No folders found</p>
      <p class="text-sm">Create a new folder to get started</p>
    </div>
  </div>
</template>
