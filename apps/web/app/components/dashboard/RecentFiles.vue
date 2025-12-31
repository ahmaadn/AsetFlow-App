<script setup lang="ts">
import {
  formatDisplayDate,
  formatSize,
  getIconForMimeType,
} from '@asetflow/shared';
import type { RecentFileType } from '@asetflow/shared-types';

interface Props {
  files?: RecentFileType[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  files: () => [],
  isLoading: false,
});
</script>

<template>
  <div class="card bg-base-100 shadow-md">
    <div class="card-body">
      <h2 class="card-title text-lg flex items-center gap-2">
        <Icon name="ri:file-list-3-line" class="w-5 h-5" />
        Recent Files
      </h2>

      <div v-if="isLoading" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-md text-primary" />
      </div>

      <div v-else-if="props.files.length === 0" class="py-8 text-center">
        <Icon
          name="ri:file-unknow-line"
          class="w-12 h-12 mx-auto text-base-content/30 mb-2"
        />
        <p class="text-sm text-base-content/60">No recent files</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="file in props.files"
          :key="file.id"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors cursor-pointer group"
        >
          <div class="flex-shrink-0">
            <Icon
              :name="getIconForMimeType(file.mimeType)"
              class="w-8 h-8 text-primary"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p
              class="font-medium text-sm truncate group-hover:text-primary transition-colors"
            >
              {{ file.name }}
            </p>
            <p class="text-xs text-base-content/60">
              {{ formatSize(Number(file.size)) }} •
              {{ formatDisplayDate(file.createdAt) }}
            </p>
          </div>
          <div class="flex-shrink-0 inline-flex">
            <Icon
              name="ri:arrow-right-s-line"
              class="w-5 h-5 text-base-content/40 group-hover:text-primary transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
