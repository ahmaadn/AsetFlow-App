<script setup lang="ts">
export interface TabItem {
  key: string;
  label?: string;
  icon?: string;
  disabled?: boolean;
}

interface Emits {
  'update:modelValue': [value: string | number];
  change: [value: string | number, tab: TabItem];
}

type TabVariant = 'border' | 'box' | 'lift';
type TabSize = 'xs' | 'sm' | 'md' | 'lg';

const props = withDefaults(
  defineProps<{
    /** Array of tab items or simple string labels */
    tabs: TabItem[] | string[];
    /** Currently selected tab key or index */
    modelValue?: string | number;
    /** Tab style variant */
    variant?: TabVariant;
    /** Tab size */
    size?: TabSize;
    /** Additional classes for the tab list container */
    classTabs?: string;
    /** Show icons only (hide labels) */
    iconOnly?: boolean;
  }>(),
  {
    modelValue: 0,
    variant: 'border',
    size: 'md',
    iconOnly: false,
    classTabs: '',
  }
);

const emit = defineEmits<Emits>();

// Normalize tabs to TabItem format
const normalizedTabs = computed<TabItem[]>(() => {
  return props.tabs.map((tab, index) => {
    if (typeof tab === 'string') {
      return { key: String(index), label: tab };
    }
    return tab;
  });
});

// Get the selected key (handles both string keys and numeric indices)
const selectedKey = computed(() => {
  if (typeof props.modelValue === 'number') {
    return (
      normalizedTabs.value[props.modelValue]?.key ?? String(props.modelValue)
    );
  }
  return props.modelValue;
});

function onSelect(tab: TabItem, index: number) {
  if (tab.disabled) return;

  const value = typeof props.modelValue === 'number' ? index : tab.key;
  emit('update:modelValue', value);
  emit('change', value, tab);
}

function isSelected(tab: TabItem) {
  return tab.key === selectedKey.value;
}

// Compute tab list classes
const tabListClasses = computed(() => {
  const classes = ['tabs'];

  // Variant
  if (props.variant === 'box') classes.push('tabs-box');
  else if (props.variant === 'lift') classes.push('tabs-lift');
  else classes.push('tabs-border');

  // Size
  if (props.size !== 'md') classes.push(`tabs-${props.size}`);

  return classes;
});
</script>

<template>
  <div class="ui-tabs">
    <div role="tablist" :class="[tabListClasses, classTabs]">
      <button
        v-for="(tab, index) in normalizedTabs"
        :key="tab.key"
        role="tab"
        type="button"
        class="tab"
        :class="{
          'tab-active': isSelected(tab),
          'tab-disabled': tab.disabled,
        }"
        :disabled="tab.disabled"
        :aria-selected="isSelected(tab)"
        :aria-disabled="tab.disabled"
        @click="onSelect(tab, index)"
      >
        <Icon
          v-if="tab.icon"
          :name="tab.icon"
          class="size-5"
          :class="{
            'opacity-80 hover:opacity-100': !isSelected(tab),
            'opacity-100': isSelected(tab),
          }"
        />
        <span v-if="tab.label && !iconOnly">{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab panels slot -->
    <div v-if="$slots.default" class="tab-panels">
      <slot
        :selected="selectedKey"
        :selected-index="normalizedTabs.findIndex((t) => t.key === selectedKey)"
        :select="onSelect"
        :tabs="normalizedTabs"
      />
    </div>

    <!-- Named slots for each tab panel -->
    <template v-for="(tab, index) in normalizedTabs" :key="`panel-${tab.key}`">
      <div
        v-if="$slots[`panel-${tab.key}`] && isSelected(tab)"
        class="tab-panel"
      >
        <slot :name="`panel-${tab.key}`" :tab="tab" :index="index" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.tab {
  user-select: none;
  transition: all 0.15s ease;
}

.tab-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
