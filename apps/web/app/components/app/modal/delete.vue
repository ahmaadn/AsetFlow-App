<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  confirmText?: string;
  teleportTo?: string | HTMLElement | null;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Delete Confirmation',
  confirmText: 'Confirm',
  teleportTo: '#modal-container',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm' | 'cancel'): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

const input = ref('');

const canDelete = computed(() => input.value.trim() === props.confirmText);

function close() {
  isOpen.value = false;
  input.value = '';
}

function onCancel() {
  emit('cancel');
  close();
}

function onDelete() {
  if (!canDelete.value) return;
  emit('confirm');
  close();
}
</script>

<template>
  <UiModalContainer v-model="isOpen" :teleport-to="props.teleportTo">
    <UiModalTitle>{{ props.title }}</UiModalTitle>
    <UiModalContent>
      <slot />
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
      <UiModalAction>
        <button class="btn" @click="onCancel">Cancel</button>
        <button class="btn btn-error" :disabled="!canDelete" @click="onDelete">
          Delete
        </button>
      </UiModalAction>
    </UiModalContent>
  </UiModalContainer>
</template>
