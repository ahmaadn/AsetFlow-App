<script setup lang="ts">
import type { ComboBoxOption } from '~/components/ui/combo/state';
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
const selectedAssetType = ref<ComboBoxOption[]>([
  { label: 'All Types', value: props.defaultAssetType || 'all' },
]);
const searchQuery = ref(props.defaultSearchQuery);

const viewTabs = [
  { key: 'grid', label: 'Grid', icon: 'ri:layout-grid-line' },
  { key: 'list', label: 'List', icon: 'ri:list-check' },
];

const buttons = [
  {
    key: 'back',
    label: 'Back',
    icon: 'ri:arrow-left-line',
    action: () => emit('back'),
  },
  {
    key: 'refresh',
    label: 'Refresh',
    icon: 'ri:restart-line',
    action: () => emit('refresh'),
  },
];

const options: ComboBoxOption[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Document', value: 'document' },
  { label: 'Audio', value: 'audio' },
];

const handleViewModeChange = (key: string | number) => {
  const mode = key as ViewMode;
  selectedViewMode.value = mode;
  emit('viewModeChange', mode);
};

// const handleAssetTypeChange = () => {
//   emit('assetTypeChange', selectedAssetType.value);
// };

watch(selectedAssetType, (newVal) => {
  const type = newVal.length === 0 ? 'all' : (newVal[0].value as AssetType);
  emit('assetTypeChange', type);
});
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 md:items-center">
    <div class="flex-1 md:flex-none">
      <label class="input w-full md:min-w-72">
        <Icon name="ri:search-line" class="h-[1em] opacity-50"></Icon>
        <input
          v-model="searchQuery"
          type="text"
          class="grow"
          placeholder="Search folders "
          @input="handleSearch"
        />
      </label>
    </div>
    <div class="flex-1 flex items-center justify-between py-1 flex-wrap">
      <!-- Left side: Item count -->
      <div class="flex items-center gap-4">
        <!-- Filter ComboBox for Tags -->
        <UiComboBox
          v-model="selectedAssetType"
          class="w-auto"
          multiple
          :options="options"
        >
          <template #display="{ modelValue, isOpen, open }">
            <button
              class="btn bg-base-100 btn-sm gap-2"
              :class="{
                'btn-active':
                  isOpen ||
                  (Array.isArray(modelValue) && modelValue.length > 0),
              }"
              @click="open"
            >
              <Icon name="ri:filter-3-line" class="size-4" />
              Filter
              <Icon
                :name="isOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'"
                class="size-4"
              />
            </button>
          </template>
        </UiComboBox>

        <!-- Sort Button -->
        <UiComboBox
          class="w-auto"
          :options="[
            { label: 'Name', value: 'name' },
            { label: 'Date Created', value: 'createdAt' },
            { label: 'Last Modified', value: 'updatedAt' },
          ]"
          @update:model-value="(val: any) => onSortChange(val?.value, 'asc')"
        >
          <template #display="{ modelValue, isOpen, open }">
            <button
              class="btn bg-base-100 btn-sm gap-2"
              :class="{ 'btn-active': isOpen || modelValue }"
              @click="open"
            >
              <Icon name="ri:sort-desc" class="size-4" />
              Sort
              <Icon
                :name="isOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'"
                class="size-4"
              />
            </button>
          </template>
        </UiComboBox>
      </div>

      <!-- Right side: View mode tabs -->
      <div class="flex items-center divide-x divide-base-300 gap-x-4">
        <!-- <p class="text-sm text-base-content/80 pr-4">
          {{ folderState.folders.length }} Items
        </p> -->

        <div class="join">
          <button
            v-for="button in buttons"
            :key="button.key"
            class="btn bg-white btn-sm btn-square join-item"
            :title="button.label"
            @click="button.action"
          >
            <Icon :name="button.icon" class="size-5" />
          </button>
        </div>

        <UiTabs
          v-model="selectedViewMode"
          :tabs="viewTabs"
          variant="box"
          size="sm"
          class-tabs="bg-base-300"
          icon-only
          @update:model-value="handleViewModeChange"
        />
      </div>
    </div>
  </div>
  <!-- <div
    class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 border-b border-base-300"
  >
    <div class="contents md:flex items-center space-x-4">
      <label class="input input-bordered w-full md:w-72 md:flex">
        <Icon name="ri:search-line" class="size-5 opacity-50" />
        <input
          v-model="searchQuery"
          type="search"
          class="grow"
          placeholder="Search (coming soon)"
          @input="handleSearch"
        />
      </label>
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
    </div>
    <div class="flex items-center space-x-2 justify-between md:justify-start">
      <div class="join">
        <button
          v-for="button in buttons"
          :key="button.key"
          class="btn bg-white btn-sm btn-square join-item"
          :title="button.label"
          @click="button.action"
        >
          <Icon :name="button.icon" class="size-5" />
        </button>
      </div>

      <UiTabs
        :model-value="selectedViewMode"
        :tabs="viewTabs"
        variant="box"
        size="sm"
        icon-only
        class-tabs="bg-base-300"
        @update:model-value="handleViewModeChange"
      />
    </div>
  </div> -->
</template>
