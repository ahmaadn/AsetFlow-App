<script setup lang="ts">
import type { FolderItem } from '@asetflow/shared-types';
import { formatDisplayDate } from '@asetflow/shared';

const folderState = useFolderStore();

const isCreateFolder = ref(false);
const selectedFolder = ref<FolderItem | null>(null);
const isModalDeleteOpen = ref(false);
const isModalEditOpen = ref(false);
const isLoading = ref(false);

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'tags', label: 'Tags' },
  { key: 'updatedAt', label: 'Updated', sortable: true },
  { key: 'assetCount', label: 'Total Assets', sortable: true },
  { key: 'action', label: ' ', sortable: false },
];

const tags = [
  {
    name: 'work',
    color: 'primary',
  },
  {
    name: 'project',
    color: 'success',
  },
  {
    name: 'personal',
    color: 'warning',
  },
];

const createFolder = async (name: string) => {
  await folderState.createFolder(name);
  isCreateFolder.value = false;
};

const openModalDelete = (folder: FolderItem) => {
  selectedFolder.value = folder;
  isModalDeleteOpen.value = true;
};

const onDelete = async () => {
  if (!selectedFolder.value && !isModalDeleteOpen.value) return;
  const { id } = selectedFolder.value as { id: string };
  await folderState.deleteFolder(id);
  selectedFolder.value = null;
};

const openModalUpdate = (folder: FolderItem) => {
  selectedFolder.value = folder;
  isModalEditOpen.value = true;
};

const onUpdate = async (newData: FolderItem) => {
  if (!selectedFolder.value && !isModalEditOpen.value) return;
  const { id, name, slug } = newData;
  await folderState.updateFolder(id, { name, slug });
  selectedFolder.value = null;
};

const clear = () => {
  selectedFolder.value = null;
  isModalDeleteOpen.value = false;
  isModalEditOpen.value = false;
};

const refresh = async () => {
  isLoading.value = true;
  await folderState.loadFolders();
  isLoading.value = false;
};

onMounted(refresh);
</script>
<template>
  <UiContent>
    <UiHeader>
      <div class="flex items-center space-x-2">
        <button
          class="btn btn-sm btn-square btn-ghost"
          :disabled="isLoading"
          title="Create New Folder"
          @click="isCreateFolder = true"
        >
          <Icon
            name="ri:folder-add-line"
            class="size-5 opacity-80 hover:opacity-100"
          />
        </button>
        <button
          class="btn btn-sm btn-square btn-ghost"
          title="Refresh"
          @click="refresh"
        >
          <Icon
            name="ri:restart-line"
            class="size-5 opacity-80 hover:opacity-100"
          />
        </button>
      </div>
      <div class="flex items-center space-x-4">
        <label class="input w-full md:w-72">
          <Icon name="ri:search-line" class="size-5 opacity-50" />
          <input
            type="search"
            class="grow"
            placeholder="Search"
            :disabled="isLoading"
          />
        </label>
      </div>
    </UiHeader>
    <div class="flex-1 overflow-auto p-4">
      <ui-table
        :columns="columns"
        :rows="folderState.folders"
        :loading="isLoading"
        row-key="id"
        class="w-full"
      >
        <template v-if="isCreateFolder" #first-row>
          <tr>
            <td :colspan="columns.length" class="px-2">
              <folder-form
                @close="isCreateFolder = false"
                @submit="createFolder"
              />
            </td>
          </tr>
        </template>

        <template #cell-name="{ row }">
          <NuxtLink
            class="flex items-center gap-3 min-w-md"
            :to="`/folder/${row.id}/media`"
            style="will-change: transform"
          >
            <Icon
              name="ri:folder-fill"
              class="min-h-5 min-w-5 size-5 text-amber-500"
            />
            <div class="flex-1">
              <div class="font-medium">{{ row.name }}</div>
              <div class="text-xs text-neutral/60">{{ row.slug }}</div>
            </div>
          </NuxtLink>
        </template>
        <template #cell-tags="{ value }">
          <div class="flex gap-1">
            <span v-if="!value.length">No Tags</span>
          </div>
        </template>
        <template #cell-updatedAt="{ value }">
          {{ formatDisplayDate(value) }}
        </template>
        <template #cell-assetCount="{ value }"> {{ value }} Assets </template>
        <template #cell-action="{ row }">
          <div class="flex flex-wrap gap-2 flex-col md:flex-row">
            <button
              class="btn btn-sm btn-square btn-warning"
              @click="openModalUpdate(row as FolderItem)"
            >
              <Icon name="ri:edit-line" class="size-5" />
            </button>
            <button
              class="btn btn-sm btn-square btn-error"
              @click="openModalDelete(row as FolderItem)"
            >
              <Icon name="ri:delete-bin-4-line" class="size-5" />
            </button>
          </div>
        </template>
      </ui-table>
    </div>
    <FolderModalEdit
      v-if="selectedFolder && isModalEditOpen"
      v-model="isModalEditOpen"
      :folder-item="selectedFolder"
      @update="onUpdate"
      @cancel="clear"
    />
    <AppModalDelete
      v-if="selectedFolder && isModalDeleteOpen"
      v-model="isModalDeleteOpen"
      :confirm-text="selectedFolder.slug"
      @confirm="onDelete"
      @cancel="clear"
    >
      <p>
        Apakah Anda yakin ingin menghapus folder
        <span id="folder-name" class="font-semibold text-base-content/100">
          {{ selectedFolder.name }}</span
        >? Semua aset di dalamnya akan dipindahkan ke "Uncategorized". Tindakan
        ini tidak dapat dibatalkan.
      </p>
    </AppModalDelete>
  </UiContent>
</template>
