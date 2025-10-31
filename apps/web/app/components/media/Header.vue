<script setup lang="ts">
type ViewMode = 'grid' | 'list';
type AssetType = 'all' | 'image' | 'video' | 'document' | 'audio';

interface Props {
  defaultViewMode?: ViewMode;
  defaultAssetType?: AssetType;
  defaultSearchQuery?: string;
}

const props = withDefaults(defineProps<Props>(), {
  defaultViewMode: 'list',
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

const handleAssetTypeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const type = target.value as AssetType;
  selectedAssetType.value = type;
  emit('assetTypeChange', type);
};

// Debounce search untuk performa lebih baik
const debouncedSearch = useDebounceFn((query: string) => {
  emit('search', query);
}, 300);

const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchQuery.value = target.value;
  debouncedSearch(target.value);
};
</script>

<template>
  <UiHeader>
    <template #left>
      <div class="flex items-center gap-x-2">
        <button
          class="btn btn-sm btn-square btn-ghost"
          title="Back"
          @click="handleBack"
        >
          <Icon
            name="ri:arrow-left-line"
            class="size-5 opacity-80 hover:opacity-100"
          />
        </button>

        <button
          class="btn btn-sm btn-square btn-ghost"
          title="Refresh"
          @click="handleRefresh"
        >
          <Icon
            name="ri:restart-line"
            class="size-5 opacity-80 hover:opacity-100"
          />
        </button>
        <div role="tablist" class="tabs tabs-box tabs-sm">
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
    </template>
    <template #right>
      <div class="flex items-center space-x-4">
        <select
          v-model="selectedAssetType"
          class="select w-36"
          @change="handleAssetTypeChange"
        >
          <option value="all">All</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
          <option value="audio">Audio</option>
        </select>

        <label class="input w-72">
          <Icon name="ri:search-line" class="size-5 opacity-50" />
          <input
            v-model="searchQuery"
            type="search"
            class="grow"
            placeholder="Search"
            @input="handleSearch"
          />
        </label>
      </div>
    </template>
  </UiHeader>
</template>
