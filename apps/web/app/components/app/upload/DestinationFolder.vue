<script setup lang="ts">
type FolderOption = {
  label: string;
  value: string;
  slug?: string;
  [key: string]: unknown;
};

interface Props {
  folders: FolderOption[];
}

interface Emits {
  addFolder: [];
}

const model = defineModel<FolderOption | null>();
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedPath = computed(() => {
  if (!model.value) return 'Select a folder';

  // Parse path jika ada (e.g., "Projects > Marketing > 2024")
  return model.value.label;
});
</script>
<template>
  <div class="space-y-2">
    <label
      class="text-sm font-medium text-base-content/70 flex items-center gap-2"
    >
      <Icon name="ri:folder-line" class="size-4" />
      DESTINATION FOLDER
    </label>
    <div class="flex items-center gap-2">
      <select
        v-model="model"
        class="select select-bordered flex-1"
        :class="{ 'select-error': !model }"
      >
        <option :value="null" disabled>Select destination folder</option>
        <option
          v-for="folder in props.folders"
          :key="folder.value"
          :value="folder"
        >
          {{ folder.label }}
        </option>
      </select>
      <button
        class="btn btn-ghost btn-square"
        title="Add new folder"
        @click="emit('addFolder')"
      >
        <Icon name="ri:add-line" class="size-5" />
      </button>
    </div>
    <p class="text-xs text-base-content/50">
      Selected: <span class="font-medium">{{ selectedPath }}</span>
    </p>
  </div>
</template>
