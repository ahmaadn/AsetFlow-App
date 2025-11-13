<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<template>
  <div class="grid grid-cols-[100px_1fr] gap-2 h-8">
    <dt class="text-base-content/60">{{ label }}</dt>
    <dd class="font-medium text-base-content">
      <slot />
    </dd>
  </div>
</template>
