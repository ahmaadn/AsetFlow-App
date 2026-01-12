<script setup lang="ts">
import type { FolderItemType } from '@asetflow/shared-types';
import { formatDisplayDate } from '@asetflow/shared';

interface Props {
  folders: FolderItemType[];
  loading?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  click: [folder: FolderItemType];
  'double-click': [folder: FolderItemType];
}>();

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'tags', label: 'Tags' },
  { key: 'updatedAt', label: 'Updated', sortable: true },
  { key: 'assetCount', label: 'Total Assets' },
];
</script>

<template>
  <div class="folder-list">
    <UiTable
      :columns="columns"
      :rows="folders"
      :loading="loading"
      row-key="id"
      class="w-full flex-1 h-full bg-base-100 rounded-md"
      @row-click="(row) => emit('click', row)"
      @double-click="(row) => emit('double-click', row)"
    >
      <template #cell-name="{ row }">
        <div class="flex items-center gap-3 min-w-md">
          <Icon
            name="ri:folder-fill"
            class="min-h-5 min-w-5 size-5 text-amber-500"
          />
          <div class="flex-1">
            {{ row.name }}
          </div>
        </div>
      </template>

      <template #cell-tags="{ row }">
        <div class="flex gap-1 flex-wrap">
          <template v-if="row.tags.length">
            <span
              v-for="tag in row.tags.slice(0, 3)"
              :key="tag.id"
              class="badge badge-sm"
            >
              {{ tag.name }}
            </span>
            <span v-if="row.tags.length > 3" class="badge badge-sm badge-ghost">
              +{{ row.tags.length - 3 }}
            </span>
          </template>
          <span v-else class="text-neutral/80 text-nowrap">No Tags</span>
        </div>
      </template>

      <template #cell-updatedAt="{ row }">
        <div class="text-neutral/80 text-nowrap">
          {{ formatDisplayDate((row as FolderItemType).updatedAt) }}
        </div>
      </template>

      <template #cell-assetCount="{ row }">
        <div class="text-neutral/80 text-nowrap">
          {{ row.assetCount }} Assets
        </div>
      </template>

      <!-- Loading skeleton rows -->
      <template v-if="loading && folders.length > 0" #last-row>
        <tr v-for="i in 3" :key="`loading-${i}`" class="animate-pulse">
          <td v-for="col in columns" :key="col.key">
            <div class="h-4 bg-base-300 rounded-md w-full"></div>
          </td>
        </tr>
      </template>
    </UiTable>
  </div>
</template>
