<script setup lang="ts">
interface Props {
  show: boolean;
  hasError: boolean;
  isUploading: boolean;
  length: number;
}

interface Emits {
  upload: [];
  clearAll: [];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const modal = useModal();

const handleClearAll = async () => {
  const confirm = await modal.timer({
    title: 'Remove File',
    message: 'Are you sure you want to remove all files from staging?',
    variant: 'error',
    confirmText: 'Remove',
    cancelText: 'Cancel',
  });

  if (confirm) {
    emit('clearAll');
  }
};
</script>

<template>
  <section v-if="props.show" id="staging-section">
    <div class="flex items-center justify-between mb-2">
      <div>
        <h2 class="text-lg font-semibold text-base-content">
          Langkah 3: Tinjau & Unggah
        </h2>
        <p class="text-sm text-base-content/60">
          Periksa dan edit informasi file sebelum mengunggah.
        </p>
      </div>
      <div class="badge badge-primary">
        {{ props.length }} file{{ props.length > 1 ? 's' : '' }}
      </div>
    </div>
    <div class="space-y-4 mt-4">
      <div class="space-y-4">
        <slot></slot>
      </div>
    </div>
    <div v-if="props.hasError" class="alert alert-warning mt-4">
      <Icon name="ri:error-warning-line" class="size-5" />
      <span>Harap perbaiki semua error sebelum mengunggah</span>
    </div>
    <div class="mt-6 flex gap-4">
      <button
        class="btn btn-outline btn-error flex-1"
        :disabled="props.isUploading"
        @click="handleClearAll"
      >
        <Icon name="ri:delete-bin-line" class="size-5" />
        <span>Clear All</span>
      </button>
      <button
        class="btn btn-primary flex-1"
        :disabled="props.hasError || props.length === 0 || props.isUploading"
        @click="emit('upload')"
      >
        <span
          v-if="props.isUploading"
          class="loading loading-spinner loading-sm"
        />
        <Icon v-else name="ri:upload-cloud-2-line" class="size-5" />
        <span>{{
          props.isUploading ? 'Uploading...' : `Unggah ${props.length} Asset`
        }}</span>
      </button>
    </div>
  </section>
</template>
