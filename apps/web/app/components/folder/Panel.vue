<script setup lang="ts">
import { formatDisplayDate } from '@asetflow/shared';
import type { FolderItemType } from '@asetflow/shared-types';
import type { ActivityItem } from '~/components/ui/activity/Timeline.vue';
import type { PropertyItem } from '~/components/ui/PropertiesPanel.vue';

interface Props {
  folder: FolderItemType;
}

interface FolderDetail extends FolderItemType {
  size?: string;
  owner?: {
    name: string;
    avatar?: string;
  };
}
interface Emits {
  close: [];
  open: [folder: FolderItemType];
  rename: [folder: FolderItemType];
  delete: [folder: FolderItemType];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const activityTimelineRef = ref<InstanceType<
  typeof import('~/components/ui/activity/Timeline.vue').default
> | null>(null);
const isLoading = ref(true);
const folderDetail = ref<FolderDetail | null>(null);
const activities = ref<ActivityItem[]>([]);

// Computed properties for PropertiesPanel
const folderProperties = computed<PropertyItem[]>(() => {
  if (!folderDetail.value) return [];

  return [
    {
      key: 'name',
      label: 'Name',
      value: folderDetail.value.name,
    },
    {
      key: 'size',
      label: 'Size',
      value: folderDetail.value.size,
      emptyText: '-',
    },
    {
      key: 'owner',
      label: 'Owner',
      type: 'avatar',
      value: folderDetail.value.owner?.name,
      avatar: {
        src: folderDetail.value.owner?.avatar,
        alt: folderDetail.value.owner?.name,
        fallbackIcon: 'ri:user-line',
      },
      emptyText: '-',
    },
    {
      key: 'assets',
      label: 'Assets',
      value: `${folderDetail.value.assetCount} items`,
    },
    {
      key: 'slug',
      label: 'Slug',
      value: folderDetail.value.slug,
    },
    {
      key: 'created',
      label: 'Created',
      value: formatDisplayDate(folderDetail.value.createdAt),
    },
    {
      key: 'tags',
      label: 'Tags',
      type: 'tags',
      tags: folderDetail.value.tags,
      emptyText: 'No tags',
    },
  ];
});

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

// Simulate API call for folder detail
const fetchFolderDetail = async () => {
  isLoading.value = true;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Merge props.folder with dummy detail data
  folderDetail.value = {
    ...props.folder,
    ...dummyFolderDetail,
  };

  // Set activities with folder creation as the last item
  activities.value = [
    ...dummyActivities,
    {
      id: 'created',
      action: 'Folder created',
      date: props.folder.createdAt,
    },
  ];

  isLoading.value = false;
};

// Toggle history expansion
const toggleHistory = () => {
  activityTimelineRef.value?.toggle();
};

// Open folder handler
const handleOpen = () => {
  emit('open', props.folder);
};

// Close panel handler
const handleClose = () => {
  emit('close');
};

const handleRename = () => {
  emit('rename', props.folder);
};

const handleDelete = () => {
  emit('delete', props.folder);
};

// Watch for folder changes to refetch
watch(
  () => props.folder.id,
  () => {
    if (activityTimelineRef.value) {
      activityTimelineRef.value.isExpanded = false;
    }
    fetchFolderDetail();
  },
  { immediate: true }
);
</script>

<template>
  <Teleport to="#overlay">
    <!-- Panel -->
    <Transition name="slide">
      <aside
        v-show="true"
        class="fixed top-0 right-0 h-full w-full sm:w-95 bg-base-100 border-l border-base-300 flex flex-col shrink-0 shadow-xl z-50 overflow-hidden"
      >
        <!-- Header -->
        <div
          class="p-5 border-b border-base-200 flex items-start justify-between bg-base-200/50"
        >
          <div class="flex items-center gap-4 min-w-0 flex-1">
            <div
              class="bg-primary/10 p-2.5 rounded-lg shrink-0 flex items-center justify-center"
            >
              <Icon name="ri:folder-fill" class="text-primary size-7" />
            </div>
            <div v-if="isLoading" class="min-w-0 flex-1 space-y-2">
              <div class="skeleton h-5 w-32"></div>
              <div class="skeleton h-3 w-24"></div>
            </div>
            <div v-else class="min-w-0 flex-1">
              <h3
                class="text-lg font-bold text-base-content leading-tight truncate"
                :title="folderDetail?.name"
              >
                {{ folderDetail?.name }}
              </h3>
              <p class="text-xs text-base-content/60 mt-0.5">
                Updated {{ formatRelativeTime(folderDetail?.updatedAt || '') }}
              </p>
            </div>
          </div>
          <button
            class="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-base-content shrink-0"
            @click="handleClose"
          >
            <Icon name="ri:close-line" class="size-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto custom-scrollbar">
          <!-- Action Buttons -->
          <div class="p-5 flex border-b border-base-200">
            <button
              class="btn btn-primary btn-sm w-full"
              :disabled="isLoading"
              @click="handleOpen"
            >
              <Icon name="ri:folder-open-line" class="size-4" />
              Open
            </button>
          </div>

          <!-- Properties -->
          <div class="p-5 border-b border-base-200">
            <UiPropertiesPanel
              :properties="folderProperties"
              :loading="isLoading"
              :skeleton-count="7"
            />
          </div>

          <!-- Quick Actions Skeleton -->
          <div v-if="isLoading" class="p-5 border-b border-base-200">
            <div class="skeleton h-3 w-24 mb-4"></div>
            <div class="space-y-2">
              <div v-for="i in 2" :key="i" class="skeleton h-8 w-full"></div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div v-else class="p-5 border-b border-base-200">
            <h4
              class="text-xs font-bold text-primary uppercase tracking-wider mb-4"
            >
              Quick Actions
            </h4>
            <div class="space-y-2">
              <button
                class="btn btn-ghost btn-sm w-full justify-start gap-x-3"
                @click="handleRename"
              >
                <Icon name="ri:edit-line" class="size-4" />
                Rename Folder
              </button>

              <button
                class="btn btn-ghost btn-sm w-full btn-error justify-start gap-x-3"
                @click="handleDelete"
              >
                <Icon name="ri:delete-bin-line" class="size-4" />
                Delete
              </button>
            </div>
          </div>

          <!-- Activity -->
          <div class="p-5">
            <h4
              class="text-xs font-bold text-primary uppercase tracking-wider mb-4"
            >
              Activity
            </h4>
            <UiActivityTimeline
              ref="activityTimelineRef"
              :activities="activities"
              :loading="isLoading"
              :initial-count="2"
              :skeleton-count="2"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-base-200 bg-base-200/50">
          <button
            class="btn btn-ghost btn-sm w-full text-base-content/60 hover:text-base-content"
            :disabled="isLoading"
            @click="toggleHistory"
          >
            <Icon name="ri:history-line" class="size-4" />
            {{
              activityTimelineRef?.isExpanded
                ? 'Collapse History'
                : 'View Full History'
            }}
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition for panel */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
