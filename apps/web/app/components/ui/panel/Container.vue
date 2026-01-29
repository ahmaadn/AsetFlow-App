<script setup lang="ts">
interface Props {
  side?: 'left' | 'right';
}

withDefaults(defineProps<Props>(), {
  side: 'right',
});
</script>

<template>
  <aside
    :class="[
      'fixed top-0 h-full w-full sm:w-95 bg-base-100 flex flex-col shrink-0 shadow-xl z-50 overflow-hidden',
      side === 'left'
        ? 'left-0 border-r border-base-300'
        : 'right-0 border-l border-base-300',
    ]"
  >
    <slot />
  </aside>
</template>
