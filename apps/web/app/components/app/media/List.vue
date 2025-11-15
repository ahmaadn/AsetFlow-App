<script setup lang="ts">
import {
  formatDisplayDate,
  formatSize,
  getAssetTypeFromMime,
  getIconForMimeType,
} from '@asetflow/shared';
import type { AssetResponse } from '@asetflow/shared-types';

interface Props {
  assets?: AssetResponse[];
  selected?: AssetResponse | null;
}

interface Emits {
  'update:selected': [asset: AssetResponse | null];
}

const props = withDefaults(defineProps<Props>(), {
  assets: () => [] as AssetResponse[],
  selected: null,
});

const emit = defineEmits<Emits>();

const selected = computed({
  get: () => props.selected,
  set: (v: AssetResponse | null) => {
    emit('update:selected', v);
  },
});

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'mimeType', label: 'Type', sortable: true },
  { key: 'size', label: 'Size', sortable: true },
  { key: 'createdAt', label: 'Uploaded', sortable: true },
  { key: 'updatedAt', label: 'Updated', sortable: true },
];
</script>

<template>
  <UiTable
    :columns="columns"
    :rows="props.assets"
    class="h-full"
    :selected-row-key="selected?.id"
    row-key="id"
    @row-click="emit('update:selected', $event)"
  >
    <template #cell-name="{ row }">
      <div class="flex items-center gap-3 min-w-md">
        <Icon
          :name="getIconForMimeType(row.mimeType)"
          class="min-h-5 min-w-5 size-5"
        ></Icon>
        <div class="flex-1">
          <div class="font-medium">{{ row.name }}</div>
          <div class="text-xs text-neutral/60">{{ row.slug }}</div>
        </div>
      </div>
    </template>
    <template #cell-mimeType="{ row }">
      {{ getAssetTypeFromMime(row.mimeType) }}
    </template>

    <template #cell-size="{ row }">
      {{ formatSize(row.size) }}
    </template>
    <template #cell-createdAt="{ row }">
      {{ formatDisplayDate(row.createdAt) }}
    </template>
    <template #cell-updatedAt="{ row }">
      {{ formatDisplayDate(row.updatedAt) }}
    </template>
    <slot />
  </UiTable>
</template>
