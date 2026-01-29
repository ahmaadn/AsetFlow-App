<script setup lang="ts">
import type { ComboBoxOption as ComboBoxOptionType } from './state';

const props = withDefaults(
  defineProps<{
    options: ComboBoxOptionType[];
    highlightedIndex: number;
    isSelected?: (option: ComboBoxOptionType) => boolean;
    infiniteScroll?: boolean;
    pageSize?: number;
    loading?: boolean;
    hasMore?: boolean;
  }>(),
  {
    infiniteScroll: false,
    pageSize: 20,
    loading: false,
    hasMore: false,
    isSelected: undefined,
  }
);

const emit = defineEmits<{
  select: [option: ComboBoxOptionType];
  'update:highlightedIndex': [index: number];
  'load-more': [];
}>();

const dropdownRef = ref<HTMLElement | null>(null);
const observerTarget = ref<HTMLElement | null>(null);
const displayedCount = ref(props.pageSize);

// Reset displayed count when options change
watch(
  () => props.options,
  () => {
    displayedCount.value = props.pageSize;
  }
);

// Displayed options (for client-side pagination)
const displayedOptions = computed(() => {
  if (!props.infiniteScroll) {
    return props.options;
  }
  return props.options.slice(0, displayedCount.value);
});

const hasMoreClientSide = computed(() => {
  return displayedOptions.value.length < props.options.length;
});

// Intersection Observer for infinite scroll
const loadMore = () => {
  if (props.loading) return;

  // If we have more options to show from current data
  if (hasMoreClientSide.value) {
    displayedCount.value = Math.min(
      displayedCount.value + props.pageSize,
      props.options.length
    );
  }

  // Emit event for parent to load more data if there's more from server
  if (props.hasMore) {
    emit('load-more');
  }
};

// Setup observer using VueUse
useIntersectionObserver(
  observerTarget,
  ([entry]) => {
    if (props.infiniteScroll && entry?.isIntersecting && !props.loading) {
      loadMore();
    }
  },
  {
    root: dropdownRef,
    threshold: 0.1,
  }
);

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
        v-for="(opt, index) in displayedOptions"
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

      <!-- Infinite scroll trigger & loader -->
      <li
        v-if="infiniteScroll && (hasMoreClientSide || hasMore || loading)"
        ref="observerTarget"
        class="pointer-events-none"
      >
        <div class="flex items-center justify-center py-2">
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          <span v-else class="text-xs text-base-content/50">
            Scroll for more...
          </span>
        </div>
      </li>

      <li v-if="options.length === 0" class="opacity-50 italic">
        <span>No options found.</span>
      </li>
    </ul>
  </div>
</template>
