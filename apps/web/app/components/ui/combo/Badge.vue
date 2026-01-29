<script setup lang="ts">
import type { ComboBoxOption } from './state';

defineProps<{
  option: ComboBoxOption;
}>();

const emit = defineEmits<{
  remove: [option: ComboBoxOption];
}>();
</script>

<template>
  <div class="join shadow">
    <span class="badge badge-sm join-item">{{ option.label }}</span>
    <button
      type="button"
      class="badge badge-sm join-item badge-error px-1 pointer-events-auto"
      aria-label="Remove option"
      @mousedown.prevent="emit('remove', option)"
      @click.stop
    >
      <Icon name="ri:close-line" class="h-4 w-4" />
    </button>
  </div>
</template>
