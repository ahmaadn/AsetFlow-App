<script setup lang="ts">
defineProps<{
  show: boolean;
  folderName: string;
  folderId: string;
}>();

const emit = defineEmits<{
  close: [];
  reset: [];
  navigate: [];
}>();
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div v-if="show" class="fixed bottom-6 right-6 z-50 left-6">
      <div class="alert shadow-lg">
        <Icon name="ri:checkbox-circle-line" class="size-6" />
        <div class="flex-1">
          <h3 class="font-semibold">Upload Berhasil!</h3>
          <p class="text-sm opacity-90">
            Asset telah berhasil diunggah ke folder
            <span class="font-medium">{{ folderName }}</span>
          </p>
        </div>
        <div class="flex flex-col gap-2 pr-8">
          <button class="btn btn-sm btn-success" @click="emit('navigate')">
            <Icon name="ri:folder-open-line" class="size-4" />
            Lihat Folder
          </button>
          <button class="btn btn-sm btn-ghost" @click="emit('reset')">
            Upload Lagi
          </button>
        </div>
        <button
          class="btn btn-sm btn-square btn-ghost absolute top-2 right-2"
          @click="emit('close')"
        >
          <Icon name="ri:close-line" class="size-4" />
        </button>
      </div>
    </div>
  </Transition>
</template>
