<script setup lang="ts">
import type { AssetResponse } from '@asetflow/shared-types';
import {
  formatDisplayDate,
  formatSize,
  getAssetTypeFromMime,
} from '@asetflow/shared';
import type { PropertyItem } from '~/components/ui/PropertiesPanel.vue';
import type { ActivityItem } from '~/components/ui/activity/Timeline.vue';

interface Props {
  asset: AssetResponse;
  activities?: ActivityItem[];
  isLoading?: boolean;
}

interface Emits {
  close: [];
  download: [];
  edit: [];
  delete: [];
  update: [data: AssetResponse];
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  activities: () => [],
});
const emit = defineEmits<Emits>();

// const assetStore = useAssetStore();
// const folderStore = useFolderStore();
// const toast = useToast();
// const config = useRuntimeConfig();
// const isEditMode = ref(false);
// const isUpdating = ref(false);
// const isLoading = ref(false);
// const editForm = ref<UpdateAssetInput>({
//   name: props.asset.name,
//   slug: props.asset.slug,
// });

const assetProperties = computed<PropertyItem[]>(() => {
  const properties: PropertyItem[] = [
    {
      key: 'name',
      label: 'Name',
      value: props.asset.name,
    },
    {
      key: 'assetType',
      label: 'Asset Type',
      value: getAssetTypeFromMime(props.asset.mimeType),
    },
    {
      key: 'size',
      label: 'Size',
      value: formatSize(props.asset.size),
    },
    {
      key: 'mimeType',
      label: 'MIME Type',
      value: props.asset.mimeType,
    },
    {
      key: 'uploadedAt',
      label: 'Uploaded At',
      value: formatDisplayDate(props.asset.createdAt),
    },
    {
      key: 'modifiedAt',
      label: 'Modified At',
      value: formatDisplayDate(props.asset.updatedAt),
    },
    {
      key: 'tags',
      label: 'Tags',
      type: 'tags',
      tags: [],
      emptyText: 'No tags',
    },
  ];

  if (props.asset.metadata) {
    for (const [key, value] of Object.entries(props.asset.metadata)) {
      properties.push({
        key: `metadata-${key}`,
        label: key,
        value: String(value),
      });
    }
  }

  return properties;
});

const quickActions = [
  { key: 'Download', icon: 'ri:download-line', class: 'btn-primary' },
  { key: 'Share', icon: 'ri:share-line' },
  { key: 'Edit', icon: 'ri:edit-line' },
  { key: 'Delete', icon: 'ri:delete-bin-line', class: 'btn-error' },
];

const handleClose = () => emit('close');
</script>

<template>
  <Teleport to="#modal-container">
    <Transition name="slide">
      <UiPanelContainer @click.stop>
        <UiPanelHeader>
          <h3 class="text-lg font-semibold text-base-content">Asset Details</h3>
          <button class="btn btn-ghost btn-sm btn-circle" @click="handleClose">
            <Icon name="ri:close-line" class="h-5 w-5" />
          </button>
        </UiPanelHeader>
        <UiPanelContent>
          <div class="flex-1 overflow-y-auto">
            <div class="border-b border-base-300 p-4">
              <UiAssetPreview :asset="asset" class="rounded-lg bg-base-200" />
            </div>

            <div class="space-y-6 p-4">
              <UiPropertiesPanel
                :properties="assetProperties"
                :skeleton-count="assetProperties.length"
              />
            </div>
          </div>

          <!-- Quick Actions Skeleton -->
          <div v-if="props.isLoading" class="p-5 border-b border-base-200">
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
                v-for="action in quickActions"
                :key="action.key"
                :class="[
                  'btn btn-ghost btn-sm w-full justify-start gap-x-3',
                  action.class,
                ]"
              >
                <Icon :name="action.icon" class="size-4" />
                {{ action.key }}
              </button>
            </div>
          </div>
          <!-- Activity -->
          <div
            v-if="props.activities && props.activities.length > 0"
            class="p-5"
          >
            <h4
              class="text-xs font-bold text-primary uppercase tracking-wider mb-4"
            >
              Activity
            </h4>
            <UiActivityTimeline
              ref="activityTimelineRef"
              :activities="props.activities"
              :loading="props.isLoading"
              :initial-count="2"
              :skeleton-count="2"
            />
          </div>
        </UiPanelContent>
      </UiPanelContainer>
    </Transition>
  </Teleport>
</template>
