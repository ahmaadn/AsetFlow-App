<script setup lang="ts">
const props = defineProps<{
  icon?: string;
  title?: string;
  value: string;
  desc?: string;
  color?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
}>();

const color = props.color ? `text-${props.color}` : 'text-primary';
</script>

<template>
  <div class="stat">
    <div v-if="props.icon" class="stat-figure" :class="color">
      <Icon :name="props.icon" class="w-8 h-8" />
    </div>
    <slot name="title">
      <div class="stat-title">{{ props.title }}</div>
    </slot>
    <div class="stat-value" :class="color">{{ props.value }}</div>
    <div v-if="props.desc" class="stat-desc">{{ props.desc }}</div>
    <slot />
  </div>
</template>
