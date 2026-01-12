<script setup lang="ts">
import { formatKeyAsTitle } from '@asetflow/shared';

interface Props {
  label: string;
}

defineProps<Props>();
</script>

<template>
  <div class="flex justify-between gap-2">
    <dt class="text-base-content/60">{{ formatKeyAsTitle(label) }}</dt>
    <dd class="font-medium text-base-content">
      <slot />
    </dd>
  </div>
</template>
