<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="stat-title">{{ props.title }}</div>
</template>
