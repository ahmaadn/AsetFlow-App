<script setup lang="ts">
type FolderOption = {
  label: string;
  value: string;
  [key: string]: unknown;
};

interface Props {
  folders: FolderOption[];
  modelValue: FolderOption | null;
  loading?: boolean;
  hasMore?: boolean;
}

interface Emits {
  'add-folder': [];
  'load-more': [];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  hasMore: false,
});
const emits = defineEmits<Emits>();
const model = defineModel<FolderOption | null>();
</script>

<template>
  <section class="bg-base-100 p-4 flex flex-row gap-4 rounded-md items-start">
    <div class="flex-none">
      <div
        class="bg-amber-500/20 flex items-center justify-center p-4 rounded-md"
      >
        <Icon name="ri:folder-fill" class="size-5 text-amber-500"></Icon>
      </div>
    </div>
    <div class="flex-1 flex flex-wrap md:contents flex-col gap-2">
      <div class="flex-1">
        <h2 class="font-semibold text-base-content mb-2 text-sm">
          Pilih Folder Tujuan
        </h2>
        <div class="bg-base-100 rounded-lg border border-base-300">
          <UiComboBox
            v-model="model"
            :options="props.folders"
            :loading="props.loading"
            :has-more="props.hasMore"
            infinite-scroll
            :page-size="10"
            placeholder="Pilih folder tujuan"
            @load-more="emits('load-more')"
          >
            <template #option="{ option }">
              <div class="flex flex-row items-center gap-3">
                <Icon
                  name="ri:folder-fill"
                  class="min-h-5 min-w-5 size-5 text-amber-500"
                />
                <div class="flex flex-col">
                  <p class="font-medium">{{ option.label }}</p>
                </div>
              </div>
            </template>
          </UiComboBox>
        </div>
      </div>
      <div class="flex-none">
        <button
          class="btn btn-ghost btn-primary btn-sm"
          @click="emits('add-folder')"
        >
          <Icon name="ri:add-line" class="size-5" />
          New Folder
        </button>
      </div>
    </div>
  </section>
</template>
