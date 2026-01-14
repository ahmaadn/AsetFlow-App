<script setup lang="ts">
import type { FolderItemType } from '@asetflow/shared-types';
import type { TabItem } from '~/components/ui/Tabs.vue';
import type { ViewMode } from '~/types';
import type { ActivityItem } from '~/components/ui/activity/Timeline.vue';

interface FolderDetail extends FolderItemType {
  size?: string;
  owner?: {
    name: string;
    avatar?: string;
  };
}

definePageMeta({
  layout: 'dashboard',
});

const folderState = useFolderStore();
const selectedFolder = ref<FolderItemType | null>(null);
const folderDetail = ref<FolderDetail | null>(null);
const activities = ref<ActivityItem[]>([]);
const isPanelLoading = ref(false);
const isCreateFolder = ref(false);
const { folderViewMode, setViewFolderMode } = useAppState();
const isOpenModalEdit = ref(false);
const isLoading = computed(() => folderState.isLoading);
const searchQuery = computed({
  get: () => folderState.searchQuery,
  set: (val: string) => folderState.setSearchQuery(val),
});
const loadMoreRef = ref<HTMLElement | null>(null);
const modal = useModal();

const viewMode = computed<ViewMode>({
  get: () => folderViewMode.value,
  set: (val: ViewMode) => setViewFolderMode(val),
});
const viewTabs: TabItem[] = [
  { key: 'list', icon: 'ri:list-check' },
  { key: 'grid', icon: 'ri:layout-grid-fill' },
];

await folderState.loadFolders();

// Dummy data for folder detail
const dummyFolderDetail: Partial<FolderDetail> = {
  size: '1.2 GB',
  owner: {
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  },
};

// Dummy activity data
const dummyActivities: ActivityItem[] = [
  {
    id: '1',
    action: 'uploaded 3 files',
    user: 'Jane Doe',
    date: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
  },
  {
    id: '2',
    action: "changed status to 'Public'",
    user: 'Mike S.',
    date: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: '3',
    action: 'added tags',
    user: 'Jane Doe',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: '4',
    action: 'renamed folder',
    user: 'John Doe',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: '5',
    action: 'moved folder to Drive',
    user: 'John Doe',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
];

// Fetch folder detail
const fetchFolderDetail = async (folder: FolderItemType) => {
  isPanelLoading.value = true;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Merge folder with dummy detail data
  folderDetail.value = {
    ...folder,
    ...dummyFolderDetail,
  };

  // Set activities with folder creation as the last item
  activities.value = [
    ...dummyActivities,
    {
      id: 'created',
      action: 'Folder created',
      date: folder.createdAt,
    },
  ];

  isPanelLoading.value = false;
};

const { stop: stopIntersection } = useIntersectionObserver(
  loadMoreRef,
  async ([entry]) => {
    if (entry?.isIntersecting && folderState.hasMore && !isLoading.value) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // slight delay for better UX
      await folderState.loadMoreFolders();
    }
  },
  {
    rootMargin: '0px 0px 0px 0px',
  }
);

// Handle search with debounce
const debouncedSearch = useDebounceFn(async (query: string) => {
  await folderState.searchFolders(query);
}, 500);

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery);
});

const createFolder = async (name: string) => {
  await folderState.createFolder({ name });
  isCreateFolder.value = false;
};

const openModalUpdate = (folder: FolderItemType) => {
  selectedFolder.value = folder;
  isOpenModalEdit.value = true;
};

const onUpdate = async (folder: FolderItemType) => {
  if (!selectedFolder.value && !isOpenModalEdit.value) return;
  await folderState.updateFolder(folder.id, {
    name: folder.name,
    slug: folder.slug,
  });
  isOpenModalEdit.value = false;

  if (selectedFolder.value?.id === folder.id) {
    const updatedFolder = {
      ...selectedFolder.value,
      name: folder.name,
      slug: folder.slug,
    };
    selectedFolder.value = updatedFolder;
  }
};

const onSortChange = async (key: string | null, dir: 'asc' | 'desc' | null) => {
  folderState.setSorting(key as 'name' | 'createdAt', dir === 'desc');
  await refresh();
};

