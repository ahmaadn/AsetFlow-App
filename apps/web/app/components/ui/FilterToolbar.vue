<script setup lang="ts">
export interface FilterToolbarProps {
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Whether to show search input */
  showSearch?: boolean;
  /** Item count to display */
  itemCount?: number;
  /** Item count label (e.g., "Items", "Folders", "Files") */
  itemLabel?: string;
  /** Whether to show item count */
  showItemCount?: boolean;
}

withDefaults(defineProps<FilterToolbarProps>(), {
  searchPlaceholder: 'Search...',
  showSearch: true,
  itemCount: 0,
  itemLabel: 'Items',
  showItemCount: true,
});

const searchQuery = defineModel<string>('search', { default: '' });

defineSlots<{
  /** Slot for left side content (e.g., filter buttons, sort buttons) */
  left?: () => void;
  /** Slot for right side content (e.g., view mode tabs, actions) */
  right?: () => void;
  /** Slot to replace the search input entirely */
  search?: () => void;
  /** Slot for content before search */
  'prepend-search'?: () => void;
  /** Slot for content after search */
  'append-search'?: () => void;
}>();
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 md:items-center">
    <!-- Search Section -->
    <div v-if="showSearch || $slots.search" class="flex-1 md:flex-none">
      <slot name="prepend-search" />

      <slot name="search">
        <label class="input w-full md:min-w-72">
          <Icon name="ri:search-line" class="h-[1em] opacity-50" />
          <input
            v-model="searchQuery"
            type="text"
            class="grow"
            :placeholder="searchPlaceholder"
          />
        </label>
      </slot>

      <slot name="append-search" />
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex items-center justify-between py-1 flex-wrap gap-4">
      <!-- Left Side Slot -->
      <div class="flex items-center gap-4">
        <slot name="left" />
      </div>

      <!-- Right Side Slot -->
      <div class="flex items-center divide-x divide-base-300 gap-x-4">
        <!-- Item Count -->
        <p v-if="showItemCount" class="text-sm text-base-content/80 pr-4">
          {{ itemCount }} {{ itemLabel }}
        </p>

        <slot name="right" />
      </div>
    </div>
  </div>
</template>
