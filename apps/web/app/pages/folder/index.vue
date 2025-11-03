<script setup lang="ts">
import type { FolderItem } from '@asetflow/shared-types';
import { formatDisplayDate } from '@asetflow/shared';

const folderState = useFolderStore();

const isCreateFolder = ref(false);
const selectedFolder = ref<FolderItem | null>(null);
const modalDeleteOpen = ref(false);
const modalEditOpen = ref(false);
const loading = ref(false);

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'tags', label: 'Tags' },
  { key: 'createdAt', label: 'Created', sortable: true },
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
  modalDeleteOpen.value = true;
};

const onDelete = async () => {
  if (!selectedFolder.value && !modalDeleteOpen.value) return;
  const { id } = selectedFolder.value as { id: string };
  await folderState.deleteFolder(id);
  selectedFolder.value = null;
};

const openModalUpdate = (folder: FolderItem) => {
  selectedFolder.value = folder;
  modalEditOpen.value = true;
};

const onUpdate = async (newData: FolderItem) => {
  if (!selectedFolder.value && !modalEditOpen.value) return;
  const { id, name, slug } = newData;
  await folderState.updateFolder(id, { name, slug });
  selectedFolder.value = null;
};

const clear = () => {
  selectedFolder.value = null;
  modalDeleteOpen.value = false;
  modalEditOpen.value = false;
};

const refresh = async () => {
  loading.value = true;
  await folderState.loadFolders();
  loading.value = false;
};

onMounted(refresh);
</script>
<template>
  <UiContent>
    <UiHeader>
      <div class="flex items-center space-x-2">
        <button
          class="btn btn-sm btn-square btn-ghost"
          :disabled="loading"
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
            :disabled="loading"
          />
        </label>
      </div>
    </UiHeader>
    <div class="flex-1 overflow-auto p-4">
      <ui-table
        :columns="columns"
        :rows="folderState.folders"
        :loading="loading"
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
            class="flex items-center gap-3"
            :to="`/folder/${row.id}/media`"
          >
            <Icon name="ri:folder-fill" class="size-5 text-amber-500" />
            <div>
              <div class="font-medium">{{ row.name }}</div>
              <div class="text-xs text-neutral/60">{{ row.slug }}</div>
            </div>
          </NuxtLink>
        </template>
        <template #cell-tags="{ value }">
          <div class="flex gap-1">
            <span
              v-for="tag in value"
              :key="tag"
              class="badge badge-sm"
              :class="{
                'badge-primary':
                  tags.find((t) => t.name === tag)?.color === 'primary',
                'badge-success':
                  tags.find((t) => t.name === tag)?.color === 'success',
                'badge-warning':
                  tags.find((t) => t.name === tag)?.color === 'warning',
              }"
            >
              {{ tag }}
            </span>
            <span v-if="!value.length">No Tags</span>
          </div>
        </template>
        <template #cell-createdAt="{ value }">
          {{ formatDisplayDate(new Date(value)) }}
        </template>
        <template #cell-updatedAt="{ value }">
          {{ formatDisplayDate(new Date(value)) }}
        </template>
        <template #cell-assetCount="{ value }"> {{ value }} Assets </template>
        <template #cell-action="{ row }">
          <div class="space-x-2">
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
      v-if="selectedFolder && modalEditOpen"
      v-model="modalEditOpen"
      :folder-item="selectedFolder"
      @update="onUpdate"
      @cancel="clear"
    />
    <FolderModalDelete
      v-if="selectedFolder && modalDeleteOpen"
      v-model="modalDeleteOpen"
      :folder-name="selectedFolder.name"
      :confirm-text="selectedFolder.slug"
      @confirm="onDelete"
      @cancel="clear"
    />
  </UiContent>
</template>
