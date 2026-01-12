<script setup lang="ts">
import { CreateFolderSchema } from '@asetflow/validators';

interface Props {
  modelValue: boolean;
  teleportTo?: string | HTMLElement | null;
}

const props = withDefaults(defineProps<Props>(), {
  teleportTo: '#modal-container',
});

interface Emits {
  'update:modelValue': [value: boolean];
  cancel: [];
  submit: [nameFolder: string];
}

const emit = defineEmits<Emits>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

const { values, errors, handleSubmit } = useForm({
  initialValues: {
    name: '',
  },
  validationSchema: CreateFolderSchema,
  onSubmit: async (values) => {
    emit('submit', values.name);
  },
});

function close() {
  isOpen.value = false;
}

function onCancel() {
  emit('cancel');
  close();
}
</script>

<template>
  <UiModalContainer v-model="isOpen" :teleport-to="props.teleportTo">
    <UiModalTitle>Buat Folder Baru </UiModalTitle>
    <UiModalContent>
      <form @submit="handleSubmit">
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base">Nama</legend>
          <input
            id="name-folder"
            v-model="values.name"
            type="text"
            class="input w-full"
            placeholder="Type here"
          />
          <p v-if="errors.name" class="label text-error">{{ errors.name }}</p>
        </fieldset>
        <UiModalAction>
          <button class="btn" type="reset" @click="onCancel">Cancel</button>
          <button class="btn btn-success" type="submit">Create</button>
        </UiModalAction>
      </form>
    </UiModalContent>
  </UiModalContainer>
</template>
