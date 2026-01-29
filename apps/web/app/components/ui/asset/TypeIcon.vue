<script setup lang="ts">
import { getIconForMimeType } from '@asetflow/shared';

interface Props {
  mimeType: string;
}

const props = defineProps<Props>();

const iconName = computed(() => getIconForMimeType(props.mimeType));
</script>

<template>
  <Icon :name="iconName" class="text-base-content/50" />
</template>
