<script setup lang="ts">
interface Props {
  isOpen: boolean;
  iconOnly?: boolean;
  iconName?: string | null;
}

withDefaults(defineProps<Props>(), {
  iconOnly: false,
  iconName: null,
});
</script>

<template>
  <button class="btn">
    <span v-if="!iconOnly" class="text-sm font-medium">
      <slot></slot>
    </span>
    <slot name="icon">
      <Icon
        :name="
          iconName
            ? iconName
            : isOpen
              ? 'ri:arrow-up-line'
              : 'ri:arrow-down-line'
        "
        class="h-4 w-4"
      />
    </slot>
  </button>
</template>
