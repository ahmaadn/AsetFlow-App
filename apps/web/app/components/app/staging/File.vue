<script setup lang="ts">
import { getIconForMimeType, isImageMimeType } from '@asetflow/shared';
import type { StaggingFile } from '~/types';

interface Props {
  modelValue: StaggingFile;
  index: number;
}

const props = defineProps<Props>();
const modal = useModal();

const emit = defineEmits<{
  'update:modelValue': [value: StaggingFile];
  delete: [];
}>();

const localValue = computed({
  get: () => props.modelValue,
  set: (value: StaggingFile) => emit('update:modelValue', value),
});

const hasErrors = computed(() => localValue.value.errors?.length > 0);

function updateField<K extends keyof StaggingFile>(
  field: K,
  value: StaggingFile[K]
) {
  const updated = { ...localValue.value, [field]: value };
  emit('update:modelValue', updated);
}

async function handleDelete() {
  const confirm = await modal.timer({
    title: 'Remove File',
    message: 'Are you sure you want to remove this file from staging?',
    variant: 'error',
    confirmText: 'Remove',
    cancelText: 'Cancel',
  });

  if (confirm) {
    emit('delete');
  }
}
</script>

<template>
  <div
    class="bg-base-100 border rounded-lg p-4 transition-all"
    :class="{
      'border-error': hasErrors,
      'border-base-300': !hasErrors,
    }"
  >
    <div class="flex items-start gap-4">
      <!-- Preview -->
      <div
        class="flex-shrink-0 h-24 w-24 bg-base-200 rounded-lg flex items-center justify-center overflow-hidden shadow-sm"
      >
        <img
          v-if="isImageMimeType(localValue.file.type)"
          :src="localValue.previewUrl"
          :alt="localValue.name"
          class="h-full w-full object-cover"
        />
        <div v-else class="h-full w-full flex items-center justify-center">
          <Icon
            :name="getIconForMimeType(localValue.file.type)"
            class="size-10 text-base-content/40"
          />
        </div>
      </div>

      <!-- Form Fields -->
      <div class="flex-1 space-y-3">
        <!-- Name Input -->
        <div>
          <label class="input w-full">
            <span class="label font-medium w-24 text-neutral">File Name</span>
            <input
              :id="`name-${props.index}`"
              :value="localValue.name"
              type="text"
              class="w-full"
              :class="{ 'input-error': hasErrors }"
              placeholder="Enter file name"
              :name="`name-${props.index}`"
              required
              @input="
                updateField('name', ($event.target as HTMLInputElement).value)
              "
            />
            <span class="label font-medium text-neutral"
              >.{{ localValue.extension }}</span
            >
          </label>
        </div>

        <!-- Slug Input -->
        <div>
          <label class="input w-full">
            <span class="label font-medium w-24 text-neutral">Slug</span>
            <input
              :id="`slug-${props.index}`"
              :value="localValue.slug"
              type="text"
              class="w-full"
              :class="{ 'input-error': hasErrors }"
              placeholder="Enter slug"
              :name="`slug-${props.index}`"
              required
              @input="
                updateField('slug', ($event.target as HTMLInputElement).value)
              "
            />
          </label>
        </div>

        <div class="flex flex-rows gap-4 items-center justify-between">
          <div class="flex items-center gap-2 text-xs text-base-content/60">
            <span>{{ localValue.file.type }}</span>
            <span>&middot;</span>
            <span>{{ localValue.size }}</span>
            <span>&middot;</span>
            <span class="badge badge-sm badge-soft badge-primary">{{
              localValue.assetType
            }}</span>
          </div>
          <div v-if="hasErrors" class="flex flex-wrap gap-1">
            <span
              v-for="(error, errorIndex) in localValue.errors"
              :key="errorIndex"
              class="badge badge-error badge-sm gap-1"
            >
              <Icon name="ri:error-warning-line" class="size-3" />
              {{ error }}
            </span>
          </div>
        </div>
      </div>

      <!-- Delete Button -->
      <button
        type="button"
        class="btn btn-sm btn-square btn-ghost btn-error"
        title="Remove file"
        @click="handleDelete"
      >
        <Icon name="ri:close-line" class="size-5" />
      </button>
    </div>
  </div>
</template>
