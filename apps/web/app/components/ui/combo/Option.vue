<script setup lang="ts">
import type { ComboBoxOption } from './state';

defineProps<{
  option: ComboBoxOption;
  index: number;
  highlighted: boolean;
  selected: boolean;
}>();

const emit = defineEmits<{
  select: [option: ComboBoxOption];
  'update:highlighted': [index: number];
}>();
</script>

<template>
  <li
    :data-index="index"
    class="w-full"
    :class="{ 'bg-base-200': highlighted }"
    :aria-selected="selected"
  >
    <div
      @click.prevent="emit('select', option)"
      @mouseenter="emit('update:highlighted', index)"
      @mouseleave="emit('update:highlighted', -1)"
    >
      <span v-if="selected">✓</span>
      <span v-else class="w-4 inline-block">&nbsp;</span>
      <slot :option="option">
        {{ option.label }}
      </slot>
    </div>
  </li>
</template>
