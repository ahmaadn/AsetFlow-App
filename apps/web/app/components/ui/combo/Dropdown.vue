<script setup lang="ts">
import type { ComboBoxOption as ComboBoxOptionType } from './state';

const props = defineProps<{
  options: ComboBoxOptionType[];
  highlightedIndex: number;
  isSelected?: (option: ComboBoxOptionType) => boolean;
}>();

const emit = defineEmits<{
  select: [option: ComboBoxOptionType];
  'update:highlightedIndex': [index: number];
}>();

const dropdownRef = ref<HTMLElement | null>(null);

function checkSelected(option: ComboBoxOptionType): boolean {
  return props.isSelected ? props.isSelected(option) : false;
}

defineExpose({
  dropdownRef,
});
</script>

<template>
  <div
    ref="dropdownRef"
    class="max-h-64 shadow-sm absolute left-0 right-0 top-full overflow-auto z-50 w-full min-w-52 mt-2 bg-base-100 rounded-box border border-base-300"
    role="listbox"
  >
    <ul class="menu menu-vertical rounded-box w-full">
      <UiComboOption
        v-for="(opt, index) in options"
        :key="opt.value ?? index"
        :option="opt"
        :index="index"
        :highlighted="highlightedIndex === index"
        :selected="checkSelected(opt)"
        @select="emit('select', $event)"
        @update:highlighted="emit('update:highlightedIndex', $event)"
      >
        <template #default="{ option }">
          <slot name="option" :option="option">
            {{ option.label }}
          </slot>
        </template>
      </UiComboOption>
      <li v-if="options.length === 0" class="opacity-50 italic">
        <span>No options found.</span>
      </li>
    </ul>
  </div>
</template>
