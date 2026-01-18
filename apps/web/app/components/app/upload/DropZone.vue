<script setup lang="ts">
import {
  formatSize,
  MAX_UPLOAD_SIZE_BYTES,
  validateAssets,
} from '@asetflow/shared';

const emit = defineEmits<{
  (e: 'update:modelValue', value: File[] | null): void;
}>();

const selectedFiles = ref<File[]>();
const dropZoneRef = ref<HTMLDivElement>();
const toast = useToast();

const { files, open } = useFileDialog({
  accept: '*/*',
  directory: false,
  multiple: true,
});

function validateFile(file: File) {
  try {
    validateAssets(file);
    return true;
  } catch (error) {
    toast.error((error as Error).message);
    return false;
  }
}

function handleFileDrop(files: File[] | FileList | null) {
  if (files) {
    const validFiles = Array.from(files).filter((file) => validateFile(file));
    selectedFiles.value = validFiles;

    // emit hanya file yang valid
    if (validFiles.length > 0) {
      emit('update:modelValue', validFiles);
    } else {
      emit('update:modelValue', []);
    }
  } else {
    selectedFiles.value = [];
    emit('update:modelValue', []);
  }
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop: handleFileDrop,
  multiple: true,
  preventDefaultForUnhandled: false,
});

watch(files, (newFiles) => handleFileDrop(newFiles));
</script>

<template>
  <div
    ref="dropZoneRef"
    class="relative border-neutral/30 border-2 border-dashed rounded-lg p-12 text-center transition-colors"
    :class="{
      'border-primary bg-primary/5': isOverDropZone,
      'border-neutral/30 hover:border-primary/50': !isOverDropZone,
    }"
  >
    <div class="flex flex-col items-center justify-center space-y-4">
      <Icon name="ri:upload-cloud-2-line" class="h-12 w-12 text-primary" />
      <div>
        <p class="text-base font-medium text-base-content mb-1">
          Drag and drop files here
        </p>
        <p class="text-sm text-base-content/60">
          or
          <button
            class="link link-primary font-medium"
            type="button"
            @click="open()"
          >
            browse files
          </button>
          from your computer
        </p>
      </div>
      <p class="text-xs text-base-content/50">
        Maksimum ukuran file: {{ formatSize(MAX_UPLOAD_SIZE_BYTES) }}
      </p>
      <div
        role="button"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        @click="open()"
      />
    </div>
  </div>
</template>
