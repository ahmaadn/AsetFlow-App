<script setup lang="ts">
type FolderOption = {
  label: string;
  value: string;
  [key: string]: unknown;
};

interface Props {
  folders: FolderOption[];
  modelValue: FolderOption | null;
}

interface Emits {
  'add-folder': [folder: string];
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const model = defineModel<FolderOption | null>();
</script>

<template>
  <section>
    <h2 class="text-lg font-semibold text-base-content mb-2">
      Langkah 1: Pilih Folder Tujuan
    </h2>
    <p class="text-sm text-base-content/60 mb-4">
      Pilih folder di mana aset baru akan disimpan.
    </p>
    <div class="bg-base-100 rounded-lg border border-base-300">
      <ui-tabs :tabs="['Pilih Folder', 'Buat Folder Baru']" class-tabs="px-2">
        <template #default="{ selected, select }">
          <div class="p-6">
            <UiComboBox
              v-if="selected === 0"
              v-model="model"
              :options="props.folders"
              placeholder="Pilih folder tujuan"
            >
              <template #option="{ option }">
                <div class="flex flex-row items-center gap-3">
                  <Icon
                    name="ri:folder-fill"
                    class="min-h-5 min-w-5 size-5 text-amber-500"
                  />
                  <div class="flex flex-col">
                    <p class="font-medium">{{ option.label }}</p>
                    <p class="text-sm text-base-content/60">
                      {{ option.slug }}
                    </p>
                  </div>
                </div>
              </template>
            </UiComboBox>
            <FolderForm
              v-else
              size="md"
              @close="select(0)"
              @submit="
                async (name: string) => {
                  emits('add-folder', name);
                  select(0);
                }
              "
            />
          </div>
        </template>
      </ui-tabs>
    </div>
  </section>
</template>
