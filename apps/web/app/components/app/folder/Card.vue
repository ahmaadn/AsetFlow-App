<script setup lang="ts">
import { getIconForMimeType } from '@asetflow/shared';
import type { FolderItemType } from '@asetflow/shared-types';

export interface AssetPreview {
  id: string;
  thumbnailUrl?: string;
  mimeType?: string;
}

export interface FolderCardProps {
  folder: FolderItemType;
  previews?: AssetPreview[];
}

export interface Emits {
  click: [folder: FolderItemType];
  'double-click': [folder: FolderItemType];
}

const props = withDefaults(defineProps<FolderCardProps>(), {
  previews: () => [],
});

const emit = defineEmits<Emits>();

// Main preview (largest)
const mainPreview = computed<AssetPreview | null>(
  () => props.previews[0] || null
);

// Side previews (up to 2)
const sidePreviews = computed(() => props.previews.slice(1, 3));

// Image load error handling
const imageErrors = ref<Set<string>>(new Set());

function onImageError(id: string) {
  imageErrors.value.add(id);
}

function hasImageError(id: string) {
  return imageErrors.value.has(id);
}
</script>

<template>
  <div
    class="folder-card group relative card bg-base-100 shadow-sm transition-transform"
    @click="emit('click', folder)"
    @dblclick="emit('double-click', folder)"
  >
    <figure class="relative h-48 p-3 overflow-hidden">
      <!-- Header with preview grid -->
      <div>
        <!-- Tags -->
        <div
          class="absolute top-3 left-3 flex flex-wrap gap-1 z-10 max-w-[70%]"
        >
          <span
            v-for="tag in folder.tags.slice(0, 2)"
            :key="tag.id"
            class="badge badge-xs font-bold tracking-wide uppercase badge-primary"
          >
            {{ tag.name }}
          </span>
          <span
            v-if="folder.tags.length > 2"
            class="px-2 py-0.5 text-[10px] font-bold rounded-md tracking-wide bg-base-300 text-base-content"
          >
            +{{ folder.tags.length - 2 }}
          </span>
        </div>

        <!-- Preview Grid Layout -->
        <div class="absolute inset-3 top-10 flex gap-2">
          <!-- Main Preview (Left - larger) -->
          <div
            class="flex-1 bg-base-100/60 backdrop-blur-sm rounded-lg overflow-hidden flex items-center justify-center"
          >
            <template
              v-if="
                mainPreview &&
                mainPreview.thumbnailUrl &&
                !hasImageError(mainPreview.id)
              "
            >
              <img
                :src="mainPreview.thumbnailUrl"
                :alt="folder.name"
                class="w-full h-full object-cover"
                @error="onImageError(mainPreview.id)"
              />
            </template>
            <template v-else-if="mainPreview">
              <Icon
                :name="getIconForMimeType(mainPreview.mimeType!)"
                class="size-12 opacity-50"
              />
            </template>
            <template v-else>
              <Icon name="ri:folder-fill" class="size-12 text-amber-500" />
            </template>
          </div>

          <!-- Side Previews (Right - smaller, stacked) -->
          <div
            v-if="sidePreviews.length > 0 || folder.assetCount > 1"
            class="w-16 flex flex-col gap-2"
          >
            <template v-if="sidePreviews.length > 0">
              <div
                v-for="preview in sidePreviews"
                :key="preview.id"
                class="flex-1 bg-base-100/60 backdrop-blur-sm rounded-lg overflow-hidden flex items-center justify-center"
              >
                <template
                  v-if="preview.thumbnailUrl && !hasImageError(preview.id)"
                >
                  <img
                    :src="preview.thumbnailUrl"
                    :alt="folder.name"
                    class="w-full h-full object-cover"
                    @error="onImageError(preview.id)"
                  />
                </template>
                <template v-else>
                  <Icon
                    :name="getIconForMimeType(preview.mimeType!)"
                    class="size-6 opacity-50"
                  />
                </template>
              </div>
            </template>
            <!-- Placeholder boxes if no side previews but has more assets -->
            <template v-else>
              <div
                class="flex-1 bg-base-100/60 backdrop-blur-sm rounded-lg flex items-center justify-center"
              >
                <Icon name="ri:file-line" class="size-6 opacity-30" />
              </div>
              <div
                class="flex-1 bg-base-100/60 backdrop-blur-sm rounded-lg flex items-center justify-center"
              >
                <Icon name="ri:folder-line" class="size-6 opacity-30" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </figure>

    <!-- Content -->
    <div class="card-body p-4 pt-3 space-y-2 border-t border-base-200">
      <!-- Folder Name -->
      <h3 class="card-title truncate" :title="folder.name">
        {{ folder.name }}
      </h3>

      <!-- Metadata Row -->
      <div
        class="flex items-center justify-between text-sm text-base-content/60"
      >
        <span class="flex items-center gap-3">
          <Icon name="ri:folder-line" class="size-4" />
          {{ folder.assetCount }} files
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.folder-card:active {
  transform: scale(0.98);
}
</style>
