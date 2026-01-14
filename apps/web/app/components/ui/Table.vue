<script setup lang="ts" generic="T extends Record<string, any>">
type ColumnType<TRow = Record<string, unknown>> = {
  key: keyof TRow | string;
  label: string;
  sortable?: boolean;
  width?: string;
};

interface Props<TRow extends Record<string, unknown>> {
  columns: ColumnType<TRow>[];
  rows: TRow[];
  rowKey?: keyof TRow;
  loading?: boolean;
  emptyMessage?: string;
  selectedRowKey?: string | number | null;
  customSort?: (
    rows: TRow[],
    key: keyof TRow | string,
    dir: 'asc' | 'desc'
  ) => TRow[];
  disableInternalSort?: boolean;
}

interface Emits {
  'row-click': [row: T];
  'double-click': [row: T];
  'sort-change': [key: string | null, dir: 'asc' | 'desc' | null];
}

const props = withDefaults(defineProps<Props<T>>(), {
  rowKey: 'id' as keyof T,
  loading: false,
  emptyMessage: 'No data available.',
  selectedRowKey: null,
  customSort: undefined,
  disableInternalSort: false,
});

const emit = defineEmits<Emits>();

const sortKey = ref<keyof T | string | null>(null);
const sortDir = ref<'asc' | 'desc' | null>(null);

const sortedRows = computed<T[]>(() => {
  if (props.disableInternalSort || !sortKey.value || !sortDir.value) {
    return props.rows;
  }

  const key = sortKey.value as keyof T;

  if (props.customSort) {
    return props.customSort(props.rows, key, sortDir.value);
  }

  const multiplier = sortDir.value === 'asc' ? 1 : -1;

  return [...props.rows].sort((a: T, b: T): number => {
    const valueA = a[key];
    const valueB = b[key];

    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return (valueA - valueB) * multiplier;
    }

    // @ts-expect-error This is valid
    if (valueA instanceof Date && valueB instanceof Date) {
      return (valueA.getTime() - valueB.getTime()) * multiplier;
    }

    const stringA = String(valueA).toLowerCase();
    const stringB = String(valueB).toLowerCase();

    return stringA.localeCompare(stringB) * multiplier;
  });
});

function onHeaderClick(col: ColumnType<T>): void {
  if (!col.sortable) return;

  if (sortKey.value !== col.key) {
    sortKey.value = String(col.key);
    sortDir.value = 'asc';
  } else {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : null;
    if (!sortDir.value) sortKey.value = null;
  }

  emit('sort-change', sortKey.value, sortDir.value);
}

function getRowKey(row: T): string | number {
  const key = row[props.rowKey as keyof T];
  return typeof key === 'string' || typeof key === 'number' ? key : String(key);
}

function getSortIcon(columnKey: keyof T | string): string {
  if (sortKey.value !== columnKey) return 'ri:arrow-up-down-line';
  return sortDir.value === 'asc'
    ? 'ri:arrow-up-double-line'
    : 'ri:arrow-down-double-line';
}

function getSortIconClass(columnKey: keyof T | string): string {
  const isActive = sortKey.value === columnKey;
  return isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-60';
}
</script>

<template>
  <div class="overflow-auto relative rounded-lg">
    <table class="table w-full table-md">
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
        <template v-if="props.loading && props.rows.length === 0">
          <tr v-for="i in 5" :key="`skeleton-${i}`" class="animate-pulse">
            <td v-for="col in props.columns" :key="col.key">
              <slot :name="`skeleton-${String(col.key)}`">
                <div class="h-4 bg-base-300 rounded-md w-full"></div>
              </slot>
            </td>
          </tr>
        </template>
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
                    <p class="font-normal text-neutral/60">
                      No data available.
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
            :class="{
              'bg-base-200': props.selectedRowKey === getRowKey(row),
            }"
            @click="emit('row-click', row)"
            @dblclick="emit('double-click', row)"
          >
            <td v-for="col in props.columns" :key="col.key">
              <slot
                :name="`cell-${String(col.key)}`"
                :row="row"
                :value="row[col.key]"
              >
                {{ row[col.key] ?? '-' }}
              </slot>
            </td>
          </tr>
        </template>
        <slot name="last-row" />
      </tbody>
    </table>
  </div>
</template>
