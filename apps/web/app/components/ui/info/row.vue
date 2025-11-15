<script setup lang="ts">
import { formatKeyAsTitle } from '@asetflow/shared';

interface Props {
  label: string;
}

defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-[100px_1fr] gap-2 h-8">
    <dt class="text-base-content/60">{{ formatKeyAsTitle(label) }}</dt>
    <dd class="font-medium text-base-content">
      <slot />
    </dd>
  </div>
</template>
