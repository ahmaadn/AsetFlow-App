<script setup lang="ts">
interface ActionButton {
  text: string;
  icon?: string;
  class?: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
    | 'ghost';
  onClick?: () => void;
}

interface Props {
  icon?: string;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  actions?: ActionButton[];
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'ri:inbox-line',
  title: 'No data available',
  description: '',
  size: 'md',
  actions: () => [],
});

const iconSizes = {
  sm: 'size-8',
  md: 'size-12',
  lg: 'size-16',
};

const titleSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const descriptionSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const containerPadding = {
  sm: 'p-6',
  md: 'p-8',
  lg: 'p-12',
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center text-center rounded-lg bg-base-100"
    :class="containerPadding[props.size]"
  >
    <Icon
      :name="props.icon"
      class="mb-3 text-base-content/40"
      :class="iconSizes[props.size]"
    />
    <h3
      class="font-semibold text-base-content/80 mb-1"
      :class="titleSizes[props.size]"
    >
      {{ props.title }}
    </h3>
    <p
      v-if="props.description"
      class="text-base-content/60 max-w-sm"
      :class="descriptionSizes[props.size]"
    >
      {{ props.description }}
    </p>

    <!-- Action Buttons from props -->
    <div
      v-if="props.actions.length > 0"
      class="mt-4 flex flex-wrap gap-2 justify-center"
    >
      <button
        v-for="(action, index) in props.actions"
        :key="index"
        :class="[
          'btn',
          action.variant ? `btn-${action.variant}` : 'btn-primary',
          action.class ? action.class : '',
        ]"
        @click="action.onClick"
      >
        <Icon v-if="action.icon" :name="action.icon" class="size-4" />
        {{ action.text }}
      </button>
    </div>

    <!-- Custom Actions slot (backward compatibility) -->
    <div v-if="$slots.actions" class="mt-4">
      <slot name="actions" />
    </div>
  </div>
</template>
