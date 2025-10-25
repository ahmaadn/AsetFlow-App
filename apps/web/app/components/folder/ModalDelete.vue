<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    folderName?: string;
    confirmText?: string;
    teleportTo?: string | HTMLElement | null;
  }>(),
  {
    folderName: 'Laporan Bulanan',
    confirmText: 'Confirm',
    teleportTo: '#modal-container',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm' | 'cancel'): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

const input = ref('');

const isDeleteEnabled = computed(
  () => input.value.trim() === props.confirmText
);

function close() {
  isOpen.value = false;
  input.value = '';
}

function onCancel() {
  emit('cancel');
  close();
}

function onDelete() {
  if (!isDeleteEnabled.value) return;
  emit('confirm');
  close();
}
</script>

<template>
  <ModalContainer v-model="isOpen" :teleport-to="props.teleportTo">
    <ModalTitle>Hapus Folder</ModalTitle>

    <ModalContent>
      <p>
        Apakah Anda yakin ingin menghapus folder
        <span id="folder-name" class="font-semibold text-base-content/100">
          {{ props.folderName }}</span
        >? Semua aset di dalamnya akan dipindahkan ke "Uncategorized". Tindakan
        ini tidak dapat dibatalkan.
      </p>

      <fieldset class="fieldset mt-4">
        <legend class="fieldset-legend text-base font-medium">
          Please type
          <span id="folder-slug" class="text-error">{{
            props.confirmText
          }}</span>
          to complete action
        </legend>
        <input
          v-model="input"
          type="text"
          class="input w-full input-sm,"
          placeholder="ketik di sini"
        />
      </fieldset>
      <ModalAction>
        <button class="btn" @click="onCancel">Cancel</button>
        <button
          class="btn btn-error"
          :disabled="!isDeleteEnabled"
          @click="onDelete"
        >
          Delete
        </button>
      </ModalAction>
    </ModalContent>
  </ModalContainer>
</template>
