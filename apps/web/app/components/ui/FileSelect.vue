<script setup lang="ts">
const props = defineProps({
  maxSize: { type: Number, default: 10 * 1024 * 1024 }, // 10MB
  accepts: { type: Array as PropType<string[]>, default: () => ['image/*'] },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: File[] | null): void;
}>();

const selectedFiles = ref<File[]>();
const dropZoneRef = ref<HTMLDivElement>();

const { files, open } = useFileDialog({
  accept: '*/*',
  directory: false,
  multiple: true,
});

function validateFile(file: File) {
  // validasi ukuran file
  if (file.size > props.maxSize) {
    // You can use your own notification system here
    alert(
      `File ${file.name} exceeds the maximum size of ${props.maxSize} bytes.`
    );
    return false;
  }

  //   validasi tipe file
  if (props.accepts.length > 0 && !props.accepts.includes('*/*')) {
    const isValidType = props.accepts.some((type) => {
      if (type.endsWith('/*')) {
        // handle wildcard, misal image/*
        const mainType = type.split('/')[0];
        return file.type.startsWith(mainType + '/');
      }
      return file.type === type;
    });
    if (!isValidType) {
      alert(`File ${file.name} is not an accepted file type.`);
      return false;
    }
  }

  return true;
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
      <Icon name="ri:upload-cloud-2-line" class="h-12 w-12 text-primary" />
      <p class="text-neutral/60 text-center">
        <span class="font-semibold text-primary">Klik untuk memilih file</span>
        atau seret dan letakkan di sini
      </p>
      <p class="text-xs text-slate-500">
        Maksimum ukuran file: {{ formatSize(props.maxSize) }}
      </p>
      <div
        role="button"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        @click="open()"
      />
    </div>
  </div>
</template>
