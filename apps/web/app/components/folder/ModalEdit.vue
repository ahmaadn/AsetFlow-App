<script setup lang="ts">
import type { FolderItem } from '@asetflow/shared-types';
import { updateFolderSchema } from '@asetflow/validators';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    folderItem: FolderItem;
    teleportTo?: string | HTMLElement | null;
  }>(),
  {
    folderName: 'Laporan Bulanan',
    teleportTo: '#modal-container',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'cancel'): void;
  (e: 'update', folderItem: FolderItem): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

const { values, errors, handleSubmit } = useForm({
  initialValues: {
    name: props.folderItem.name,
    slug: props.folderItem.slug,
    tags: props.folderItem.tags.map((tag) => tag.id),
  },
  validationSchema: updateFolderSchema,
  onSubmit: async (values) => {
    // TODO: Untuk Sekarang tags diabaikan dulu
    // WIP
    const { tags, ...newValues } = values;
    emit('update', { ...props.folderItem, ...newValues });
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
  <ModalContainer v-model="isOpen" :teleport-to="props.teleportTo">
    <ModalTitle>Edit Folder</ModalTitle>

    <ModalContent>
      <p>
        Perbaharui folder
        <span class="font-semibold text-base-content/100">{{
          props.folderItem.name
        }}</span>
        di bawah ini:
      </p>
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
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base">Slug</legend>
          <input
            id="slug-folder"
            v-model="values.slug"
            type="text"
            class="input w-full"
            placeholder="Type here"
          />
          <p v-if="errors.slug" class="label text-error">{{ errors.slug }}</p>
        </fieldset>
        <ModalAction>
          <button class="btn" type="reset" @click="onCancel">Cancel</button>
          <button class="btn btn-warning" type="submit">Update</button>
        </ModalAction>
      </form>
    </ModalContent>
  </ModalContainer>
</template>
