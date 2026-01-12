<script setup lang="ts">
import type { FolderItemType } from '@asetflow/shared-types';
import { UpdateFolderSchema } from '@asetflow/validators';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    folderItem: FolderItemType;
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
  (e: 'update', folderItem: FolderItemType): void;
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
  validationSchema: UpdateFolderSchema,
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
  <UiModalOverlay v-model="isOpen" :teleport-to="props.teleportTo">
    <UiModalTitle>Edit Folder</UiModalTitle>
    <UiModalContent>
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
        <UiModalAction>
          <button class="btn" type="reset" @click="onCancel">Cancel</button>
          <button class="btn btn-warning" type="submit">Update</button>
        </UiModalAction>
      </form>
    </UiModalContent>
  </UiModalOverlay>
</template>
