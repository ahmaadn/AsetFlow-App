<script setup lang="ts">
const folderState = useFolderStore();

const isCreateFolder = ref(false);

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
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

onMounted(async () => {
  await folderState.loadFolders();
});
</script>
<template>
  <UiContent>
    <ContentHeader>
      <template #left>
        <div class="flex items-center space-x-2">
          <button
            class="btn btn-sm btn-square btn-ghost"
            @click="isCreateFolder = true"
          >
            <Icon
              name="ri:add-large-fill"
              class="size-5 opacity-80 hover:opacity-100"
            />
          </button>
          <button class="btn btn-sm btn-square btn-ghost">
            <Icon
              name="ri:restart-line"
              class="size-5 opacity-80 hover:opacity-100"
            />
          </button>
        </div>
      </template>
      <template #right>
        <div class="flex items-center space-x-4">
          <!-- Search Input -->
          <label class="input w-72">
            <Icon name="ri:search-line" class="size-5 opacity-50" />
            <input type="search" class="grow" placeholder="Search" />
          </label>
        </div>
      </template>
    </ContentHeader>
    <div class="flex-1 overflow-auto p-4">
      <data-table
        :columns="columns"
        :rows="folderState.folders"
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
          <a class="flex items-center gap-3" :href="`/folder/${row.slug}`">
            <Icon name="ri:folder-fill" class="size-5 text-amber-500" />
            <div>
              <div class="font-medium">{{ row.name }}</div>
              <div class="text-xs text-neutral/60">{{ row.slug }}</div>
            </div>
          </a>
        </template>
        <template #cell-tags="{ row }">
          <div class="flex gap-1">
            <span
              v-for="tag in row.tags"
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
          </div>
        </template>
        <template #cell-action>
          <button class="btn btn-sm btn-ghost btn-square">
            <Icon name="ri:more-2-fill" class="size-5 opacity-50" />
          </button>
        </template>
      </data-table>
    </div>
  </UiContent>
</template>
