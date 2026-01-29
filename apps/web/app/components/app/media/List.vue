<script setup lang="ts">
import { formatDisplayDate, formatSize, getExtension } from '@asetflow/shared';
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

// Get file extension from filename or format
function getFileExtension(asset: AssetResponse): string {
  if (asset.format) return asset.format.toUpperCase();
  const ext = getExtension(asset.name);
  return ext ? ext.toUpperCase() : 'FILE';
}

// Badge color based on file extension/type
function getExtensionBadgeClass(ext: string): string {
  const extension = ext.toLowerCase();
  const colorMap: Record<string, string> = {
    // Images
    jpg: 'badge-info',
    jpeg: 'badge-info',
    png: 'badge-success',
    gif: 'badge-warning',
    webp: 'badge-info',
    svg: 'badge-accent',
    // Videos
    mp4: 'badge-primary',
    mkv: 'badge-primary',
    mov: 'badge-primary',
    avi: 'badge-primary',
    webm: 'badge-primary',
    // Audio
    mp3: 'badge-secondary',
    wav: 'badge-secondary',
    ogg: 'badge-secondary',
    flac: 'badge-secondary',
    // Documents
    pdf: 'badge-error',
    doc: 'badge-info',
    docx: 'badge-info',
    xls: 'badge-success',
    xlsx: 'badge-success',
    ppt: 'badge-warning',
    pptx: 'badge-warning',
    txt: 'badge-neutral',
    // Archives
    zip: 'badge-warning',
    rar: 'badge-warning',
    '7z': 'badge-warning',
    tar: 'badge-warning',
    gz: 'badge-warning',
  };

  return colorMap[extension] || 'badge-ghost';
}

const columns = [
  { key: 'preview', label: 'Preview', sortable: false, width: '10px' },
  { key: 'name', label: 'Name', sortable: true },
  {
    key: 'mimeType',
    label: 'Type',
    width: '100px',
    className: 'hidden md:table-cell',
  },
  {
    key: 'size',
    label: 'Size',
    sortable: true,
    width: '100px',
    className: 'hidden lg:table-cell',
  },
  {
    key: 'updatedAt',
    label: 'Last Modified',
    sortable: true,
    width: '150px',
    className: 'hidden xl:table-cell',
  },
];
</script>

<template>
  <UiTable
    :columns="columns"
    :rows="props.assets"
    :selected-row-key="selected?.id"
    row-key="id"
    class="w-full flex-1 h-full bg-base-100 rounded-md"
    @row-click="emit('update:selected', $event)"
  >
    <!-- Preview column -->
    <template #cell-preview="{ row }">
      <AppMediaListPreview :asset="row" />
    </template>

    <!-- Name column -->
    <template #cell-name="{ row }">
      <div class="flex flex-col min-w-0">
        <span class="font-medium text-base-content truncate" :title="row.name">
          {{ row.name }}
        </span>
      </div>
    </template>

    <!-- Type badge column -->
    <template #cell-mimeType="{ row }">
      <span
        class="badge badge-sm font-semibold"
        :class="getExtensionBadgeClass(getFileExtension(row))"
      >
        {{ getFileExtension(row) }}
      </span>
    </template>

    <!-- Size column -->
    <template #cell-size="{ row }">
      <span class="text-base-content/70">{{ formatSize(row.size) }}</span>
    </template>

    <!-- Last Modified column -->
    <template #cell-updatedAt="{ row }">
      <span class="text-base-content/70">
        {{ formatDisplayDate(row.updatedAt) }}
      </span>
    </template>
    <slot />
  </UiTable>
</template>
