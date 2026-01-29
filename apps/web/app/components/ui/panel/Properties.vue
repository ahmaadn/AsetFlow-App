<script setup lang="ts">
export interface PropertyItem {
  key: string;
  label: string;
  value?: string | number | null;
  type?: 'text' | 'avatar' | 'tags' | 'custom';
  avatar?: {
    src?: string;
    alt?: string;
    fallbackIcon?: string;
  };
  tags?: Array<{ id: string; name: string }>;
  emptyText?: string;
}

interface Props {
  title?: string;
  properties: PropertyItem[];
  loading?: boolean;
  skeletonCount?: number;
}

withDefaults(defineProps<Props>(), {
  title: 'Properties',
  loading: false,
  skeletonCount: 6,
});

defineSlots<{
  [key: `item-${string}`]: (props: { item: PropertyItem }) => unknown;
  title: () => unknown;
}>();
</script>

<template>
  <!-- Skeleton -->
  <div v-if="loading">
    <div class="skeleton h-3 w-20 mb-4"></div>
    <div class="space-y-4">
      <div
        v-for="i in skeletonCount"
        :key="i"
        class="flex justify-between items-center"
      >
        <div class="skeleton h-4 w-16"></div>
        <div class="skeleton h-4 w-24"></div>
      </div>
    </div>
  </div>

  <!-- Content -->
  <div v-else>
    <UiPanelTitle>
      <slot name="title">{{ title }}</slot>
    </UiPanelTitle>
    <dl class="space-y-4 text-sm">
      <template v-for="item in properties" :key="item.key">
        <!-- Custom slot for specific item -->
        <UiPanelInfoRow v-if="$slots[`item-${item.key}`]" :label="item.label">
          <slot :name="`item-${item.key}`" :item="item" />
        </UiPanelInfoRow>

        <!-- Avatar type -->
        <UiPanelInfoRow v-else-if="item.type === 'avatar'" :label="item.label">
          <div class="flex items-center gap-2">
            <div class="avatar">
              <div class="w-5 rounded-full">
                <img
                  v-if="item.avatar?.src"
                  :src="item.avatar.src"
                  :alt="item.avatar?.alt || String(item.value)"
                />
                <div
                  v-else
                  class="bg-primary/20 w-full h-full flex items-center justify-center"
                >
                  <Icon
                    :name="item.avatar?.fallbackIcon || 'ri:user-line'"
                    class="size-3 text-primary"
                  />
                </div>
              </div>
            </div>
            <span class="font-medium text-base-content">
              {{ item.value || item.emptyText || '-' }}
            </span>
          </div>
        </UiPanelInfoRow>

        <!-- Tags type -->
        <UiPanelInfoRow v-else-if="item.type === 'tags'" :label="item.label">
          <div class="flex gap-1 flex-wrap justify-end">
            <template v-if="item.tags && item.tags.length > 0">
              <span
                v-for="tag in item.tags"
                :key="tag.id"
                class="badge badge-sm badge-ghost"
              >
                {{ tag.name }}
              </span>
            </template>
            <span v-else class="text-base-content/40 text-xs">
              {{ item.emptyText || 'No tags' }}
            </span>
          </div>
        </UiPanelInfoRow>

        <!-- Default text type -->
        <UiPanelInfoRow v-else :label="item.label">
          {{ item.value ?? item.emptyText ?? '-' }}
        </UiPanelInfoRow>
      </template>
    </dl>
  </div>
</template>
