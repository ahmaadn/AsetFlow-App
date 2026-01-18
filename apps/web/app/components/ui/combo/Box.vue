<script setup lang="ts">
import { UiComboDisplay, UiComboDropdown } from '#components';
import type {
  ComboBoxOption,
  ComboBoxValue,
  ComboBoxDisplaySlotProps,
} from './state';
import {
  useComboBoxState,
  useComboBoxKeyboard,
  useComboBoxDropdown,
} from './state';

const props = withDefaults(
  defineProps<{
    options: Array<string | ComboBoxOption>;
    multiple?: boolean;
    placeholder?: string;
    id?: string;
    name?: string;
    infiniteScroll?: boolean;
    pageSize?: number;
    loading?: boolean;
    hasMore?: boolean;
  }>(),
  {
    multiple: false,
    placeholder: 'Select...',
    id: '',
    name: '',
    infiniteScroll: false,
    pageSize: 20,
    loading: false,
    hasMore: false,
  }
);

const emit = defineEmits<{
  'load-more': [];
}>();

const modelValue = defineModel<ComboBoxValue>({
  default: null,
  required: false,
});

const root = ref<HTMLElement | null>(null);
const displayRef = ref<InstanceType<typeof UiComboDisplay> | null>(null);
const dropdownRef = ref<InstanceType<typeof UiComboDropdown> | null>(null);

const localId = props.id || useId();

// Normalize options
const normalizedOptions = computed<ComboBoxOption[]>(() =>
  props.options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  )
);

// State management
const {
  query,
  isOpen,
  highlightedIndex,
  open,
  close,
  toggle,
  clear,
  selectOption,
  removeOption,
  isSelected,
} = useComboBoxState(modelValue, props.multiple);

// Filter options
const filteredOptions = computed<ComboBoxOption[]>(() => {
  if (!query.value) return normalizedOptions.value;
  return normalizedOptions.value.filter((opt) =>
    opt.label.toLowerCase().includes(query.value.toLowerCase())
  );
});

// Keyboard navigation
const dropdownElement = computed(() => dropdownRef.value?.dropdownRef ?? null);
const { onKeydown } = useComboBoxKeyboard(
  isOpen,
  highlightedIndex,
  filteredOptions,
  open,
  close,
  selectOption,
  dropdownElement
);

// Click outside to close
useComboBoxDropdown(root, close);

// Focus input when opening
watch(isOpen, (newValue) => {
  if (newValue) {
    displayRef.value?.focusInput();
  }
});

// Display slot props
const displaySlotProps = computed<ComboBoxDisplaySlotProps>(() => ({
  modelValue: modelValue.value,
  isOpen: isOpen.value,
  open,
  clear,
  toggle,
  query: query.value,
}));
</script>

<template>
  <div ref="root" class="relative w-full" @keydown="onKeydown">
    <slot name="display" v-bind="displaySlotProps">
      <UiComboDisplay
        ref="displayRef"
        :model-value="modelValue"
        :multiple="multiple"
        :placeholder="placeholder"
        :query="query"
        :is-open="isOpen"
        :local-id="localId"
        @update:query="query = $event"
        @open="open"
        @clear="clear"
        @toggle="toggle"
        @remove-option="removeOption"
      />
    </slot>

    <UiComboDropdown
      v-if="isOpen"
      ref="dropdownRef"
      :options="filteredOptions"
      :highlighted-index="highlightedIndex"
      :is-selected="isSelected"
      :infinite-scroll="infiniteScroll"
      :page-size="pageSize"
      :loading="loading"
      :has-more="hasMore"
      @select="selectOption"
      @update:highlighted-index="highlightedIndex = $event"
      @load-more="emit('load-more')"
    >
      <template #option="{ option }">
        <slot name="option" :option="option">
          {{ option.label }}
        </slot>
      </template>
    </UiComboDropdown>
  </div>
</template>
