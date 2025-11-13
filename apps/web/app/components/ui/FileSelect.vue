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
    class="relative p-6 rounded-lg border-2 border-dashed border-base-300 transition-colors"
    :class="{
      'bg-base-200 border-neutral/60': isOverDropZone,
      'hover:border-neutral/60 cursor-pointer': !isOverDropZone,
    }"
  >
    <div class="flex flex-col items-center justify-center space-y-4">
      <Icon name="ri:file-upload-line" class="h-12 w-12 text-primary" />
      <p class="text-neutral/60 text-center">
        <span class="font-semibold text-primary">Klik untuk memilih file</span>
        atau seret dan letakkan di sini
      </p>
      <p class="text-xs text-slate-500">
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
