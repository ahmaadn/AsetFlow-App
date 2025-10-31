<script setup lang="ts">
import { ref, computed } from 'vue';

type ColumnType = {
  key: string;
  label: string;
  sortable?: boolean;
};

type RowType = Record<string, unknown>;

interface Props {
  columns: ColumnType[];
  rows: RowType[];
  rowKey?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  loading: false,
});

const emit = defineEmits<{
  (e: 'row-click', row: RowType): void;
  (e: 'sort-change', key: string | null, dir: 'asc' | 'desc' | null): void;
}>();

const sortKey = ref<string | null>(null);
const sortDir = ref<'asc' | 'desc' | null>(null);

function onHeaderClick(col: { key: string; sortable?: boolean }) {
  // cek apakah kolom dapat diurutkan
  if (!col.sortable) return;

  // jika kolom yang diklik berbeda dari kolom saat ini, atur ke kolom baru dan urutkan naik
  if (sortKey.value !== col.key) {
    sortKey.value = col.key;
    sortDir.value = 'asc';
  } else {
    // jika kolom yang sama diklik lagi, ubah arah urutan dari: asc -> desc -> none
    if (sortDir.value === 'asc') sortDir.value = 'desc';
    else if (sortDir.value === 'desc') {
      sortKey.value = null;
      sortDir.value = null;
    } else sortDir.value = 'asc';
  }

  // emit perubahan urutan
  emit('sort-change', sortKey.value, sortDir.value);
}

const sortedRows = computed(() => {
  // jika tidak ada kolom yang diurutkan, kembalikan baris asli
  if (!sortKey.value) return props.rows;

  // urutkan baris berdasarkan kolom dan arah yang dipilih
  // jika kolom yang diurutkan adalah string, urutkan secara alfabetis
  const key = sortKey.value;
  const dir = sortDir.value === 'asc' ? 1 : -1;
  return [...props.rows].sort((a, b) => {
    const A = a[key];
    const B = b[key];
    if (A == null) return 1;
    if (B == null) return -1;

    // jika kolom yang diurutkan adalah angka, urutkan secara numerik
    if (typeof A === 'number' && typeof B === 'number') return (A - B) * dir;

    // default: urutkan sebagai string (case insensitive)
    const aS = String(A).toLowerCase();
    const bS = String(B).toLowerCase();
    if (aS < bS) return -1 * dir;
    if (aS > bS) return 1 * dir;
    return 0;
  });
});

function onRowClick(row: RowType) {
  emit('row-click', row);
}
</script>

<template>
  <div class="overflow-x-auto relative">
    <table class="table w-full">
      <thead>
        <slot name="first-head-row" />
        <tr>
          <th
            v-for="col in props.columns"
            :key="col.key"
            class="cursor-pointer select-none"
            @click="onHeaderClick(col)"
          >
            <div class="flex items-center gap-1">
              <span>{{ col.label }}</span>
              <span
                v-if="col.sortable"
                class="text-sm flex items-center"
                :class="{
                  'opacity-40 hover:opacity-60': !sortDir,
                  'opacity-60 hover:opacity-80': sortDir,
                }"
              >
                <span v-if="sortKey === col.key" class="contents">
                  <Icon
                    v-if="sortDir === 'asc'"
                    name="ri:arrow-up-double-line"
                  />
                  <Icon
                    v-else-if="sortDir === 'desc'"
                    name="ri:arrow-down-double-line"
                  />
                </span>
                <Icon v-else name="ri:arrow-up-down-line" />
              </span>
            </div>
          </th>
        </tr>
        <slot name="last-head-row" />
      </thead>
      <tbody>
        <slot name="first-row" />
        <template v-if="props.rows.length === 0">
          <tr>
            <td :colspan="props.columns.length" class="text-center py-4">
              <slot name="no-data">
                <div
                  class="h-32 flex items-center justify-center border border-dashed border-neutral/30 rounded-md"
                >
                  <p class="text-sm font-normal">No data available.</p>
                </div>
              </slot>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr
            v-for="row in sortedRows"
            :key="row[props.rowKey || 'id']"
            class="hover:cursor-pointer hover:bg-base-300"
            @click="onRowClick(row)"
          >
            <td v-for="col in props.columns" :key="col.key">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
        </template>
        <slot name="last-row" />
      </tbody>
    </table>
    <template v-if="props.loading">
      <slot name="loading-overlay">
        <div class="absolute inset-0 bg-neutral/10">
          <div
            class="flex items-center justify-center h-full font-medium gap-x-2"
          >
            <Icon name="ri:loader-5-line" class="animate-spin size-10" />
            <span>Loading...</span>
          </div>
        </div>
      </slot>
    </template>
  </div>
</template>
