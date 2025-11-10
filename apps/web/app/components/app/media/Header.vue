<script setup lang="ts">
import type { AssetType, ViewMode } from '~/types';

interface Props {
  defaultViewMode?: ViewMode;
  defaultAssetType?: AssetType;
  defaultSearchQuery?: string;
}

const props = withDefaults(defineProps<Props>(), {
  defaultViewMode: 'grid',
  defaultAssetType: 'all',
  defaultSearchQuery: '',
});

const emit = defineEmits<{
  (e: 'refresh' | 'back'): void;
  (e: 'viewModeChange', mode: ViewMode): void;
  (e: 'assetTypeChange', type: AssetType): void;
  (e: 'search', query: string): void;
}>();

const selectedViewMode = ref<ViewMode>(props.defaultViewMode);
const selectedAssetType = ref<AssetType>(props.defaultAssetType);
const searchQuery = ref(props.defaultSearchQuery);

const handleRefresh = () => {
  emit('refresh');
};

const handleBack = () => {
  emit('back');
};

const handleViewModeChange = (mode: ViewMode) => {
  selectedViewMode.value = mode;
  emit('viewModeChange', mode);
};

const handleAssetTypeChange = () => {
  emit('assetTypeChange', selectedAssetType.value);
};

const handleSearch = () => {
  emit('search', searchQuery.value);
};
</script>

<template>
  <UiHeader>
    <div class="flex items-center space-x-2">
      <button
        class="btn btn-ghost btn-sm btn-square"
        title="Back"
        @click="handleBack"
      >
        <Icon name="ri:arrow-left-line" class="size-5" />
      </button>
      <button
        class="btn btn-ghost btn-sm btn-square"
        title="Refresh"
        @click="handleRefresh"
      >
        <Icon name="ri:restart-line" class="size-5" />
      </button>

      <!-- View Mode Toggle (Desktop only) -->

      <div
        role="tablist"
        class="hidden space-x-1 md:flex tabs tabs-box tabs-sm"
      >
        <a
          role="tab"
          class="tab"
          :class="{ 'tab-active': selectedViewMode === 'grid' }"
          title="Grid view"
          @click="handleViewModeChange('grid')"
        >
          <Icon
            name="ri:layout-grid-line"
            class="size-5"
            :class="selectedViewMode === 'grid' ? '' : 'opacity-50'"
          />
        </a>
        <a
          role="tab"
          class="tab"
          :class="{ 'tab-active': selectedViewMode === 'list' }"
          title="List view"
          @click="handleViewModeChange('list')"
        >
          <Icon
            name="ri:list-check"
            class="size-5"
            :class="selectedViewMode === 'list' ? '' : 'opacity-50'"
          />
        </a>
      </div>
    </div>

    <div class="contents md:flex items-center space-x-4">
      <!-- Asset Type Filter -->
      <select
        v-model="selectedAssetType"
        class="select select-bordered w-full md:w-36"
        @change="handleAssetTypeChange"
      >
        <option value="all">All Types</option>
        <option value="image">Image</option>
        <option value="video">Video</option>
        <option value="document">Document</option>
        <option value="audio">Audio</option>
      </select>

      <!-- Search (Disabled for now) -->
      <label class="input input-bordered w-full md:w-72 md:flex">
        <Icon name="ri:search-line" class="size-5 opacity-50" />
        <input
          v-model="searchQuery"
          type="search"
          class="grow"
          placeholder="Search (coming soon)"
          disabled
          @input="handleSearch"
        />
      </label>
    </div>
  </UiHeader>
</template>
