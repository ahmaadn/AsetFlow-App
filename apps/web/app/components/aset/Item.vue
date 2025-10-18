<script setup lang="ts">
import type { AssetType } from '~/types';

const props = defineProps<{
  type: AssetType;
  filename: string;
  selected?: boolean;
}>();

const hoverableItem = useTemplateRef<HTMLButtonElement>('hoverableItem');
const isHovered = useElementHover(hoverableItem);
</script>

<template>
  <div
    ref="hoverableItem"
    class="relative group/aset aspect-square rounded cursor-pointer"
    :class="{ 'ring-2 ring-offset-2 ring-primary': props.selected }"
  >
    <slot name="preview">
      <div class="flex items-center justify-center h-full bg-base-200">
        <Icon :name="iconMapping[props.type]" class="h-12 w-12" />
      </div>
    </slot>
    <slot name="hoverable" :is-hovered="isHovered">
      <div
        class="absolute inset-0 bg-neutral transition-opacity rounded z-1 opacity-0 group-hover/aset:opacity-30"
      />
    </slot>

    <div
      class="absolute inset-0 flex items-end p-2 opacity-0 group-hover/aset:opacity-100 transition-opacity rounded z-10"
    >
      <p class="text-neutral text-xs font-medium truncate">
        {{ props.filename }}
      </p>
    </div>
  </div>
</template>
