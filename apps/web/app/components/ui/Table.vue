<script setup lang="ts">
import { ref, computed } from 'vue';

type ColumnType = {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
};

type RowType = Record<string, unknown>;

interface Props {
  columns: ColumnType[];
  rows: RowType[];
  rowKey?: string;
  loading?: boolean;
  emptyMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  loading: false,
  emptyMessage: 'No data available.',
});

const emit = defineEmits<{
  (e: 'row-click', row: RowType): void;
  (e: 'sort-change', key: string | null, dir: 'asc' | 'desc' | null): void;
}>();

const sortKey = ref<string | null>(null);
const sortDir = ref<'asc' | 'desc' | null>(null);

function onHeaderClick(col: ColumnType): void {
  if (!col.sortable) return;

  if (sortKey.value !== col.key) {
    sortKey.value = col.key;
    sortDir.value = 'asc';
  } else {
    switch (sortDir.value) {
      case 'asc':
        sortDir.value = 'desc';
        break;
      case 'desc':
        sortKey.value = null;
        sortDir.value = null;
        break;
      default:
        sortDir.value = 'asc';
    }
  }

  emit('sort-change', sortKey.value, sortDir.value);
}

const sortedRows = computed(() => {
  if (!sortKey.value || !sortDir.value) return props.rows;

  const key = sortKey.value;
  const multiplier = sortDir.value === 'asc' ? 1 : -1;

  return [...props.rows].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    // Handle null/undefined values
    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    // Numeric comparison
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return (valueA - valueB) * multiplier;
    }

    // Date comparison
    if (valueA instanceof Date && valueB instanceof Date) {
      return (valueA.getTime() - valueB.getTime()) * multiplier;
    }

    // String comparison (case-insensitive)
    const stringA = String(valueA).toLowerCase();
    const stringB = String(valueB).toLowerCase();

    return stringA.localeCompare(stringB) * multiplier;
  });
});

function onRowClick(row: RowType): void {
  emit('row-click', row);
}

function getRowKey(row: RowType): string | number {
  const key = row[props.rowKey];
  return typeof key === 'string' || typeof key === 'number' ? key : String(key);
}

function getSortIcon(columnKey: string): string {
  if (sortKey.value !== columnKey) {
    return 'ri:arrow-up-down-line';
  }
  return sortDir.value === 'asc'
    ? 'ri:arrow-up-double-line'
    : 'ri:arrow-down-double-line';
}

function getSortIconClass(columnKey: string): string {
  const isActive = sortKey.value === columnKey;
  return isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-60';
}
</script>

<template>
  <div class="overflow-x-auto relative rounded-lg">
    <table class="table w-full">
      <thead>
        <slot name="first-head-row" />
        <tr>
          <th
            v-for="col in props.columns"
            :key="col.key"
            :class="[
              col.sortable ? 'cursor-pointer select-none group' : '',
              col.width ? `w-[${col.width}]` : '',
            ]"
            :aria-sort="
              sortKey === col.key
                ? sortDir === 'asc'
                  ? 'ascending'
                  : 'descending'
                : undefined
            "
            @click="col.sortable ? onHeaderClick(col) : undefined"
          >
            <div class="flex items-center gap-2">
              <span class="font-semibold">{{ col.label }}</span>
              <span
                v-if="col.sortable"
                class="text-sm flex items-center transition-opacity"
                :class="getSortIconClass(col.key)"
                aria-hidden="true"
              >
                <Icon :name="getSortIcon(col.key)" />
              </span>
            </div>
          </th>
        </tr>
        <slot name="last-head-row" />
      </thead>
      <tbody>
        <slot name="first-row" />
        <template v-if="props.rows.length === 0 && !props.loading">
          <tr>
            <td :colspan="props.columns.length" class="text-center py-4">
              <slot name="no-data">
                <div
                  class="h-32 flex items-center justify-center border border-dashed border-neutral/30 rounded-md"
                >
                  <div class="text-center">
                    <Icon
                      name="ri:inbox-line"
                      class="size-12 mx-auto mb-2 opacity-40"
                    />
                    <p class="font-normal text-neutral-content/60">
                      {{ props.emptyMessage }}
                    </p>
                  </div>
                </div>
              </slot>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr
            v-for="row in sortedRows"
            :key="getRowKey(row)"
            class="hover:cursor-pointer hover:bg-base-300 transition-colors"
            @click="onRowClick(row)"
          >
            <td v-for="col in props.columns" :key="col.key">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] ?? '-' }}
              </slot>
            </td>
          </tr>
        </template>
        <slot name="last-row" />
      </tbody>
    </table>
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="props.loading"
        class="absolute inset-0 bg-base-100/80 backdrop-blur-sm"
        role="status"
        aria-live="polite"
      >
        <slot name="loading-overlay">
          <div
            class="flex items-center justify-center h-full font-medium gap-x-2"
          >
            <Icon name="ri:loader-5-line" class="animate-spin size-10" />
            <span>Loading...</span>
          </div>
        </slot>
      </div>
    </Transition>
  </div>
</template>