const handleModalDelete = (folder: FolderItemType) => {
  modal.input({
    title: 'Delete Folder',
    id: `delete-folder-${folder.id}`,
    message: `Are you sure you want to delete the folder '${folder.name}'? All assets within it will be deleted. This action cannot be undone.`,
    confirmText: 'Delete',
    variant: 'error',
    inputRequiredValue: folder.name,
    onConfirm: async () => {
      selectedFolder.value = null;
      await folderState.deleteFolder(folder.id);
    },
  });
};

async function onDoubleClick(folder: FolderItemType) {
  await navigateTo(`/drive/${folder.id}`);
}

async function refresh() {
  folderState.resetPagination();
  folderState.setLoading(true);
  await new Promise((resolve) => setTimeout(resolve, 500));
  await folderState.loadFolders();
}

watch(selectedFolder, async (newFolder) => {
  if (newFolder) {
    await fetchFolderDetail(newFolder);
  } else {
    folderDetail.value = null;
    activities.value = [];
    isPanelLoading.value = false;
  }
});

onUnmounted(stopIntersection);
</script>
<template>
  <div>
    <div class="flex flex-col w-full space-y-8">
      <AppBanner
        title="Drive Folders"
        subtitle="Manage your folders to organize your digital assets effectively."
      >
        <div class="flex gap-2">
          <button class="btn bg-white" @click="refresh">
            <Icon name="ri:refresh-line" class="size-5" />
            Refresh
          </button>
          <button class="btn btn-primary" @click="isCreateFolder = true">
            <Icon name="ri:folder-add-line" class="size-5" />
            New Folder
          </button>
        </div>
      </AppBanner>
      <div class="h-full overflow-auto space-y-6 w-full">
        <div
          class="flex md:items-center md:justify-between py-1 gap-6 flex-wrap md:flex-row flex-col"
        >
          <div class="flex-1 flex gap-x-4 w-full">
            <UiTabs
              v-model="viewMode"
              :tabs="viewTabs"
              variant="box"
              size="sm"
              class-tabs="bg-base-300"
              icon-only
            />
            <div class="flex-1 flex items-center space-x-4">
              <label class="input w-full md:w-72">
                <Icon name="ri:search-line" class="size-5 opacity-50" />
                <input
                  v-model="searchQuery"
                  type="search"
                  class="grow"
                  placeholder="Search folders..."
                />
              </label>
            </div>
          </div>
          <div class="flex-none align-middle">
            <p class="text-sm text-base-content/80">
              Showing <strong>{{ folderState.folders.length }}</strong> folders
            </p>
          </div>
        </div>
        <div class="flex-1 overflow-auto h-full">
          <!-- List View -->
          <AppFolderList
            v-if="viewMode === 'list'"
            :folders="folderState.folders"
            :loading="isLoading"
            @click="(folder) => (selectedFolder = folder)"
            @double-click="onDoubleClick"
            @sort-change="onSortChange"
          />

          <!-- Grid View -->
          <AppFolderGrid
            v-else
            :folders="folderState.folders"
            :loading="isLoading"
            @click="(folder) => (selectedFolder = folder)"
            @double-click="onDoubleClick"
          />

          <div
            v-if="folderState.hasMore"
            ref="loadMoreRef"
            class="flex justify-center p-4"
          >
            <span class="loading loading-spinner loading-md text-primary" />
          </div>
        </div>

        <!-- Modal Create -->
        <AppFolderModelCreate
          v-if="isCreateFolder"
          v-model="isCreateFolder"
          @submit="createFolder"
        />

        <!-- Modal update -->
        <AppFolderModalEdit
          v-if="selectedFolder && isOpenModalEdit"
          v-model="isOpenModalEdit"
          :folder-item="selectedFolder"
          @update="onUpdate"
        />

        <!-- Folder Panel -->
        <AppFolderPanel
          v-if="selectedFolder"
          v-model="selectedFolder"
          :folder-detail="folderDetail"
          :activities="activities"
          :is-loading="isPanelLoading"
          @close="selectedFolder = null"
          @open="onDoubleClick"
          @delete="handleModalDelete"
          @rename="openModalUpdate"
        />
      </div>
    </div>
  </div>
</template>
