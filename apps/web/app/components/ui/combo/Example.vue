<script setup lang="ts">
/**
 * Example: Infinite Scroll Combo Box with Server-Side Pagination
 *
 * This example demonstrates how to use the combo box with infinite scroll
 * for server-side paginated data.
 */

import { useInfiniteScroll } from './useInfiniteScroll';

const selected = ref(null);

// Simulate API call
async function fetchFolders(page: number, pageSize: number, query: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate mock data
  const allData = Array.from({ length: 100 }, (_, i) => ({
    label: `Folder ${i + 1} ${query ? `(${query})` : ''}`,
    value: `folder-${i + 1}`,
    path: `/path/to/folder-${i + 1}`,
  }));

  // Filter by query
  const filtered = query
    ? allData.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : allData;

  // Paginate
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return filtered.slice(start, end);
}

// Use infinite scroll composable
const { items, loading, loadMore, search } = useInfiniteScroll({
  fetchData: fetchFolders,
  pageSize: 20,
  debounceSearch: true,
  debounceDelay: 300,
});

// Load initial data
onMounted(() => {
  loadMore();
});
</script>

<template>
  <div class="space-y-4 p-6">
    <h2 class="text-2xl font-bold">Infinite Scroll Example</h2>

    <div class="max-w-md">
      <label class="label">
        <span class="label-text">Select Folder (with infinite scroll)</span>
      </label>

      <UiComboBox
        v-model="selected"
        :options="items"
        :loading="loading"
        infinite-scroll
        :page-size="20"
        placeholder="Search folders..."
        @load-more="loadMore"
      >
        <template #option="{ option }">
          <div class="flex flex-col">
            <span class="font-medium">{{ option.label }}</span>
            <span class="text-xs text-base-content/60">{{ option.path }}</span>
          </div>
        </template>
      </UiComboBox>

      <div v-if="selected" class="mt-4 p-4 bg-base-200 rounded-lg">
        <p class="text-sm font-medium">Selected:</p>
        <pre class="text-xs mt-2">{{ JSON.stringify(selected, null, 2) }}</pre>
      </div>
    </div>

    <div class="divider" />

    <!-- Simple Example without Server -->
    <div class="max-w-md">
      <label class="label">
        <span class="label-text">Select Item (client-side pagination)</span>
      </label>

      <UiComboBox
        v-model="selected"
        :options="
          Array.from({ length: 200 }, (_, i) => ({
            label: `Item ${i + 1}`,
            value: `item-${i + 1}`,
          }))
        "
        infinite-scroll
        :page-size="30"
        placeholder="Select item..."
      />
    </div>
  </div>
</template>
